
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';

// NOTE: import.meta is available in module code (Vite), but NOT in DevTools console.
const env = (import.meta as any).env ?? {};

console.log("[ENV CHECK]", {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};
const isGeminiPreview =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('aistudio.google.com');

if (!isGeminiPreview) {
  logFirebaseDiagnostics();
}

// --- Diagnostics ---
function logFirebaseDiagnostics() {
  const required = {
    VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
    VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
    VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
    VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
    VITE_FIREBASE_APP_ID: firebaseConfig.appId,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value || String(value).trim() === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(
      "[Firebase Diagnostics] Auth service not configured. Missing variables:",
      missing
    );
    console.warn(
      "[Firebase Diagnostics] To enable Auth, create .env.local with these variables."
    );
  } else {
    console.info(
      "[Firebase Diagnostics] Firebase configuration detected. Auth should be available."
    );
  }
}

// Call diagnostics immediately
logFirebaseDiagnostics();

// Check if critical keys are present
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

// Initialize only if configured
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.debug('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase config missing or incomplete. App running in offline/mock mode.');
}

// --- Storage Utilities ---

export const dataURLtoBlob = (dataurl: string): Blob => {
  try {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (!match) throw new Error('Invalid data URL');
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error("Blob conversion error", e);
    return new Blob([]);
  }
};

export const uploadImage = async (file: File | Blob, path: string): Promise<string> => {
  if (!storage) throw new Error("Storage not configured");
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export { app, db, storage, auth, googleProvider };
