import React, { createContext, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CartContext = createContext();

// Cart Provider Component
export function CartProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState({
    restaurants: {}, // Store orders grouped by restaurant
  });

  const addToCart = useCallback((item, restaurantName, restaurantId, checkboxValue) => {
    setSelectedItems(current => {
      if (!checkboxValue) return current;

      const itemKey = `${item.id}-${JSON.stringify(item.selectedOptions)}`;
      const basePrice = Number(item.price) || 0;
      const optionsPrice = item.selectedOptions ? 
        Object.values(item.selectedOptions).reduce((sum, option) => sum + (Number(option.price) || 0), 0) 
        : 0;
      const totalBasePrice = parseFloat((basePrice + optionsPrice).toFixed(2));

      const currentRestaurant = current.restaurants[restaurantId] || {
        name: restaurantName,
        items: []
      };

      const existingItemIndex = currentRestaurant.items.findIndex(existingItem => 
        `${existingItem.id}-${JSON.stringify(existingItem.selectedOptions)}` === itemKey
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...currentRestaurant.items];
        const existingItem = newItems[existingItemIndex];
        const newQuantity = (existingItem.quantity || 1) + item.quantity;
        
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          finalPrice: totalBasePrice,
          itemTotalPrice: parseFloat((totalBasePrice * newQuantity).toFixed(2))
        };
      } else {
        newItems = [...currentRestaurant.items, {
          ...item,
          quantity: item.quantity,
          finalPrice: totalBasePrice,
          itemTotalPrice: totalBasePrice * item.quantity
        }];
      }

      return {
        restaurants: {
          ...current.restaurants,
          [restaurantId]: {
            name: restaurantName,
            items: newItems
          }
        }
      };
    });
  }, []);

  const updateItemQuantity = useCallback((restaurantId, itemId, delta, selectedOptions) => {
    setSelectedItems(current => {
      if (!current.restaurants[restaurantId]) return current;

      const newRestaurants = { ...current.restaurants };
      const restaurant = newRestaurants[restaurantId];
      
      const itemKey = `${itemId}-${JSON.stringify(selectedOptions)}`;
      const newItems = restaurant.items.map(item => {
        if (`${item.id}-${JSON.stringify(item.selectedOptions)}` === itemKey) {
          const newQuantity = Math.max(0, (item.quantity || 1) + delta);
          if (newQuantity === 0) return null;
          
          const basePrice = parseFloat((item.finalPrice || item.price).toFixed(2));
          return { 
            ...item, 
            quantity: newQuantity,
            itemTotalPrice: parseFloat((basePrice * newQuantity).toFixed(2))
          };
        }
        return item;
      }).filter(Boolean);

      if (newItems.length === 0) {
        delete newRestaurants[restaurantId];
      } else {
        newRestaurants[restaurantId] = {
          ...restaurant,
          items: newItems
        };
      }

      return {
        restaurants: newRestaurants
      };
    });
  }, []);

  const removeFromCart = useCallback((restaurantId, itemId, selectedOptions) => {
    setSelectedItems(current => {
      const newRestaurants = { ...current.restaurants };
      if (!newRestaurants[restaurantId]) return current;

      const itemKey = `${itemId}-${JSON.stringify(selectedOptions)}`;
      const restaurant = newRestaurants[restaurantId];
      const newItems = restaurant.items.filter(item => 
        `${item.id}-${JSON.stringify(item.selectedOptions)}` !== itemKey
      );

      if (newItems.length === 0) {
        delete newRestaurants[restaurantId];
      } else {
        newRestaurants[restaurantId] = {
          ...restaurant,
          items: newItems
        };
      }

      return {
        restaurants: newRestaurants
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setSelectedItems({
      restaurants: {}
    });
  }, []);

  return (
    <CartContext.Provider value={{ 
      selectedItems, 
      addToCart, 
      removeFromCart, 
      updateItemQuantity,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Floating Cart Icon Component
export function FloatingCartIcon({ navigation }) {
  const { selectedItems } = useCart();
  
  // Safely calculate total items
  const itemCount = selectedItems?.restaurants 
    ? Object.values(selectedItems.restaurants).reduce(
        (count, restaurant) => count + (restaurant?.items?.length || 0), 
        0
      )
    : 0;

  if (itemCount === 0) return null;

  return (
    <TouchableOpacity
      style={styles.floatingContainer}
      onPress={() => navigation.navigate("Cart")}
    >
      <View style={styles.floatingButton}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Order Item Component
export function OrderItem({ item, showControls = true }) {
  const { removeFromCart, updateItemQuantity } = useCart();
  const { name, selectedOptions, itemTotalPrice, quantity = 1 } = item;

  const renderCustomizations = () => {
    if (!selectedOptions) return null;
    return Object.entries(selectedOptions).map(([category, option]) => (
      <Text key={category} style={styles.customization}>
        {option.name} (+৳{option.price})
      </Text>
    ));
  };

  return (
    <View style={styles.orderItemContainer}>
      <View style={styles.mainInfo}>
        <Text style={styles.itemName}>{name}</Text>
        {renderCustomizations()}
        <Text style={styles.price}>৳{itemTotalPrice}</Text>
      </View>
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.restaurantId, item.id, -1, item.selectedOptions)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.restaurantId, item.id, 1, item.selectedOptions)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromCart(item.restaurantId, item.id, item.selectedOptions)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Custom Hook
export function useCart() {
  return useContext(CartContext);
}

// Styles
const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  floatingButton: {
    backgroundColor: "black",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderItemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mainInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  customization: {
    color: "gray",
    fontSize: 14,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    paddingHorizontal: 15,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
