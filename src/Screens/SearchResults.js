import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import { realtimeDb, ref, onValue } from '../../firebase'; // Import Firebase configuration

export default function SearchResults() {
  const route = useRoute();
  const navigation = useNavigation();
  const { query } = route.params;
  const [results, setResults] = useState({ restaurants: [], menuItems: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantsRef = ref(realtimeDb, 'restaurants');
        const menuItemsRef = ref(realtimeDb, 'menuItems');

        onValue(restaurantsRef, (snapshot) => {
          if (snapshot.exists()) {
            const restaurantsData = snapshot.val();
            const restaurants = Object.entries(restaurantsData).map(([id, restaurant]) => ({
              id,
              ...restaurant
            }));

            const filteredRestaurants = restaurants.filter(restaurant =>
              restaurant.name.toLowerCase().includes(query.toLowerCase())
            );

            setResults(prevResults => ({ ...prevResults, restaurants: filteredRestaurants }));
          }
        });

        onValue(menuItemsRef, (snapshot) => {
          if (snapshot.exists()) {
            const menuItemsData = snapshot.val();
            const menuItems = Object.entries(menuItemsData).map(([id, item]) => ({
              id,
              ...item
            }));

            const filteredMenuItems = menuItems.filter(item =>
              item.name.toLowerCase().includes(query.toLowerCase())
            );

            setResults(prevResults => ({ ...prevResults, menuItems: filteredMenuItems }));
          }
        });
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query]);

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const handleMenuItemPress = (menuItem) => {
    const restaurantRef = ref(realtimeDb, `restaurants/${menuItem.restaurantId}`);
    onValue(restaurantRef, (snapshot) => {
      if (snapshot.exists()) {
        const restaurant = snapshot.val();
        navigation.navigate('RestaurantDetail', { restaurant: { id: menuItem.restaurantId, ...restaurant } });
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Restaurants</Text>
      {results.restaurants.length > 0 ? (
        results.restaurants.map((restaurant) => (
          <TouchableOpacity 
            key={restaurant.id} 
            style={styles.resultCard}
            onPress={() => handleRestaurantPress(restaurant)}
          >
            <Image source={{ uri: restaurant.image_url }} style={styles.resultImage} />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{restaurant.name}</Text>
              <Text style={styles.resultDetails}>
                {restaurant.categories.join(', ')} • {restaurant.price} • {restaurant.rating} ⭐ ({restaurant.review_count})
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noResultsText}>No restaurants found</Text>
      )}

      <Text style={styles.sectionTitle}>Menu Items</Text>
      {results.menuItems.length > 0 ? (
        results.menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.resultCard}
            onPress={() => handleMenuItemPress(item)}
          >
            <Image source={{ uri: item.image_url }} style={styles.resultImage} />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultDetails}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noResultsText}>No menu items found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
    color: COLORS.text.primary,
  },
  resultCard: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  resultImage: {
    width: 80,
    height: 80,
  },
  resultInfo: {
    flex: 1,
    padding: SPACING.sm,
  },
  resultName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
  resultDetails: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  noResultsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
