import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker, Callout } from "react-native-maps";

export default function RestaurantMarker({ restaurant }) {
  return (
    <Marker
      coordinate={{
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      }}
      title={restaurant.name}
    >
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text>{restaurant.address}</Text>
          <Text>{restaurant.rating} stars</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  callout: {
    width: 200,
  },
  name: {
    fontWeight: "bold",
  },
});