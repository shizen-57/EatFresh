import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, StatusBar, Platform, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Divider } from "react-native-elements";
import BottomTabs from "../Components/home/BottomTab";
import Categories from "../Components/home/Categories";
import HeaderTabs from "../Components/home/HeaderTabs";
import RestaurantItems from "../Components/home/RestaurantItems";
import SearchBar from "../Components/home/SearchBar";
import { realtimeDb, ref, onValue } from "../../firebase";
import CartIcon from "../Components/home/CartIcon";
import { useGroupOrder } from "../features/group_ordering/context/GroupOrderContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [restaurantData, setRestaurantData] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [activeTab, setActiveTab] = useState("Delivery");
  const { groupOrder, currentMember } = useGroupOrder();
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  useEffect(() => {
    const checkGroupState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('groupOrderState');
        if (savedState) {
          setIsStateLoaded(true);
        }
      } catch (error) {
        console.error('Error checking group state:', error);
      } finally {
        setIsStateLoaded(true);
      }
    };

    checkGroupState();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const restaurantsRef = ref(realtimeDb, 'restaurants');
      
      onValue(restaurantsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Map restaurant data and ensure menu is properly structured
          const restaurants = Object.entries(data).map(([id, restaurant]) => {
            return {
              ...restaurant,
              id,
              menu: restaurant.menu ? restaurant.menu.filter(menuId => menuId) : [] // Filter out empty menu items
            };
          }).filter(restaurant => 
            restaurant.transactions?.includes(activeTab.toLowerCase())
          );
          
          console.log("Restaurant with menu:", restaurants[0]); // Debug log
          setRestaurantData(restaurants);
        }
      });
    };

    fetchData();
  }, [activeTab]);

  const handleCityChange = (filteredRestaurants) => {
    if (filteredRestaurants.length === 0) {
      const restaurantsRef = ref(realtimeDb, 'restaurants');
      onValue(restaurantsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const restaurants = Object.values(data).filter(restaurant => 
            restaurant.transactions?.includes(activeTab.toLowerCase())
          );
          setRestaurantData(restaurants);
        }
      });
    } else {
      setRestaurantData(filteredRestaurants);
    }
  };

  if (!isStateLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ 
      backgroundColor: "#fff", 
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 
    }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {groupOrder && (
        <View style={styles.groupOrderBanner}>
          <Text style={styles.groupOrderText}>
            You're in a group order with {groupOrder.members.length} members
          </Text>
        </View>
      )}
      <View style={{ backgroundColor: "white", padding: 10 }}>
        <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SearchBar cityHandler={handleCityChange} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Categories />
        <RestaurantItems restaurantData={restaurantData} navigation={navigation} />
      </ScrollView>
      <Divider width={1} />
      <BottomTabs />
      <CartIcon navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  groupOrderBanner: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
  },
  groupOrderText: {
    color: 'white',
    fontSize: 16,
  },
});