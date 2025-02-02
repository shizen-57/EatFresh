import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useGroupOrder } from '../context/GroupOrderContext';
import { auth } from '../../../../firebase';
import GroupOrderItem from '../Components/GroupOrderItem'; // Ensure this import is correct

export default function GroupCart() {
  const navigation = useNavigation();
  const { groupOrder, currentMember, updateGroupOrder } = useGroupOrder();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (groupOrder && groupOrder.items) {
      setCartItems(groupOrder.items);
    }
  }, [groupOrder]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.finalPrice || item.price) * (item.quantity || 1);
    }, 0);
  };

  const updateItemQuantity = (itemId, change) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId && item.addedBy === currentMember) {
        const newQuantity = (item.quantity || 1) + change;
        if (newQuantity < 1) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);

    setCartItems(updatedItems);
    updateGroupOrder({ ...groupOrder, items: updatedItems });
  };

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter(item => 
      !(item.id === itemId && item.addedBy === currentMember)
    );
    setCartItems(updatedItems);
    updateGroupOrder({ ...groupOrder, items: updatedItems });
  };

  const handleRemoveItem = (itemId) => {
    if (!cartItems) return;
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    updateGroupOrder({ ...groupOrder, items: updatedItems });
  };

  const handleCheckout = () => {
    if (!cartItems.length) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    const myItems = cartItems.filter(item => item.addedBy === currentMember);
    
    navigation.navigate('GroupOrdering', {
      screen: 'GroupCartCheckout',
      params: {
        items: myItems,
        isGroupOrder: true,
        groupOrderId: groupOrder.id
      }
    });
  };

  const renderItem = (item) => {
    const isMyItem = item.addedBy === currentMember;

    return (
      <View key={`${item.id}-${item.addedBy}`} style={styles.cartItem}>
        <GroupOrderItem item={item} handleRemoveItem={handleRemoveItem} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.cartList}>
        {cartItems.length > 0 ? (
          cartItems.map(renderItem)
        ) : (
          <Text style={styles.emptyCart}>Your group cart is empty</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>৳{calculateTotal()}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            (!cartItems.length || isLoading) && styles.disabledButton
          ]}
          onPress={handleCheckout}
          disabled={!cartItems.length || isLoading}
        >
          <Text style={styles.checkoutButtonText}>
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addedBy: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
  },
  quantity: {
    paddingHorizontal: 12,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
    padding: 8,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  emptyCart: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
});
