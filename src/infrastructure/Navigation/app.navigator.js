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
import CreateGroupScreen from "../../features/group_ordering/screens/CreateGroupScreen";
import JoinGroupScreen from "../../features/group_ordering/screens/JoinGroupScreen";
import GroupOrderScreen from "../../features/group_ordering/screens/GroupOrderScreen";
import ScanQRCodeScreen from "../../features/group_ordering/screens/ScanQRCodeScreen";
import SearchResults from "../../Screens/SearchResults";
import CateringMenuScreen from '../../features/catering/screens/CateringMenuScreen';
import CateringDetailScreen from '../../features/catering/screens/CateringDetailScreen';
import CateringCartScreen from '../../features/catering/screens/CateringCartScreen';
import CateringOrderConfirmation from '../../features/catering/screens/CateringOrderConfirmation';
import GroupCartCheckout from '../../features/group_ordering/screens/GroupCartCheckout';
import GroupOrder_OrderedItem from '../../features/group_ordering/screens/GroupOrder_OrderedItem';

export default function RootNavigation() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const screenOptions = {
    headerShown: false,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
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
        <Stack.Screen 
          name="CreateGroup" 
          component={CreateGroupScreen}
          options={{
            headerShown: true,
            title: "Create Group Order"
          }}
        />
        <Stack.Screen 
          name="JoinGroup" 
          component={JoinGroupScreen}
          options={{
            headerShown: true,
            title: "Join Group Order"
          }}
        />
        <Stack.Screen 
          name="GroupOrder" 
          component={GroupOrderScreen}
          options={{
            headerShown: true,
            title: "Group Order"
          }}
        />
        <Stack.Screen 
          name="ScanQRCode" 
          component={ScanQRCodeScreen}
          options={{
            headerShown: true,
            title: "Scan QR Code"
          }}
        />
        <Stack.Screen 
          name="CateringMenuScreen" 
          component={CateringMenuScreen}
          options={{
            headerShown: true,
            title: 'Catering Menu'
          }}
        />
        <Stack.Screen 
          name="CateringDetail" 
          component={CateringDetailScreen}
          options={{
            headerShown: true,
            title: 'Catering Details'
          }}
        />
        <Stack.Screen 
          name="CateringCart" 
          component={CateringCartScreen}
          options={{
            headerShown: true,
            title: 'Catering Cart'
          }}
        />
        <Stack.Screen 
          name="CateringOrderConfirmation" 
          component={CateringOrderConfirmation}
          options={{
            headerShown: true,
            title: 'Order Confirmation'
          }}
        />
        <Stack.Screen name="SearchResults" component={SearchResults} />
        
        <Stack.Screen 
          name="GroupCartCheckout"
          component={GroupCartCheckout}
          options={{
            headerShown: true,
            title: "Group Order Checkout"
          }}
        />
        <Stack.Screen 
          name="GroupOrder_OrderedItem"
          component={GroupOrder_OrderedItem}
          options={{
            headerShown: true,
            title: "Order Confirmation"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}