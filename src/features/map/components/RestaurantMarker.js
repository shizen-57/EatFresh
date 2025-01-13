import React from "react";
import { Marker, Callout } from "react-native-maps";
import { View, Text, Image, StyleSheet } from "react-native";

const RestaurantMarker = ({ restaurant }) => {
  return (
    <Marker
      coordinate={{
        latitude: restaurant.location.latitude,
        longitude: restaurant.location.longitude,
      }}
      title={restaurant.name}
    >
      <Callout>
        <View style={styles.calloutContainer}>
          <Image source={{ uri: restaurant.image_url }} style={styles.image} />
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.address}>{restaurant.location.address1}</Text>
          <Text style={styles.city}>{restaurant.location.city}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  address: {
    fontSize: 14,
    marginTop: 5,
  },
  city: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default RestaurantMarker;