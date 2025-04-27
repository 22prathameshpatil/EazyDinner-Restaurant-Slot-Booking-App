// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_nHX3K5AWLCrrYfzSI-Mtr9rnoDD83Zk",
  authDomain: "food-delivery-abfcb.firebaseapp.com",
  projectId: "food-delivery-abfcb",
  storageBucket: "food-delivery-abfcb.firebasestorage.app",
  messagingSenderId: "434415218552",
  appId: "1:434415218552:web:2c66db488bb248312da28d",
  measurementId: "G-7YE2HCMQDK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

