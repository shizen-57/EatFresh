import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../Screens/HomeScreen";
import RestaurantDetail from "../../Screens/RestaurantDetail";
import OrderCompleted from "../../Screens/OrderCompleted";
import LoginScreen from "../../LoginSingupScreen/LoginScreen";
import SignupScreen from "../../LoginSingupScreen/SignupScreen";
import SignupNextScreen from "../../LoginSingupScreen/SingupNextScreen";
import MapScreen from "../../features/map/MapScreen";
import AccountScreen from "../../features/account/AccountScreen";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BottomTabs from "../../Components/home/BottomTab";
import CategoryScreen from "../../Screens/CategoryScreen";
import { FavouriteRestaurantsScreen } from "../../features/favourites/screen/FavouriteRestaurantsScreen";
import CartScreen from "../../Screens/CartScreen";
import CheckoutScreen from "../../Screens/CheckoutScreen";

export default function RootNavigation() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const screenOptions = {
    headerShown: false,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignupNext" component={SignupNextScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="FavouriteScreen" component={FavouriteRestaurantsScreen} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
        <Stack.Screen name="OrderCompleted" component={OrderCompleted} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{
            headerShown: true,
            title: "Shopping Cart",
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
          options={{
            headerShown: true,
            title: "Checkout",
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}