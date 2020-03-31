import firebase from 'firebase'

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.CLIENT_FIREBASE_API_KEY,
      authDomain: process.env.CLIENT_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.CLIENT_FIREBASE_DATABASE_URL,
      projectId: process.env.CLIENT_FIREBASE_PROJECT_ID,
      storageBucket: process.env.CLIENT_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.CLIENT_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.CLIENT_FIREBASE_APP_ID
    });
  }
}