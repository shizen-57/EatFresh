import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import { useGroupOrder } from '../context/GroupOrderContext';
import { db, collection, addDoc } from '../../../../firebase';
import GroupOrderItem from '../Components/GroupOrderItem'; // Ensure this import is correct

export default function GroupCartCheckout({ navigation, route }) {
  const { items, groupOrderId } = route.params; // Get items from route params
  const { groupOrder, currentMember } = useGroupOrder();
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Add groupedItems logic using useMemo
  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const member = item.addedBy;
      if (!acc[member]) {
        acc[member] = [];
      }
      acc[member].push(item);
      return acc;
    }, {});
  }, [items]);

  // Update total calculation to include quantity and selected options
  const calculateItemTotal = (item) => {
    const basePrice = item.price || 0;
    const quantity = item.quantity || 1;
    let optionsTotal = 0;

    if (item.selectedOptions) {
      optionsTotal = Object.values(item.selectedOptions)
        .reduce((sum, option) => sum + (option.price || 0), 0);
    }

    return (basePrice + optionsTotal) * quantity;
  };

  const totalAmount = items.reduce((sum, item) => 
    sum + calculateItemTotal(item), 0
  );

  const handleCheckout = async () => {
    if (!deliveryDetails.address || !deliveryDetails.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items, // Use items from route params
        groupOrderId,
        totalAmount,
        delivery: deliveryDetails,
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: currentMember
      };

      const docRef = await addDoc(collection(db, 'groupOrders_completed'), orderData);
      
      navigation.replace('GroupOrder_OrderedItem', {
        orderId: docRef.id,
        orderData
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (itemId) => {
    if (!items) return;
    const updatedItems = items.filter(item => item.id !== itemId);
    // Update the items in the context or backend
  };

  const renderMemberItems = (member, memberItems) => (
    <View key={member} style={styles.memberItems}>
      <Text style={styles.memberName}>{member}'s Items</Text>
      {memberItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <GroupOrderItem item={item} handleRemoveItem={handleRemoveItem} />
        </View>
      ))}
      <View style={styles.memberTotal}>
        <Text style={styles.memberTotalText}>
          Subtotal: ৳{memberItems.reduce((sum, item) => sum + calculateItemTotal(item), 0)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {Object.entries(groupedItems).map(([member, memberItems]) => 
            renderMemberItems(member, memberItems)
          )}
        </View>

        {/* Delivery Details */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Delivery Address *"
            value={deliveryDetails.address}
            onChangeText={text => setDeliveryDetails(prev => ({
              ...prev, address: text
            }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            value={deliveryDetails.phone}
            onChangeText={text => setDeliveryDetails(prev => ({
              ...prev, phone: text
            }))}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Delivery Notes (Optional)"
            value={deliveryDetails.notes}
            onChangeText={text => setDeliveryDetails(prev => ({
              ...prev, notes: text
            }))}
            multiline
          />
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalAmount}>৳{totalAmount}</Text>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <Button
        title={loading ? "Processing..." : "Confirm Order"}
        onPress={handleCheckout}
        disabled={loading}
        buttonStyle={styles.checkoutButton}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  summarySection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  memberItems: {
    marginBottom: 15,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  deliverySection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  totalSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  checkoutButton: {
    backgroundColor: '#4CAF50',
    margin: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  optionsContainer: {
    marginTop: 4,
    marginLeft: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
    textAlign: 'right',
    marginTop: 4,
  },
  memberTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 8,
  },
  memberTotalText: {
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
