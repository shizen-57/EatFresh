<<<<<<< HEAD
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackN from './src/Nav/StackN';

// Firebase imports
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
  useEffect(() => {
    // Check authentication state
    const subscriber = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in');
      } else {
        console.log('No user is signed in');
      }
    });

    // Cleanup subscription on unmount
    return () => subscriber();
  }, []);

  return (
    <NavigationContainer>
      <StackN />
    </NavigationContainer>
=======
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from "react";
import { Text } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";

import { theme } from "./src/infrastructure/theme";
import { RestaurantsScreen } from "./src/features/resturants/screens/restaurants.screen";
import { SafeArea } from "./src/components/utility/safe_area.component";

import { restaurantsRequest } from "./src/services/restaurants/restaurants.service"
import { RestaurantsContextProvider } from "./src/services/restaurants/restaurants.context";
import { LocationContextProvider } from "./src/services/location/location.context";
import { RestaurantsNavigator } from "./src/infrastructure/navigation/restaurants.navigator";
const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Restaurants: "restaurant",
  Map: "map",
  Settings: "settings",
};


const Settings = () => (
  <SafeArea>
    <Text>Settings</Text>
  </SafeArea>
);
const Map = () => (
  <SafeArea>
    <Text>Map</Text>
  </SafeArea>
);

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
  };
};

export default function App() {
  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });

  const [latoLoaded] = useLato({
    Lato_400Regular,
  });

  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
      <LocationContextProvider>
          <RestaurantsContextProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={createScreenOptions}
                tabBarOptions={{
                  activeTintColor: "tomato",
                  inactiveTintColor: "gray",
                }}
              >
                <Tab.Screen name="Restaurants" component={RestaurantsNavigator} />
                <Tab.Screen name="Map" component={Map} />
                <Tab.Screen name="Settings" component={Settings} />
              </Tab.Navigator>
            </NavigationContainer>
          </RestaurantsContextProvider>
        </LocationContextProvider>
      </ThemeProvider>
      <ExpoStatusBar style="auto" />
    </>
>>>>>>> 8456e89e1ac2353da87da5a980d5e23ebfcd0661
  );
}