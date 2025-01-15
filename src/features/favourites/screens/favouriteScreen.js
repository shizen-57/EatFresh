import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFavourites } from '../hooks/useFavourites';
import FavouriteItem from '../components/FavouriteItem';
import EmptyFavourites from '../components/EmptyFavourites';
import { REMOVE_FROM_FAVOURITES } from '../../../redux/types/favouriteTypes';

export default function FavouriteScreen({ navigation }) {
  const dispatch = useDispatch();
  const { favourites } = useFavourites();

  const handleRemove = (item) => {
    dispatch({ type: REMOVE_FROM_FAVOURITES, payload: item });
  };

  const handlePress = (item) => {
    navigation.navigate("RestaurantDetail", {
      name: item.restaurantName,
      selectedItem: item,
    });
  };

  if (favourites.length === 0) {
    return <EmptyFavourites />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        renderItem={({ item }) => (
          <FavouriteItem
            item={item}
            onRemove={() => handleRemove(item)}
            onPress={() => handlePress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});