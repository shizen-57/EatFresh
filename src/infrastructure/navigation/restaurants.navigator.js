import React from "react";
import { Text } from "react-native";
import { 
    createStackNavigator,
    TransitionPresets
 } from "@react-navigation/stack";
import { RestaurantsScreen } from "../../features/resturants/screens/restaurants.screen";
import { RestaurantDetailScreen } from "../../features/restaurants/screens/restaurant_detail.screen";

const RestaurantStack = createStackNavigator();

export const RestaurantsNavigator = () => {
    return(
        <RestaurantStack.Navigator screenOptions={{
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        >
            <RestaurantStack.Screen
            name="Restaurant"
            component={RestaurantsScreen}
              />
            <RestaurantStack.Screen
            name="RestaurantDetail"
            component={RestaurantDetailScreen}
            />
        </RestaurantStack.Navigator>
    );
};