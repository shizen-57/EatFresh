import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as Location from 'expo-location';
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import SearchBar from './SearchBar';

export default function HeaderTabs() {
  const [location, setLocation] = useState(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(location.coords);
      if (address.length > 0) {
        setLocation(address[0].suburb || address[0].city || address[0].region || "Unknown Location");
      }
    })();

    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      }
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.topSection}>
        <Image 
          source={require('../../../assets/location.png')}
          style={styles.locationIcon}
        />
        <View style={styles.locationInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.location}>Current Location: {location}</Text>
        </View>
        <TouchableOpacity style={styles.profile}>
          <Image 
            source={require('../../../assets/profile.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <SearchBar containerStyle={styles.searchContainer} />

      <View style={styles.snaccBar}>
        <Text style={styles.snaccText}>
          EatFresh <Text style={styles.snaccSubText}>Dope dishes in minutes!</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fc8019",
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
    marginBottom: 5,
  },
  location: {
    color: "#ffffff",
    fontSize: 12,
    marginLeft: 5,
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  profile: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 5,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchContainer: {
    marginVertical: 12, // Increased from 10
    backgroundColor: 'transparent',
    paddingHorizontal: 5, // Added padding
  },
  snaccBar: {
    backgroundColor: "rgba(40, 44, 63, 0.9)",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    marginTop: 10,
  },
  snaccText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  snaccSubText: {
    fontSize: 12,
    fontWeight: "normal",
  },
});