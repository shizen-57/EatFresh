import React from "react";
import { Marker } from "react-native-maps";
import { View, Image, StyleSheet } from "react-native";

const RestaurantMarker = ({ restaurant, onPress }) => {
  // Add multiple validation checks
  if (!restaurant?.location) {
    console.warn('Restaurant location is missing:', restaurant?.name);
    return null;
  }

  const latitude = parseFloat(restaurant.location.latitude);
  const longitude = parseFloat(restaurant.location.longitude);

  if (isNaN(latitude) || isNaN(longitude)) {
    console.warn('Invalid coordinates for restaurant:', restaurant.name);
    return null;
  }

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <View style={styles.marker}>
          <Image 
            source={{ uri: restaurant.image_url }} 
            style={styles.markerImage}
          />
        </View>
        <View style={styles.markerStick} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2, // Ensure the marker is on top
    elevation: 3, // Ensure the marker is on top for Android
  },
  marker: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 2,
    borderWidth: 2,
    borderColor: '#FF4B4B',
    zIndex: 3, // Ensure the marker is on top
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 4, // Ensure the marker is on top for Android
  },
  markerImage: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  markerStick: {
    width: 2,
    height: 10,
    backgroundColor: '#FF4B4B',
    marginTop: -2,
    zIndex: 1, // Ensure the marker stick is on top
    elevation: 3, // Ensure the marker stick is on top for Android
  },
});

export default RestaurantMarker;