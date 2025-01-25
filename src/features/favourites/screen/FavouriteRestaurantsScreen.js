import React, { useContext } from "react";
import { View, FlatList } from "react-native";
import { FavouritesContext } from "../context/FavouriteContext";
import { FavouriteRestaurantCard } from "../components/FavouriteRestaurantCard";
import { EmptyFavourites } from "../components/EmptyFavourites";

export const FavouriteRestaurantsScreen = ({ navigation }) => {
  const { favourites } = useContext(FavouritesContext);

  const navigateToRestaurant = (restaurant) => {
    navigation.navigate("RestaurantDetail", {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        image_url: restaurant.image_url,
        categories: restaurant.categories || [],
        reviews: restaurant.review_count || 0,
        rating: restaurant.rating || 0,
        price: restaurant.price || '',
        location: restaurant.location || '',
        menu: restaurant.menu || [],
        transactions: restaurant.transactions || []
      }
    });
  };

  if (!favourites.length) {
    return <EmptyFavourites />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={favourites}
        renderItem={({ item }) => (
          <FavouriteRestaurantCard
            restaurant={item}
            onPress={() => navigateToRestaurant(item)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
