import React from "react";
import { Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { RestaurantsScreen } from "../../features/resturants/screens/restaurants.screen";


const RestaurantStack = createStackNavigator();

export const RestaurantsNavigator = () => {
    return(
        <RestaurantStack.Navigator headerMode="none">
            <RestaurantStack.Screen
            name="Restaurant"
            component={RestaurantsScreen}
              />
            <RestaurantStack.Screen
            name="RestaurantDetail"
            component={() => <Text>Restaurant Detail</Text>}
            />
        </RestaurantStack.Navigator>
    );
};