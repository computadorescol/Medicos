// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCA3LbdOirsFFblhHR_IEqsR34ZnSjAYGI",
  authDomain: "mediconsulta-online.firebaseapp.com",
  projectId: "mediconsulta-online",
  storageBucket: "mediconsulta-online.firebasestorage.app",
  messagingSenderId: "470410340897",
  appId: "1:470410340897:web:801a2d77703ae909cb5160",
  measurementId: "G-Y4N5E64WK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth };