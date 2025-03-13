import Resolver from '@forge/resolver';
import api, { route, storage, WhereConditions } from '@forge/api';
import crypto from 'crypto';

const resolver = new Resolver();

resolver.define('fetchMyToasts', async ({ context: { accountId } }) => {
  const query = await storage
    .entity("toast")
    .query()
    .index("accountId")
    .where(WhereConditions.equalsTo(accountId))
    .limit(100) // note - processes at most 100 schedules
    .getMany();

    return query.results.map(result => {
      return {
        id: result.key,
        ...result.value
      }
    });
});

resolver.define('clearToast', async ({ payload: { toastId }, context: { accountId } }) => {
  const toast = await storage.entity("toast").get(toastId);

  // only the user viewing the toast or an admin can clear it
  if (toast.accountId === accountId || await isUserAdmin()) {
    await storage.entity("toast").delete(toastId);
  } else {
    console.error(`Account ${accountId} is not authorized to clear toast ${toastId} - it belongs to ${toast.accountId}`);
  }
});

resolver.define('sendToast', async ({ payload: { accountId, type, title, description } }) => {
  if (!await isUserAdmin()) {
    console.error(`Account ${accountId} is not authorized to send toasts`);
    return;
  }

  console.log(`Saving toast to ${accountId} of type ${type} with title ${title} and description ${description}`);

  const uuid = crypto.randomUUID();
  await storage.entity("toast").set(uuid, {
    accountId,
    type,
    title,
    description
  });
});

resolver.define('fetchAllPendingToasts', async () => {
  if (!await isUserAdmin()) {
    console.error(`Account ${accountId} is not authorized to fetch all pending toasts`);
    return;
  }

  const query = await storage
    .entity("toast")
    .query()
    .index("by-key")
    .limit(100)
    .getMany();

  console.log(`fetchAllPendingToasts`, JSON.stringify(query, 2, null));
  
  return query.results.map(result => {
    return {
      id: result.key,
      ...result.value
    }
  });
});

export const handler = resolver.getDefinitions();

async function isUserAdmin() {
  const response = await api.asUser().requestJira(route`/rest/api/3/mypermissions?permissions=ADMINISTER`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const msg = `Failed to check admin permissions: ${response.statusText}`;
    console.error(msg);
    throw new Error(msg);
  }

  const body = await response.json();
  return body.permissions.ADMINISTER.havePermission;
}
