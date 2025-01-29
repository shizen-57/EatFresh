import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import OrderItem from "../Components/RestaurantDetail/OrderItem";

export default function OrderCompleted({ route }) {
  const { orderData, orderId } = route.params;
  const {
    items,
    restaurantName,
    total,
    orderNumber,
    userDetails,
    createdAt
  } = orderData;

  const orderDate = new Date(createdAt).toLocaleString();

  return (
    <View style={styles.container}>
      <LottieView
        style={styles.checkmark}
        source={require("../../assets/animations/check-mark.json")}
        autoPlay
        loop={false}
      />
      <Text style={styles.title}>Your order has been placed 🎉</Text>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          <Text style={styles.orderNumber}>Order ID: {orderId}</Text>
          <Text style={styles.timestamp}>{orderDate}</Text>
          <Text style={styles.restaurant}>{restaurantName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <Text style={styles.detailText}>Name: {userDetails.name}</Text>
          <Text style={styles.detailText}>Phone: {userDetails.phone}</Text>
          <Text style={styles.detailText}>Address: {userDetails.address}</Text>
          {userDetails.message && (
            <Text style={styles.detailText}>
              Message for rider: {userDetails.message}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {items.map((item, index) => (
            <OrderItem key={index} item={item} />
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>৳{total}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  checkmark: {
    height: 100,
    alignSelf: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  contentContainer: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    color: "#666",
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  restaurant: {
    fontSize: 16,
    fontWeight: "500",
  },
  detailText: {
    fontSize: 15,
    marginBottom: 5,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
});