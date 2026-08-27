
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAaSlTrEcaBv8tvBm5KRdPIX86bxG7qtFQ",
    authDomain: "devtrace-312ee.firebaseapp.com",
    projectId: "devtrace-312ee",
    storageBucket: "devtrace-312ee.firebasestorage.app",
    messagingSenderId: "581133342872",
    appId: "1:581133342872:web:a3e014e5fcfdb586f618ed"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);