// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCId5NaVgq1fazWyG0-V_gJGSbPeGEkEJM",
  authDomain: "farmermanage-eeb9b.firebaseapp.com",
  projectId: "farmermanage-eeb9b",
  storageBucket: "farmermanage-eeb9b.appspot.com",
  messagingSenderId: "46933440530",
  appId: "1:46933440530:web:53847e80eab2d98f9cc0cb",
  measurementId: "G-7G7T91XRMH"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
