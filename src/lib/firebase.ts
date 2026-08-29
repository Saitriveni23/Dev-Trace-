import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAaSlTrEcaBv8tvBm5KRdPIX86bxG7qtFQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "devtrace-312ee.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "devtrace-312ee",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "devtrace-312ee.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "581133342872",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:581133342872:web:a3e014e5fcfdb586f618ed"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

