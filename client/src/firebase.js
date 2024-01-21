// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestateapp-8af8f.firebaseapp.com",
  projectId: "realestateapp-8af8f",
  storageBucket: "realestateapp-8af8f.appspot.com",
  messagingSenderId: "761997555322",
  appId: "1:761997555322:web:3a4d1b6507ac2647cbedc3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);