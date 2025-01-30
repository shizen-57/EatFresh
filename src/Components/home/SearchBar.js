import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash/debounce';

export default function SearchBar({ containerStyle, autoFocus = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        navigation.navigate('SearchResults', {
          query: query.trim(),
          timestamp: Date.now()
        });
      }
    }, 500),
    [navigation]
  );

  const handleTextChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Keyboard.dismiss();
      navigation.navigate('SearchResults', {
        query: searchQuery.trim(),
        timestamp: Date.now()
      });
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
        <TouchableOpacity onPress={handleSearch}>
          <Feather 
            name="search" 
            size={20} 
            color={isFocused ? COLORS.primary : COLORS.text.secondary} 
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Search for restaurants, dishes..."
          placeholderTextColor={COLORS.text.secondary}
          value={searchQuery}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoFocus={autoFocus}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <MaterialIcons name="clear" size={18} color={COLORS.text.secondary} />
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
    height: 45, // Increased from 36
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
    height: 45, // Added to match container height
  },
  clearButton: {
    marginLeft: SPACING.sm,
  },
});