import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigation from "./src/infrastructure/Navigation/app.navigator";
import { CartProvider } from './src/context/CartContext';
import { FavouritesContextProvider } from "./src/features/favourites/context/FavouriteContext";
import { GroupOrderProvider } from './src/features/group_ordering/context/GroupOrderContext';
import { CateringProvider } from './src/features/catering/context/CateringContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for any necessary state to load
        await AsyncStorage.getItem('groupOrderState');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <CartProvider>
      <FavouritesContextProvider>
        <GroupOrderProvider>
          <CateringProvider>
            <RootNavigation />
          </CateringProvider>
        </GroupOrderProvider>
      </FavouritesContextProvider>
    </CartProvider>
  );
}