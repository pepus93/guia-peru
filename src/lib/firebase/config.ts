import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';
import { browser } from '$app/environment';
import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_APP_ID,
} from '$env/static/public';

let db: Firestore | null = null;

// Solo inicializa si estamos en el navegador y hay config válida
if (browser && PUBLIC_FIREBASE_API_KEY && PUBLIC_FIREBASE_PROJECT_ID) {
  const firebaseConfig = {
    apiKey:            PUBLIC_FIREBASE_API_KEY,
    authDomain:        PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:     PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             PUBLIC_FIREBASE_APP_ID,
  };

  try {
    const app: FirebaseApp = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig);

    // Offline persistence con la API moderna de Firebase 10
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
      ignoreUndefinedProperties: true,
    });
  } catch (e) {
    console.warn('Firebase init error:', e);
    db = null;
  }
}

export { db };
export const firebaseReady = browser && db !== null;
