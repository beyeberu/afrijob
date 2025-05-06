import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,  // Add this import
  updateProfile,                   // Add this import
  signInWithEmailAndPassword,      // Add this import
  signOut                          // Add this import
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6-7c1dZHoJEf1mdrcCr0uuPVX4IZsS0A",
  authDomain: "afrijob-a8080.firebaseapp.com",
  projectId: "afrijob-a8080",
  storageBucket: "afrijob-a8080.appspot.com",
  messagingSenderId: "507647181401",
  appId: "1:507647181401:web:abd28a95153bae40696748",
  measurementId: "G-M69PBRSW47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export all the authentication methods you need
export { 
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut
};