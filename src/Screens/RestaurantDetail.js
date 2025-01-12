import React from "react";
import { View, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import About from "../Components/RestaurantDetail/About";
import MenuItems from "../Components/RestaurantDetail/MenuItems";
import ViewCart from "../Components/RestaurantDetail/ViewCart";

export default function RestaurantDetail({ route, navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <About route={route} />
      <Divider width={1.8} style={{ marginVertical: 20 }} />
      <View style={{ flex: 1 }}>
        <MenuItems restaurantName={route.params.name} foods={route.params.menu} />
      </View>
      <ViewCart navigation={navigation} />
    </View>
  );
}