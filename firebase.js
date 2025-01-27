import { initializeApp } from '@firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, onSnapshot } from '@firebase/firestore';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyD_x0ui5p9PV43iFjO0zLjZUGoV-wppY6o",
  authDomain: "eatfresh-8a93e.firebaseapp.com",
  databaseURL: "https://eatfresh-8a93e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eatfresh-8a93e",
  storageBucket: "eatfresh-8a93e.firebasestorage.app",
  messagingSenderId: "386594205458",
  appId: "1:386594205458:web:5f701a7e16ca82d4f0cdcb",
  measurementId: "G-LJFZ53LEP2"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebase);

const auth = getAuth(firebase);

const realtimeDb = getDatabase(firebase);

export { 
  db, 
  realtimeDb,
  auth,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  ref,
  onValue,
  onSnapshot
};

export default firebase;