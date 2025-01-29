import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../../theme';
import debounce from 'lodash.debounce';
import { realtimeDb, ref, onValue } from '../../../../firebase';

export default function MapSearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search function to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((text) => {
      if (text) {
        const restaurantsRef = ref(realtimeDb, 'restaurants');
        const locationsRef = ref(realtimeDb, 'locations');

        onValue(restaurantsRef, (snapshot) => {
          if (snapshot.exists()) {
            const restaurantsData = snapshot.val();
            
            // Get locations data
            onValue(locationsRef, (locationSnapshot) => {
              if (locationSnapshot.exists()) {
                const locationsData = locationSnapshot.val();
                
                // Combine restaurant and location data
                const restaurantList = Object.entries(restaurantsData).map(([id, restaurant]) => ({
                  id,
                  ...restaurant,
                  location: {
                    ...locationsData[restaurant.location],
                    latitude: parseFloat(locationsData[restaurant.location].latitude),
                    longitude: parseFloat(locationsData[restaurant.location].longitude)
                  }
                }));

                const filteredRestaurants = restaurantList.filter(restaurant =>
                  restaurant.name.toLowerCase().includes(text.toLowerCase()) ||
                  restaurant.location.address1.toLowerCase().includes(text.toLowerCase()) ||
                  restaurant.location.city.toLowerCase().includes(text.toLowerCase())
                );

                onSearch(filteredRestaurants);
              }
            });
          }
        });
      } else {
        // Fetch all restaurants when search query is empty
        const restaurantsRef = ref(realtimeDb, 'restaurants');
        const locationsRef = ref(realtimeDb, 'locations');

        onValue(restaurantsRef, (snapshot) => {
          if (snapshot.exists()) {
            const restaurantsData = snapshot.val();
            
            // Get locations data
            onValue(locationsRef, (locationSnapshot) => {
              if (locationSnapshot.exists()) {
                const locationsData = locationSnapshot.val();
                
                // Combine restaurant and location data
                const restaurantList = Object.entries(restaurantsData).map(([id, restaurant]) => ({
                  id,
                  ...restaurant,
                  location: {
                    ...locationsData[restaurant.location],
                    latitude: parseFloat(locationsData[restaurant.location].latitude),
                    longitude: parseFloat(locationsData[restaurant.location].longitude)
                  }
                }));

                onSearch(restaurantList);
              }
            });
          }
        });
      }
    }, 500),
    []
  );

  const handleClearSearch = () => {
    setSearchQuery('');
    debouncedSearch('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
        <Feather 
          name="search" 
          size={22} 
          color={isFocused ? COLORS.primary : COLORS.text.secondary} 
        />

        <TextInput
          style={styles.input}
          placeholder="Search for restaurants or locations..."
          placeholderTextColor={COLORS.text.secondary}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            debouncedSearch(text);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <MaterialIcons 
              name="clear" 
              size={20} 
              color={COLORS.text.secondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 48,
    flex: 1,
  },
  searchBarFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  clearButton: {
    marginLeft: SPACING.sm,
  },
});
