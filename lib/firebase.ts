import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCd80w32SFJoCN7LJnW38gbFgk_szUoukk",
  authDomain: "medisense-77c10.firebaseapp.com",
  projectId: "medisense-77c10",
  storageBucket: "medisense-77c10.firebasestorage.app",
  messagingSenderId: "731215002149",
  appId: "1:731215002149:web:31e8d22db8d6b166ff5dcc",
  measurementId: "G-R1HVDP0066",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export { app };
