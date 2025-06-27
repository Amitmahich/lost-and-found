import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBDh2HyiVNU4IEOYuA0S2-qaMGtgxdT_ac",
  authDomain: "chat-app-17f0d.firebaseapp.com",
  databaseURL: "https://chat-app-17f0d-default-rtdb.firebaseio.com",
  projectId: "chat-app-17f0d",
  storageBucket: "chat-app-17f0d.firebasestorage.app",
  messagingSenderId: "584594257131",
  appId: "1:584594257131:web:7ce68ede1895eb4f40faae",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
