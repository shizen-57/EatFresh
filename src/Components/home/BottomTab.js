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
      size={22}  // proportionally decreased
      style={styles.icon}
    />
    <Text style={styles.iconText}>{text}</Text>
  </TouchableOpacity>
);

const styles = {
  container: {
    flexDirection: "row",
    margin: 8,
    marginHorizontal: 20,
    justifyContent: "space-between",
    backgroundColor: '#008b8b', // deep cyan
    borderRadius: 30,
    padding: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'absolute',
    bottom: 10,
    left: 1,
    right: 1,
  },
  iconContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    marginBottom: 2,  // reduced spacing
    color: '#fff',
  },
  iconText: {
    fontSize: 10,  // proportionally decreased
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
};