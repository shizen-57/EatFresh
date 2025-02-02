import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGroupOrder } from '../context/GroupOrderContext'; // Ensure this import is correct

export default function HomeScreen({ navigation }) {
  const { groupCart } = useGroupOrder(); // Ensure groupCart is used

  return (
    <View style={styles.container}>
      {/* ...existing code... */}
      <View style={styles.cartIconContainer}>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <MaterialCommunityIcons name="cart" size={24} color="white" />
          {groupCart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{groupCart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* ...existing code... */}
    </View>
  );
}

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
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
