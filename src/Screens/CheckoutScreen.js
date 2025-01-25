import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCart } from "../context/CartContext";
import OrderItem from "../Components/RestaurantDetail/OrderItem";
import { db } from "../../firebase";
import { collection, addDoc } from 'firebase/firestore';


function OrderSummaryItem({ item }) {
  return (
    <View style={styles.orderItemRow}>
      <View style={styles.orderItemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>× {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>৳{item.itemTotalPrice.toFixed(2)}</Text>
    </View>
  );
}

export default function CheckoutScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    message: ''
  });

  const { selectedItems, clearCart } = useCart();
  const restaurants = Object.entries(selectedItems.restaurants || {});

  // Calculate totals using useMemo
  const { items, total, restaurantDetails } = useMemo(() => {
    const allItems = [];
    let totalAmount = 0;
    const restaurantNames = [];

    restaurants.forEach(([restaurantId, restaurant]) => {
      restaurantNames.push(restaurant.name);
      restaurant.items.forEach(item => {
        allItems.push({
          ...item,
          restaurantId,
          restaurantName: restaurant.name
        });
        totalAmount += item.itemTotalPrice || 0;
      });
    });

    return {
      items: allItems,
      total: totalAmount,
      restaurantDetails: restaurantNames.join(", ")
    };
  }, [restaurants]);

  const validateForm = () => {
    if (!userDetails.phone || !userDetails.address) {
      alert("Phone number and address are required");
      return false;
    }
    if (userDetails.phone.length < 11) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          ...item,
          price: item.finalPrice || item.price,
          customizations: item.selectedOptions || {}
        })),
        restaurants: restaurantDetails,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        orderNumber: Math.floor(Math.random() * 100000).toString(),
        userDetails: {
          ...userDetails,
          phone: userDetails.phone.trim()
        }
      };

      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, orderData);
      
      clearCart();
      navigation.navigate("OrderCompleted", { 
        orderId: docRef.id,
        orderData 
      });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (restaurants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  const calculateRestaurantTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.itemTotalPrice || 0), 0);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {restaurants.map(([restaurantId, restaurant]) => (
          <View key={restaurantId} style={styles.restaurantSection}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.orderSummary}>
              {restaurant.items.map((item, index) => (
                <OrderSummaryItem 
                  key={`${item.id}-${index}`} 
                  item={item}
                />
              ))}
              <View style={styles.dividerContainer}>
                <Divider style={{ marginVertical: 10 }} />
              </View>
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalText}>Subtotal</Text>
                <Text style={styles.subtotalAmount}>
                  ৳{calculateRestaurantTotal(restaurant.items).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={userDetails.name}
            onChangeText={(text) => setUserDetails(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            keyboardType="phone-pad"
            value={userDetails.phone}
            onChangeText={(text) => setUserDetails(prev => ({ ...prev, phone: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Delivery Address *"
            multiline
            value={userDetails.address}
            onChangeText={(text) => setUserDetails(prev => ({ ...prev, address: text }))}
          />
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Message for Rider (Optional)"
            multiline
            value={userDetails.message}
            onChangeText={(text) => setUserDetails(prev => ({ ...prev, message: text }))}
          />
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>৳{total.toFixed(2)}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.placeOrderButton, loading && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    backgroundColor: 'black',
    padding: 15,
    margin: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  restaurantSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  orderSummary: {
    padding: 15,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 10,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: '600'
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: '600'
  },
  dividerContainer: {
    paddingHorizontal: 10,
    marginVertical: 5
  }
});

