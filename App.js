import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ResturantsScreen } from './src/features/resturants/screens/resturants.screen';

export default function App() {

  return (
    <>
    <ResturantsScreen/>
    <StatusBar style='auto' />
    </>
  );
}


