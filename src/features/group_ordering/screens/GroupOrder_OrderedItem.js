import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import GroupOrderItem from '../Components/GroupOrderItem'; // Ensure this import is correct

export default function GroupOrder_OrderedItem({ route }) {
  const { orderData } = route.params;

  const calculateItemTotal = (item) => {
    const basePrice = item.price || 0;
    const quantity = item.quantity || 1;
    let optionsTotal = 0;

    if (item.selectedOptions) {
      optionsTotal = Object.entries(item.selectedOptions)
        .reduce((sum, [_, option]) => sum + (option.price || 0), 0);
    }

    return (basePrice + optionsTotal) * quantity;
  };

  const handleRemoveItem = (itemId) => {
    if (!orderData.items) return;
    const updatedItems = orderData.items.filter(item => item.id !== itemId);
    // Update the order data in the context or backend
  };

  const renderItems = () => {
    // Group items by member
    const groupedItems = orderData.items.reduce((acc, item) => {
      const member = item.addedBy;
      if (!acc[member]) acc[member] = [];
      acc[member].push(item);
      return acc;
    }, {});

    return Object.entries(groupedItems).map(([member, items]) => (
      <View key={member} style={styles.memberSection}>
        <Text style={styles.memberName}>{member}'s Items</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <GroupOrderItem item={item} groupCart={orderData.items} setGroupCart={(updatedItems) => {
              orderData.items = updatedItems;
              // Update the order data in the context or backend
            }} handleRemoveItem={handleRemoveItem} />
          </View>
        ))}
        <View style={styles.subtotalSection}>
          <Text style={styles.subtotalText}>
            Subtotal: ৳{items.reduce((sum, item) => sum + calculateItemTotal(item), 0)}
          </Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <LottieView
        style={styles.successAnimation}
        source={require("../../../../assets/animations/cooking.json")}
        autoPlay
        loop={false}
      />
      
      <Text style={styles.title}>Group Order Placed!</Text>
      <Text style={styles.subtitle}>Order #{orderData.id?.slice(-6)}</Text>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          {renderItems()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <Text style={styles.deliveryText}>
            Address: {orderData.delivery?.address}
          </Text>
          <Text style={styles.deliveryText}>
            Phone: {orderData.delivery?.phone}
          </Text>
          {orderData.delivery?.notes && (
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
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginTop: 2,
  },
  itemPrice: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'right',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  deliveryText: {
    fontSize: 15,
    marginBottom: 8,
    color: '#444',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  memberSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtotalSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 10,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#4CAF50',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: 10,
  },
});
