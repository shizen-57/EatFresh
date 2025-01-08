import React from "react";
//import { Text } from "react-native";
import { createStackNavigator,
     TransitionPresets } from "@react-navigation/stack";
import { RestaurantsScreen } from "../../features/resturants/screens/restaurants.screen";
import { RestaurantDetailScreen } from "../../features/resturants/screens/restaurant-detail.screen";


const RestaurantStack = createStackNavigator();

export const RestaurantsNavigator = () => {
    return(
        <RestaurantStack.Navigator
        headerMode="none"
        screenOptions={{
            ...TransitionPresets.ModalPresentationIOS
        }}>
            <RestaurantStack.Screen
            name="Restaurants"
            component={RestaurantsScreen}
              />
            <RestaurantStack.Screen
            name="RestaurantDetail"
            component={RestaurantDetailScreen}
            />
        </RestaurantStack.Navigator>
    );
};