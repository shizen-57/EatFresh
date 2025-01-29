import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../theme';
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  // Debounce search function to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((text) => {
      if (onSearch) onSearch(text);
    }, 500),
    []
  );

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) onSearch('');
    Keyboard.dismiss();
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchResults', { query: searchQuery });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
        <TouchableOpacity onPress={handleSearchPress}>
          <Feather 
            name="search" 
            size={22} 
            color={isFocused ? COLORS.primary : COLORS.text.secondary} 
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Search for restaurants, dishes..."
          placeholderTextColor={COLORS.text.secondary}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            debouncedSearch(text);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          onSubmitEditing={handleSearchPress}
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