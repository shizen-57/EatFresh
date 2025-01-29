import React, { useEffect, useState } from "react";
import { View, StatusBar, StyleSheet, Image, Platform } from "react-native";
// Remove Dimensions and Animated imports
// Remove LinearGradient import
// Remove SafeAreaView import
import { COLORS, SPACING } from '../theme';
import { ScrollView, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import BottomTabs from "../Components/home/BottomTab";
import Categories from "../Components/home/Categories";
import HeaderTabs from "../Components/home/HeaderTabs";
import RestaurantItems from "../Components/home/RestaurantItems";
import { realtimeDb, ref, onValue } from "../../firebase";
// Remove CartIcon import
import { useGroupOrder } from "../features/group_ordering/context/GroupOrderContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Remove LinearGradient import

// Remove banners constant

export default function HomeScreen({ navigation }) {
  const [restaurantData, setRestaurantData] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [activeTab, setActiveTab] = useState("Delivery");
  const { groupOrder, currentMember } = useGroupOrder();
  const [isStateLoaded, setIsStateLoaded] = useState(false);
  // Remove scrollY and headerOpacity

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc8019" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#fc8019" 
        barStyle="light-content"
      />
      
      <View style={styles.safeAreaTop} />
      <View style={styles.contentContainer}>
        {/* Header */}
        <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Filters */}
          <View style={styles.quickFilters}>
            <Categories compact />
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Group Order Banner */}
            {groupOrder && (
              <View style={styles.groupBanner}>
                <Image 
                  source={require('../../assets/group.png')}
                  style={styles.groupIcon}
                />
                <View>
                  <Text style={styles.groupTitle}>Active Group Order</Text>
                  <Text style={styles.groupSubtitle}>
                    {groupOrder.members.length} members • {groupOrder.items.length} items
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => navigation.navigate('GroupOrder')}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Popular Restaurants */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Restaurants</Text>
              </View>
              <RestaurantItems 
                restaurantData={restaurantData} 
                navigation={navigation} 
              />
            </View>

            {/* Catering Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Catering Services</Text>
              </View>
              <RestaurantItems 
                restaurantData={restaurantData.filter(r => r.catering)}
                navigation={navigation} 
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomTabs navigation={navigation} />
        
        {/* Remove Cart Icon */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeAreaTop: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fc8019', // Swiggy orange color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  quickFilters: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f6',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f6',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#282c3f',
  },
  groupBanner: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupIcon: {
    width: 40,
    height: 40,
    marginRight: SPACING.md,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  groupSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  viewButton: {
    marginLeft: 'auto',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  viewButtonText: {
    color: COLORS.text.light,
    fontWeight: '600',
  },
  restaurantsSection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.md,
    color: COLORS.text.primary,
  },
});
