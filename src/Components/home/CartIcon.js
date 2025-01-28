import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useCart } from "../../context/CartContext";

export default function CartIcon({ navigation }) {
  const { selectedItems } = useCart();

  const itemCount = useMemo(() => {
    if (!selectedItems?.restaurants) return 0;
    
    return Object.values(selectedItems.restaurants).reduce((total, restaurant) => {
      if (!restaurant?.items?.length) return total;
      return total + restaurant.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }, 0);
  }, [selectedItems?.restaurants]);

  if (!itemCount) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Cart")}
    >
      <View style={styles.button}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 999,
  },
  button: {
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
});
