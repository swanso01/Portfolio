import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase setup details
const firebaseConfig = {
  apiKey: "AIzaSyDbhYC9mcX2toGXuAfXxGRNe78ZJiATYoc",
  authDomain: "thefinal-37879.firebaseapp.com",
  projectId: "thefinal-37879",
  storageBucket: "thefinal-37879.appspot.com",
  messagingSenderId: "759152337297",
  appId: "1:759152337297:web:0abeb0ecff740ab98a3a30",
};

// Start Firebase
const app = initializeApp(firebaseConfig);

// Set up Firestore database
export const db = getFirestore(app);

// Set up Firebase Auth
export const auth = getAuth(app);