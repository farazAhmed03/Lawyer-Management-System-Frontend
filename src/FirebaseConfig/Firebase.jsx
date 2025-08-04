import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPEK3U0C113X8z-FQKTWtDoLOUjIvfymI",
  authDomain: "lms-auth-289b4.firebaseapp.com",
  projectId: "lms-auth-289b4",
  storageBucket: "lms-auth-289b4.appspot.com",
  messagingSenderId: "493991414983",
  appId: "1:493991414983:web:b63a8cd6a081e7c4acc2e2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
