import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBx-3PuQOy3Wcy2JXNEpZv6caDi-ekATQg",
  authDomain: "mindx-e98ff.firebaseapp.com",
  databaseURL:
    "https://mindx-e98ff-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mindx-e98ff",
  storageBucket: "mindx-e98ff.firebasestorage.app",
  messagingSenderId: "731403426879",
  appId: "1:731403426879:web:6c48376164989c9d52ec8a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export { app };
