import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../Screens/HomeScreen";
import RestaurantDetail from "../../Screens/RestaurantDetail";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "../../redux/store";
import OrderCompleted from "../../Screens/OrderCompleted";
import LoginScreen from "../../LoginSingupScreen/LoginScreen";
import SignupScreen from "../../LoginSingupScreen/SignupScreen";
import SignupNextScreen from "../../LoginSingupScreen/SingupNextScreen"
import MapScreen from "../../features/map/MapScreen";
import AccountScreen from "../../features/account/AccountScreen";
// import FavouriteScreen from "../../Screens/FavouriteScreen";
// import BrowseScreen from "../../Screens/BrowseScreen";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BottomTabs from "../../Components/home/BottomTab";

const store = configureStore();

export default function RootNavigation() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const screenOptions = {
    headerShown: false,
  };

  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen" screenOptions={screenOptions}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignupNext" component={SignupNextScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
          <Stack.Screen name="OrderCompleted" component={OrderCompleted} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}