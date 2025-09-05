// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAjKqCmLHIxGZkKFIDKx2egHS1PVdYZBLc",
  authDomain: "swachh-116a6.firebaseapp.com",
  projectId: "swachh-116a6",
  storageBucket: "swachh-116a6.firebasestorage.app",
  messagingSenderId: "294113107911",
  appId: "1:294113107911:web:44a2eb8c5358696f54c3e2",
  measurementId: "G-6HJHL6B2XP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
