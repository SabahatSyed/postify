import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAI7v4JWrasid3ZY3rvRijNb2-Y_WP4-Go",
  authDomain: "postify-8cb58.firebaseapp.com",
  projectId: "postify-8cb58",
  storageBucket: "postify-8cb58.appspot.com",
  messagingSenderId: "181915225399",
  appId: "1:181915225399:web:ea7eafda4872cf61519eb2",
  measurementId: "G-GJM302WLZG",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
