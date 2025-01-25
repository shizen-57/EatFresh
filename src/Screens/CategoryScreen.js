import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import { Divider } from "react-native-elements";
import HeaderTabs from "../Components/home/HeaderTabs";
import RestaurantItems from "../Components/home/RestaurantItems";
import { realtimeDb, ref, onValue } from "../../firebase";

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState("Delivery");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantsRef = ref(realtimeDb, 'restaurants');
        const menuItemsRef = ref(realtimeDb, 'menuItems');

        onValue(restaurantsRef, (restaurantSnapshot) => {
          onValue(menuItemsRef, (menuSnapshot) => {
            const restaurantsData = restaurantSnapshot.val();
            const menuItemsData = menuSnapshot.val();

            // Filter restaurants based on both category and delivery type
            const filteredRestaurants = Object.entries(restaurantsData)
              .filter(([_, restaurant]) => {
                const hasCategory = restaurant.menu.some(menuItemId => {
                  const menuItem = menuItemsData[menuItemId];
                  return menuItem && 
                         menuItem.dish_type && 
                         menuItem.dish_type.includes(category);
                });
                
                const hasDeliveryType = restaurant.transactions?.includes(activeTab.toLowerCase());
                return hasCategory && hasDeliveryType;
              })
              .map(([id, data]) => ({
                id,
                ...data
              }));

            setRestaurants(filteredRestaurants);
          });
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      const restaurantsRef = ref(realtimeDb, 'restaurants');
      const menuItemsRef = ref(realtimeDb, 'menuItems');
      onValue(restaurantsRef, () => {});
      onValue(menuItemsRef, () => {});
    };
  }, [category, activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RestaurantItems 
            restaurantData={restaurants} 
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  headerContainer: {
    backgroundColor: "white",
    padding: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  }
});
