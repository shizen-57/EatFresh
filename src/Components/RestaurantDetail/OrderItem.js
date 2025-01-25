import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCart } from "../../context/CartContext";

export default function OrderItem({ item, restaurantId }) {
  const { removeFromCart, updateItemQuantity } = useCart();
  const { 
    id,
    name, 
    selectedOptions, 
    itemTotalPrice,
    quantity = 1 
  } = item;

  const renderCustomizations = () => {
    if (!selectedOptions) return null;

    return Object.entries(selectedOptions).map(([category, option]) => (
      <Text key={category} style={styles.customization}>
        {option.name} (+৳{option.price})
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainInfo}>
        <Text style={styles.name}>{name}</Text>
        {renderCustomizations()}
      </View>
      <Text style={styles.price}>৳{itemTotalPrice.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateItemQuantity(restaurantId, id, -1, selectedOptions)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateItemQuantity(restaurantId, id, 1, selectedOptions)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(restaurantId, id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mainInfo: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  customization: {
    color: "gray",
    fontSize: 14,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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