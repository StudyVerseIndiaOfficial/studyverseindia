import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAAUmu5XS0ZIVg1hJyGdFuCjnI5zS6T6Tw",
  authDomain: "study-verse-india.firebaseapp.com",
  projectId: "study-verse-india",
  storageBucket: "study-verse-india.firebasestorage.app",
  messagingSenderId: "853031456465",
  appId: "1:853031456465:web:b642f0869ff1c0fa1c3ff0",
};

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);