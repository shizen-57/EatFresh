import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import * as Location from 'expo-location';
import { realtimeDb, ref, onValue } from "../../../firebase";
import RestaurantPreview from "./components/RestaurantPreview";
import SearchBar from "../../Components/home/SearchBar";

const OSRM_API = "https://router.project-osrm.org/route/v1";

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [route, setRoute] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);

  const [region, setRegion] = useState({
    latitude: 23.8103,
    longitude: 90.4125,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    const restaurantsRef = ref(realtimeDb, 'restaurants');
    onValue(restaurantsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const restaurantList = Object.entries(data).map(([id, details]) => ({
          id,
          ...details
        }));
        setAllRestaurants(restaurantList);
        setRestaurants(restaurantList);
      }
    });
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

  const handleCitySearch = (filteredRestaurants) => {
    if (!filteredRestaurants || (Array.isArray(filteredRestaurants) && filteredRestaurants.length === 0)) {
      setRestaurants(allRestaurants);
      return;
    }

    setRestaurants(filteredRestaurants);
    
    if (filteredRestaurants.length > 0) {
      setRegion({
        latitude: filteredRestaurants[0].location.latitude,
        longitude: filteredRestaurants[0].location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar cityHandler={handleCitySearch} />
      <MapView 
        style={styles.map}
        region={region}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}
        
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.location.latitude,
              longitude: restaurant.location.longitude
            }}
            title={restaurant.name}
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
  map: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  }
});