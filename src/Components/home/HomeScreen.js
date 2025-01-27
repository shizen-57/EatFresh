import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ...existing code...

<View style={styles.cartIconContainer}>
  <TouchableOpacity 
    style={styles.cartButton}
    onPress={() => navigation.navigate("Cart")}
  >
    <MaterialCommunityIcons name="cart" size={24} color="white" />
  </TouchableOpacity>
</View>

// ...add these styles...
const styles = StyleSheet.create({
  // ...existing styles...
  cartIconContainer: {
    position: 'absolute',
    bottom: 90, // Position above bottom tab
    right: 20,
    zIndex: 999,
  },
  cartButton: {
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
