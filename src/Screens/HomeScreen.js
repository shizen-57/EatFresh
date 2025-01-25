import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, StatusBar, Platform } from "react-native";
import { Divider } from "react-native-elements";
import BottomTabs from "../Components/home/BottomTab";
import Categories from "../Components/home/Categories";
import HeaderTabs from "../Components/home/HeaderTabs";
import RestaurantItems from "../Components/home/RestaurantItems";
import SearchBar from "../Components/home/SearchBar";
import { realtimeDb, ref, onValue } from "../../firebase";
import CartIcon from "../Components/home/CartIcon";

export default function HomeScreen({ navigation }) {
  const [restaurantData, setRestaurantData] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [activeTab, setActiveTab] = useState("Delivery");

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

  return (
    <View style={{ 
      backgroundColor: "#fff", 
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 
    }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
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