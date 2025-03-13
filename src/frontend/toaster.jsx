import React, { useEffect } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke, showFlag } from '@forge/bridge';

export const BackgroundScript = () => {
  async function showToast(id, type, title, description) {
    const flag = showFlag({ 
      id, type, title, description,
      actions: [
        {
          text: 'Acknowledge',
          onClick: async () => {
            invoke('clearToast', { toastId: id });
            flag.close();
          },
        }
      ],
    });
  }

  async function showMyToasts() {
    const toasts = await invoke('fetchMyToasts');
    toasts.forEach(toast => {
      showToast(toast.id, toast.type, toast.title, toast.description);
    });
  }

  useEffect(() => {
    showMyToasts();
  }, []);

  return null;
};

ForgeReconciler.render(
  <React.StrictMode>
    <BackgroundScript />
  </React.StrictMode>
);
