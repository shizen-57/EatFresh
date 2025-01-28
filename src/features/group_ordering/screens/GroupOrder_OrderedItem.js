import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import LottieView from 'lottie-react-native';

export default function GroupOrder_OrderedItem({ route }) {
  const { orderData } = route.params;

  return (
    <View style={styles.container}>
      <LottieView
        style={styles.successAnimation}
        source={require("../../../../assets/animations/cooking.json")}
        autoPlay
        loop={false}
      />
      
      <Text style={styles.title}>Group Order Placed!</Text>
      <Text style={styles.subtitle}>Order #{orderData.id}</Text>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          {orderData.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text>{item.title} x{item.quantity}</Text>
              <Text>৳{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <Text style={styles.deliveryText}>
            Address: {orderData.delivery.address}
          </Text>
          <Text style={styles.deliveryText}>
            Phone: {orderData.delivery.phone}
          </Text>
          {orderData.delivery.notes && (
            <Text style={styles.deliveryText}>
              Notes: {orderData.delivery.notes}
            </Text>
          )}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalAmount}>৳{orderData.totalAmount}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  successAnimation: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  deliveryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
