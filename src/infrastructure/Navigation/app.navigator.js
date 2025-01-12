import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../Screens/HomeScreen";
import RestaurantDetail from "../../Screens/RestaurantDetail";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "../../redux/store";
import OrderCompleted from "../../Screens/OrderCompleted";
import LoginScreen from "../../LoginSingupScreen/LoginScreen";
import SignupScreen from "../../LoginSingupScreen/SignupScreen";
import SignupNextScreen from "../../LoginSingupScreen/SingupNextScreen";
import MapScreen from "../../features/map/MapScreen";
import AccountScreen from "../../features/account/AccountScreen";
// import FavouriteScreen from "../../Screens/FavouriteScreen";
// import BrowseScreen from "../../Screens/BrowseScreen";
import BottomTabs from "../../Components/home/BottomTab";

const store = configureStore();

export default function RootNavigation() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const screenOptions = {
    headerShown: false,
  };

  const HomeTabs = () => (
    <Tab.Navigator tabBar={(props) => <BottomTabs {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      {/* <Tab.Screen name="Favourite" component={FavouriteScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} /> */}
    </Tab.Navigator>
  );

  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignupNext" component={SignupNextScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
          <Stack.Screen name="OrderCompleted" component={OrderCompleted} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}