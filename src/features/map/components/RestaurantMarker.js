import React from "react";
import { Marker } from "react-native-maps";
import { View, Image, StyleSheet } from "react-native";

const RestaurantMarker = ({ restaurant, onPress }) => {
  if (!restaurant.location?.latitude || !restaurant.location?.longitude) {
    console.error('Invalid location data for restaurant:', restaurant.name);
    return null;
  }

  return (
    <Marker
      coordinate={{
        latitude: restaurant.location.latitude,
        longitude: restaurant.location.longitude,
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
    zIndex: 1, // Ensure the marker is on top
  },
  marker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 3,
    borderWidth: 2,
    borderColor: '#FF4B4B',
    zIndex: 2, // Ensure the marker is on top
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 3, // Ensure the marker is on top for Android
  },
  markerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  markerStick: {
    width: 2,
    height: 15,
    backgroundColor: '#FF4B4B',
    marginTop: -3,
    zIndex: 1, // Ensure the marker stick is on top
    elevation: 3, // Ensure the marker stick is on top for Android
  },
});

export default RestaurantMarker;