import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function RestaurantItems({ navigation, restaurantData }) {
  return (
    <View style={styles.container}>
      {restaurantData.map((restaurant) => (
        <TouchableOpacity
          key={restaurant.id}
          activeOpacity={0.9}
          style={styles.restaurantCard}
          onPress={() =>
            navigation.navigate("RestaurantDetail", {
              id: restaurant.id,
              name: restaurant.name,
              image: restaurant.image_url,
              price: restaurant.price,
              reviews: restaurant.review_count,
              rating: restaurant.rating,
              categories: restaurant.categories,
              menu: restaurant.menu,
              location: restaurant.location
            })
          }
        >
          <RestaurantImage image={restaurant.image_url} />
          <RestaurantInfo name={restaurant.name} rating={restaurant.rating} />
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
    <TouchableOpacity style={styles.heartButton}>
      <MaterialCommunityIcons name="heart-outline" size={25} color="#fff" />
    </TouchableOpacity>
  </View>
);

const RestaurantInfo = (props) => (
  <View style={styles.infoContainer}>
    <View>
      <Text style={styles.restaurantName}>{props.name}</Text>
      <Text style={styles.deliveryTime}>30-45 • min</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  ratingContainer: {
    backgroundColor: "#eee",
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  }
});