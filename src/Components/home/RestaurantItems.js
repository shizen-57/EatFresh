import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FavouritesContext } from "../../features/favourites/context/FavouriteContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function RestaurantItems({ navigation, restaurantData }) {
  const { favourites, addToFavourites, removeFromFavourites } = useContext(FavouritesContext);

  const isFavourite = (restaurant) => {
    return favourites.find((r) => r.id === restaurant.id);
  };

  const toggleFavourite = (restaurant) => {
    if (isFavourite(restaurant)) {
      removeFromFavourites(restaurant);
    } else {
      addToFavourites(restaurant);
    }
  };

  return (
    <View style={styles.container}>
      {restaurantData.map((restaurant) => (
        <TouchableOpacity
          key={restaurant.id}
          activeOpacity={0.9}
          style={styles.restaurantCard}
          onPress={() => {
            // Create full restaurant object with menu data
            const restaurantWithMenu = {
              ...restaurant,
              menu: restaurant.menu || []  // Ensure menu exists
            };
            
            navigation.navigate("RestaurantDetail", {
              id: restaurant.id.replace('restaurantId', ''),
              restaurant: restaurantWithMenu
            });
          }}
        >
          <RestaurantImage image={restaurant.image_url} />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 20,
              top: 20,
              zIndex: 1,
              padding: 10,
            }}
            onPress={() => toggleFavourite(restaurant)}
          >
            <FontAwesome
              name={isFavourite(restaurant) ? "heart" : "heart-o"}
              size={25}
              color={isFavourite(restaurant) ? "red" : "gray"}
            />
          </TouchableOpacity>
          <RestaurantInfo name={restaurant.name} rating={restaurant.rating} transactions={restaurant.transactions} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const RestaurantImage = (props) => (
  <View style={styles.imageContainer}>
    <Image
      source={{
        uri: props.image,
      }}
      style={styles.image}
    />
  </View>
);

const RestaurantInfo = (props) => (
  <View style={styles.infoContainer}>
    <View>
      <Text style={styles.restaurantName}>{props.name}</Text>
      <Text style={styles.deliveryTime}>30-45 • min</Text>
      <Text style={styles.transactions}>{props.transactions.join(', ')}</Text>
    </View>
    <View style={styles.ratingContainer}>
      <Text>{props.rating}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  restaurantCard: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  heartButton: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    padding: 8,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 13,
    color: "gray",
  },
  transactions: {
    fontSize: 13,
    color: "gray",
  },
  ratingContainer: {
    backgroundColor: "#eee",
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  }
});