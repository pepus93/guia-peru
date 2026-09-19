import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';
import { browser } from '$app/environment';

let db: Firestore | null = null;

const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
const projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;

// Solo inicializa si estamos en el navegador y hay config válida
if (browser && apiKey && projectId) {
  const firebaseConfig = {
    apiKey,
    authDomain:        import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket:     import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.PUBLIC_FIREBASE_APP_ID,
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
    });
  } catch (e) {
    console.warn('Firebase init error:', e);
    db = null;
  }
}

export { db };
export const firebaseReady = browser && db !== null;
