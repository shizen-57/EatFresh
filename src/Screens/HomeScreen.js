import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, StatusBar, Platform } from "react-native";
import { Divider } from "react-native-elements";
import BottomTabs from "../Components/home/BottomTab";
import Categories from "../Components/home/Categories";
import HeaderTabs from "../Components/home/HeaderTabs";
import RestaurantItems from "../Components/home/RestaurantItems";
import SearchBar from "../Components/home/SearchBar";
import { realtimeDb, ref, onValue } from "../../firebase";

export default function Home({ navigation }) {
  const [restaurantData, setRestaurantData] = useState([]);
  const [city, setCity] = useState("Dhaka");
  const [activeTab, setActiveTab] = useState("Delivery");

  useEffect(() => {
    const fetchRestaurants = () => {
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
    };

    fetchRestaurants();
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
    </View>
  );
}