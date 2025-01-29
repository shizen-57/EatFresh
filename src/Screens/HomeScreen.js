import React, { useEffect, useState } from "react";
import { View, StatusBar, StyleSheet, Image, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme';
import { ScrollView, Text, ActivityIndicator, TouchableOpacity } from "react-native";
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        backgroundColor={COLORS.background}
        barStyle="dark-content" 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationBar}>
          <View style={styles.locationInfo}>
            <Image 
              source={require('../../assets/location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>Deliver to</Text>
            <Text style={styles.address} numberOfLines={1}>
              Current Location
            </Text>
            <Image 
              source={require('../../assets/chevron-down.png')}
              style={styles.chevronIcon}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image 
              source={require('../../assets/profile.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar cityHandler={handleCityChange} />
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // Makes Categories sticky
      >
        {/* Banner Slider */}
        <View style={styles.bannerContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          >
            {banners.map((banner, index) => (
              <Image 
                key={index}
                source={banner.image}
                style={styles.bannerImage}
              />
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <Categories />
        </View>

        {/* Group Order Banner if active */}
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

        {/* Restaurants */}
        <View style={styles.restaurantsSection}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          <RestaurantItems 
            restaurantData={restaurantData} 
            navigation={navigation} 
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomTabs navigation={navigation} />
      
      {/* Cart Icon */}
      {!groupOrder && <CartIcon navigation={navigation} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomColor: COLORS.card.border,
    borderBottomWidth: 1,
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginRight: SPACING.xs,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginRight: SPACING.xs,
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    maxWidth: 200,
  },
  chevronIcon: {
    width: 12,
    height: 12,
    marginLeft: SPACING.xs,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    height: 180,
    marginBottom: SPACING.md,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoriesWrapper: {
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  groupBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
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

const banners = [
  { image: require('../../assets/banner1.jpg') },
  { image: require('../../assets/banner2.jpg') },
  { image: require('../../assets/banner3.jpg') },
];