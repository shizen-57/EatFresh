import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import RestaurantItems from "../Components/home/RestaurantItems";
import { realtimeDb, ref, onValue, off } from "../../firebase";
import { COLORS, SPACING } from '../theme';

export default function CategoryScreen({ route, navigation }) {
  const { categoryName, categoryAlias } = route.params;
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(() => {
    const restaurantsRef = ref(realtimeDb, 'restaurants');
    
    onValue(restaurantsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredRestaurants = Object.entries(data)
            .map(([id, restaurant]) => ({
              id,
              ...restaurant
            }))
            .filter(restaurant => 
              restaurant.categories?.some(cat => 
                cat.toLowerCase() === categoryAlias.toLowerCase()
              )
            )
            .sort((a, b) => b.rating - a.rating); // Sort by rating

          setRestaurants(filteredRestaurants);
        }
      } catch (err) {
        setError('Failed to load restaurants');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError('Failed to load restaurants');
      setLoading(false);
      console.error('Error fetching restaurants:', error);
    });

    // Cleanup
    return () => off(restaurantsRef);
  }, [categoryAlias]);

  useEffect(() => {
    navigation.setOptions({
      title: categoryName,
      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      headerTintColor: '#282c3f',
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 16,
      },
    });

    fetchRestaurants();
  }, [categoryName, fetchRestaurants, navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {restaurants.length > 0 ? (
          <>
            <Text style={styles.resultCount}>
              {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} Found
            </Text>
            <RestaurantItems 
              restaurantData={restaurants} 
              navigation={navigation}
            />
          </>
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No restaurants available in this category
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  resultCount: {
    fontSize: 13,
    color: '#686b78',
    padding: SPACING.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f6',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: '#ffffff',
  },
  noResultsText: {
    fontSize: 15,
    color: '#686b78',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#fc8019',
    textAlign: 'center',
  }
});
