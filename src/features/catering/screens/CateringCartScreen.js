import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Button, Divider } from 'react-native-elements';
import { useCatering } from '../context/CateringContext';
import CateringOrderItem from './CatringOrderItem';
import LottieView from 'lottie-react-native';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase'; // Corrected import path

const CateringCartScreen = ({ navigation }) => {
  const { cateringCart, saveCateringOrder } = useCatering();

  const calculateTotals = () => {
     console.log('Cart items for calculation:', cateringCart); // Debug log

    const subtotal = cateringCart.reduce((sum, item) => {
      const itemTotal = item.totalPrice || (item.price * (item.quantity || 1));
      return sum + itemTotal;
    }, 0);

    const serviceCharge = subtotal * 0.10;
    const deliveryFee = 50;
    
    return {
      subtotal,
      serviceCharge,
      deliveryFee,
      total: subtotal + serviceCharge + deliveryFee
    };
  };

  const handleCheckout = async () => {
    try {
      const totals = calculateTotals();
      const orderData = {
        orderSummary: totals,
        orderDate: new Date(),
        userId: auth.currentUser.uid, // Assuming user is authenticated
        items: cateringCart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice
        }))
      };

      const ordersRef = collection(db, "cateringOrders");
      const docRef = await addDoc(ordersRef, orderData);
      
      navigation.navigate('CateringOrderConfirmation', { orderId: docRef.id });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (cateringCart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={require('../../../../assets/animations/empty-cart.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text h4>Your catering cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cateringCart}
        renderItem={({ item }) => <CateringOrderItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <Divider />}
      />

      <View style={styles.summaryContainer}>
        <Text h4>Total: ${calculateTotals().total.toFixed(2)}</Text>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          raised
          containerStyle={styles.checkoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  summaryContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutButton: {
    marginTop: 10,
  },
});

export default CateringCartScreen;
