# Forge Toaster example app

This is an example Atlassian Forge app demonstrating how to display a transient "flag" message (also known as a ["Toast"](https://www.suprsend.com/post/the-ultimate-guide-to-toast-messages) on some platforms) to a specific user on your Jira site. This implementation will show messages on the view issue and/or dashboard views.

## Getting Started

- Clone this repository.

- Register a copy of the app to your Atlassian account:
```
forge register
```

- Install top-level dependencies:
```
npm install
```

- Deploy your app:
```
forge deploy
```

- Install your app into an Atlassian site:
```
forge install
```

## Sending messages

- In Jira Cloud, browse to **Settings** > **Apps** > **Send User Message**.
- Pick an account to notify, select a message style, and input a message title, and description.
- When the user next browses to an issue or dashboard on your site, a [`flag`](https://developer.atlassian.com/platform/forge/custom-ui-bridge/showFlag/#showflag) will be displayed with your message.
- The message will be displayed each time the user browses to an issue or dashboard until they press the **Acknowledge** action.
- You can test the app by sending yourself a message and browsing to an issue or dashboard.

## Architecture

Forge Toaster uses three modules: 

- an [`adminPage`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-admin-page/) used to create new messages; and
- an [`issueViewBackgroundScript`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-issue-view-background-script/) and a [`dasboardBackgroundScript`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-dashboard-background-script/) that checks for pending messages and displays them to the user

The toast messages are stored as [custom entities](https://developer.atlassian.com/platform/forge/storage-reference/storage-api-custom-entities/).

## Requirements

- Requires Node v20+ (tested on v20.18.1)

## License

Copyright (c) 2025 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.
[![From Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
