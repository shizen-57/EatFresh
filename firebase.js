import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
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
const app = initializeApp(firebaseConfig);

// Initialize services
const firestore = getFirestore(app);
const auth = getAuth(app);
const realtimeDb = getDatabase(app);

export { firestore, auth, realtimeDb };
export default app;