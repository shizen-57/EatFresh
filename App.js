import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackN from './src/Nav/StackN';

// Firebase imports
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
  useEffect(() => {
    // Check authentication state
    const subscriber = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in');
      } else {
        console.log('No user is signed in');
      }
    });

    // Cleanup subscription on unmount
    return () => subscriber();
  }, []);

  return (
    <NavigationContainer>
      <StackN />
    </NavigationContainer>
  );
}