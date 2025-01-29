import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function BottomTabs() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Icon 
        icon="home" 
        text="Home" 
        iconFamily="home" 
        onPress={() => navigation.navigate("HomeScreen")} 
      />
      <Icon 
        icon="heart" 
        text="Favorites" 
        iconFamily="heart-outline" 
        onPress={() => navigation.navigate("FavouriteScreen")} 
      />
      <Icon 
        icon="map" 
        text="Map" 
        iconFamily="map-marker" 
        onPress={() => navigation.navigate("MapScreen")} 
      />
      <Icon 
        icon="group" 
        text="Group" 
        iconFamily="account-group" 
        onPress={() => navigation.navigate("CreateGroup")} 
      />
      <Icon 
        icon="account" 
        text="Account" 
        iconFamily="account-circle-outline" 
        onPress={() => navigation.navigate("AccountScreen")} 
      />
    </View>
  );
}

const Icon = ({ iconFamily, text, onPress }) => (
  <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
    <MaterialCommunityIcons
      name={iconFamily}
      size={24}
      style={styles.icon}
    />
    <Text style={styles.iconText}>{text}</Text>
  </TouchableOpacity>
);

const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  iconContainer: {
    alignItems: 'center',
    minWidth: 64,
  },
  icon: {
    marginBottom: 4,
    color: '#686b78',
  },
  iconText: {
    fontSize: 12,
    color: '#686b78',
    fontWeight: '500',
  },
};