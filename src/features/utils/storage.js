import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFavourites = async (favourites) => {
  try {
    await AsyncStorage.setItem('favourites', JSON.stringify(favourites));
  } catch (error) {
    console.error('Error saving favourites:', error);
  }
};

export const loadFavourites = async () => {
  try {
    const favourites = await AsyncStorage.getItem('favourites');
    return favourites ? JSON.parse(favourites) : [];
  } catch (error) {
    console.error('Error loading favourites:', error);
    return [];
  }
};