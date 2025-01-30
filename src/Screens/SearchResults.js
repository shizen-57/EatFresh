import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../theme';
import { realtimeDb, ref, onValue } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';

export default function SearchResults({ route, navigation }) {
  const { query } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);

  const fetchSearchResults = useCallback(async () => {
    setLoading(true);
    try {
      const restaurantsRef = ref(realtimeDb, 'restaurants');
      
      onValue(restaurantsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const searchResults = new Set(); // Use Set to avoid duplicates
          
          Object.entries(data).forEach(([id, restaurant]) => {
            const restaurantData = {
              id,
              ...restaurant,
              matchType: 'none'
            };

            // Search in restaurant name
            if (restaurant.name.toLowerCase().includes(query.toLowerCase())) {
              restaurantData.matchType = 'restaurant';
              searchResults.add(restaurantData);
            }

            // Search in menu items
            if (restaurant.menu) {
              Object.values(restaurant.menu).forEach(category => {
                category.items?.forEach(item => {
                  if (item.name.toLowerCase().includes(query.toLowerCase())) {
                    restaurantData.matchType = 'dish';
                    restaurantData.matchedDish = item.name;
                    searchResults.add(restaurantData);
                  }
                });
              });
            }

            // Search in cuisine types
            if (restaurant.categories?.some(cat => 
              cat.toLowerCase().includes(query.toLowerCase())
            )) {
              restaurantData.matchType = 'cuisine';
              searchResults.add(restaurantData);
            }
          });

          const sortedResults = Array.from(searchResults).sort((a, b) => {
            // Prioritize exact matches
            const aExact = a.name.toLowerCase() === query.toLowerCase();
            const bExact = b.name.toLowerCase() === query.toLowerCase();
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            // Then prioritize by match type
            const matchPriority = { restaurant: 3, dish: 2, cuisine: 1 };
            return matchPriority[b.matchType] - matchPriority[a.matchType];
          });

          setResults(sortedResults);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <Image 
        source={{ uri: item.image_url }} 
        style={styles.restaurantImage}
        defaultSource={require('../../assets/placeholder.png')}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        {item.matchType === 'dish' && (
          <Text style={styles.matchedDish}>
            Found dish: {item.matchedDish}
          </Text>
        )}
        <Text style={styles.restaurantDetails}>
          {item.categories?.join(' • ')}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={COLORS.primary} />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.ratingCount}>({item.review_count})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noResults}>No results found for "{query}"</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
      </View>
      <FlatList
        data={results}
        renderItem={renderRestaurantItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  listContainer: {
    padding: SPACING.md,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: 100,
    height: 100,
  },
  restaurantInfo: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  restaurantDetails: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  matchedDish: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
    fontStyle: 'italic'
  },
});
