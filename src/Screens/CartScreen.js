import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import LottieView from 'lottie-react-native'; // Import LottieView
import { useCart } from "../context/CartContext";
import OrderItem from "../Components/RestaurantDetail/OrderItem";

export default function CartScreen({ navigation }) {
  const { selectedItems, removeFromCart } = useCart();
  const restaurants = Object.entries(selectedItems.restaurants || {});

  if (restaurants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={require('../../assets/animations/empty-cart.json')} // Ensure the path is correct
          autoPlay
          loop
          style={styles.emptyAnimation}
        />
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  const calculateRestaurantTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.itemTotalPrice || 0), 0);
  };

  const grandTotal = restaurants.reduce((sum, [_, restaurant]) => 
    sum + calculateRestaurantTotal(restaurant.items), 0
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.itemsContainer}>
        {restaurants.map(([restaurantId, restaurant]) => (
          <View key={restaurantId} style={styles.restaurantSection}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {restaurant.items.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.orderItemContainer}>
                <OrderItem 
                  item={item}
                  restaurantId={restaurantId}
                />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFromCart(restaurantId, item.id, item.selectedOptions)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.subtotal}>
              Subtotal: ৳{calculateRestaurantTotal(restaurant.items).toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.total}>Grand Total: ৳{grandTotal.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemsContainer: {
    flex: 1,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
  emptyAnimation: {
    width: 150,
    height: 150,
  },
  restaurantSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 10,
    paddingRight: 15,
  },
  orderItemContainer: {
    flexDirection: "column", // Change to column to stack items vertically
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  removeButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginTop: 10, // Ensure the button is not too close to the text
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
  },
});
