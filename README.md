# IRIS Backoffice

## Development

### Setup [.env](.env) file for local development and deployment

1. Open [.env](.env) file and add random string value here:

        SERVER_SESSION_SECRET=...

2. Open [Firebase Console](https://console.firebase.google.com/) and Navigate to your Project
3. Navigate to Project Settings > Service Accounts and generate new Admin SDK Private Key and add values to the following entries:

        SERVER_FIREBASE_PROJECT_ID=...
        SERVER_FIREBASE_PRIVATE_KEY_ID=...
        SERVER_FIREBASE_PRIVATE_KEY_BASE64=... # NOTE: this needs to be manually encoded into base64
        SERVER_FIREBASE_CLIENT_EMAIL=...
        SERVER_FIREBASE_CLIENT_ID=...
        SERVER_FIREBASE_AUTH_URI=...
        SERVER_FIREBASE_TOKEN_URI=...
        SERVER_FIREBASE_AUTH_PROVIDER_X509_CERT_URL=...
        SERVER_FIREBASE_CLIENT_X509_CERT_URL=...

4. Navigation to Project Settings > General, get Firebase SDK Config for your web application and add values to the following entries:

        CLIENT_FIREBASE_API_KEY=...
        CLIENT_FIREBASE_AUTH_DOMAIN=...
        CLIENT_FIREBASE_DATABASE_URL=...
        CLIENT_FIREBASE_PROJECT_ID=...
        CLIENT_FIREBASE_STORAGE_BUCKET=...
        CLIENT_FIREBASE_MESSAGING_SENDER_ID=...
        CLIENT_FIREBASE_APP_ID=...

4. For deployment: Add secrets to Zeit Now `

### Install it and run locally:

```sh
npm install
npm run dev
```

### Deploy it:

1. Install Zeit Now client `npm install now`
2. Upload Secrets from local [.env](.env] file using `scripts/upload-secrets-to-zeit-now.sh`
3. Run `now`

## Libraries

[Firebase](https://firebase.google.com/) for database and authentication
[Zeit Now](https://zeit.co/) for hosting server and client code
[Next.js](https://github.com/zeit/next.js) is a framework for server-rendered React apps
[Material UI](https://github.com/mui-org/material-ui) for UI
