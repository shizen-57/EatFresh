// MapScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from 'expo-location';
import { realtimeDb, ref, onValue } from "../../../firebase";
import RestaurantPreview from "./components/RestaurantPreview";
import SearchBar from "../../Components/home/SearchBar";
import { MaterialIcons } from '@expo/vector-icons';

const OSRM_API = "https://router.project-osrm.org/route/v1";
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const INITIAL_REGION = {
  latitude: 23.8103,
  longitude: 90.4125,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export default function MapScreen() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [route, setRoute] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState(INITIAL_REGION);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          if (isMounted) setIsLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation(location);
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 1000);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Location error:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    initializeMap();

    const restaurantsRef = ref(realtimeDb, 'restaurants');
    const unsubscribe = onValue(restaurantsRef, (snapshot) => {
      if (snapshot.exists() && isMounted) {
        const data = snapshot.val();
        const restaurantList = Object.entries(data).map(([id, details]) => ({
          id,
          ...details
        }));
        setAllRestaurants(restaurantList);
        setRestaurants(restaurantList);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const getRoute = async (startLat, startLon, endLat, endLon) => {
    try {
      const response = await fetch(
        `${OSRM_API}/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        setRoute({
          coordinates: data.routes[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
          })),
          distance: (data.routes[0].distance / 1000).toFixed(2),
          duration: Math.round(data.routes[0].duration / 60)
        });
      }
    } catch (error) {
      console.error("Routing error:", error);
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    if (location) {
      getRoute(
        location.coords.latitude,
        location.coords.longitude,
        restaurant.location.latitude,
        restaurant.location.longitude
      );
    }
  };

  const handleMapPress = () => {
    setSelectedRestaurant(null);
    setRoute(null);
  };

  const centerOnUserLocation = () => {
    if (location) {
      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      mapRef.current?.animateToRegion(userRegion, 1000);
    }
  };

  const handleSearch = (locations) => {
    if (locations && locations.length > 0) {
      setSelectedRestaurant(null);
      setRoute(null);
      setRestaurants(locations);
      
      const firstLocation = locations[0];
      const searchRegion = {
        latitude: firstLocation.location.latitude,
        longitude: firstLocation.location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      mapRef.current?.animateToRegion(searchRegion, 1000);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={handleMapPress}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={`restaurant-${restaurant.id}`}
            coordinate={{
              latitude: restaurant.location.latitude,
              longitude: restaurant.location.longitude
            }}
            title={restaurant.name}
            description={restaurant.location.address1}
            onPress={() => handleRestaurantSelect(restaurant)}
          />
        ))}

        {route && (
          <Polyline
            coordinates={route.coordinates}
            strokeWidth={3}
            strokeColor="#000"
          />
        )}
      </MapView>

      <SearchBar cityHandler={handleSearch} style={styles.searchBar} />

      <TouchableOpacity 
        style={[
          styles.locationButton,
          selectedRestaurant && styles.locationButtonWithPreview
        ]}
        onPress={centerOnUserLocation}
      >
        <MaterialIcons name="my-location" size={24} color="black" />
      </TouchableOpacity>

      {selectedRestaurant && (
        <RestaurantPreview 
          restaurant={selectedRestaurant}
          route={route}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 10,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationButtonWithPreview: {
    bottom: 400,
  }
});