import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyA8X9e5x89UNdwPB910w9LNAmpdzxgCydU",
    authDomain: "ainutrition-1132b.firebaseapp.com",
    projectId: "ainutrition-1132b",
    storageBucket: "ainutrition-1132b.firebasestorage.app",
    messagingSenderId: "783970404500",
    appId: "1:783970404500:web:41ba60b349473efce9cc81",
    measurementId: "G-TZNR0KMV30"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);