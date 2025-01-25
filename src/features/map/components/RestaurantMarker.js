import React from "react";
import { Marker, Callout } from "react-native-maps";
import { View, Text, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        <MaterialCommunityIcons 
          name="map-marker" 
          size={40} 
          color="#FF4B4B"
        />
        <View style={styles.markerImageContainer}>
          <Image 
            source={{ uri: restaurant.image_url }} 
            style={styles.markerImage}
          />
        </View>
      </View>

      <Callout>
        <View style={styles.calloutContainer}>
          <Image source={{ uri: restaurant.image_url }} style={styles.image} />
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
            <Text style={styles.price}>{restaurant.price}</Text>
            <Text style={styles.reviews}>({restaurant.review_count} reviews)</Text>
          </View>
          <Text style={styles.categories}>
            {restaurant.categories.join(" • ")}
          </Text>
          <Text style={styles.address}>{restaurant.location.address1}</Text>
          <Text style={styles.city}>
            {restaurant.location.city}, {restaurant.location.state} {restaurant.location.zip_code}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 50,
    height: 50,
  },
  markerImageContainer: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FF4B4B',
  },
  markerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  rating: {
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  price: {
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  reviews: {
    color: '#666',
    fontSize: 12,
  },
  categories: {
    color: '#666',
    fontSize: 13,
    marginTop: 3,
    fontStyle: 'italic',
  },
});

export default RestaurantMarker;