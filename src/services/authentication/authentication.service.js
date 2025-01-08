import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

export const loginRequest = (email, password) =>
    firebase.auth().signInWithEmailAndPassword(email, password);