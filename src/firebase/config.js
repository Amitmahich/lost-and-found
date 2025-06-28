import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCFtSCUTtWELKqtc8AWqUMSqmL5nhTsi94",
  authDomain: "lost-and-found-5b001.firebaseapp.com",
  projectId: "lost-and-found-5b001",
  storageBucket: "lost-and-found-5b001.firebasestorage.app",
  messagingSenderId: "588180578519",
  appId: "1:588180578519:web:82fdecf799d3271f06d092",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
