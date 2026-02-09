// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyC13_3Ge1pqNWMFqYunGU23lhI_mzXa5rY",
  authDomain: "maua-s-flowers.firebaseapp.com",
  projectId: "maua-s-flowers",
  storageBucket: "maua-s-flowers.firebasestorage.app",
  messagingSenderId: "763997494635",
  appId: "1:763997494635:web:f5149323064cdc6ddcc02e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
