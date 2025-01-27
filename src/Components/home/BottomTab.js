import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export default function BottomTabs() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon icon="home" text="Home" iconFamily="home-variant" onPress={() => navigation.navigate("HomeScreen")} />
      <Icon icon="heart" text="Favorites" iconFamily="heart" onPress={() => navigation.navigate("FavouriteScreen")} />
      <Icon icon="map" text="Map" iconFamily="map-marker" onPress={() => navigation.navigate("MapScreen")} />
      <Icon icon="account" text="Account" iconFamily="account" onPress={() => navigation.navigate("AccountScreen")} />
      <Icon icon="group" text="Group" iconFamily="account-group" onPress={() => navigation.navigate("CreateGroup")} />
    </View>
  );
}

const Icon = ({ iconFamily, text, onPress }) => (
  <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
    <MaterialCommunityIcons
      name={iconFamily}
      size={26}
      style={styles.icon}
    />
    <Text style={styles.iconText}>{text}</Text>
  </TouchableOpacity>
);

const styles = {
  container: {
    flexDirection: "row",
    margin: 10,
    marginHorizontal: 30,
    justifyContent: "space-between",
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 3,
    color: '#333',
  },
  iconText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
};