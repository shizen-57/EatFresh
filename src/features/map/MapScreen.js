import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { getRestaurants } from "./components/restaurantService";
import RestaurantMarker from "./components/RestaurantMarker";

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    getRestaurants().then((data) => {
      setRestaurants(data);
    });
  }, []);

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <MapView style={styles.map} region={region}>
      {restaurants.map((restaurant) => (
        <RestaurantMarker key={restaurant.id} restaurant={restaurant} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});