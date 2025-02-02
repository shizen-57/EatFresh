import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useGroupOrder } from '../context/GroupOrderContext';
import GroupOrderItem from '../Components/GroupOrderItem';

const GroupOrderCart = ({ navigation }) => {
  const { groupCart, currentMember, groupOrder } = useGroupOrder();

  const totalAmount = groupCart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <ScrollView>
        {groupCart.map((item, index) => (
          <GroupOrderItem key={index} item={item} />
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ৳{totalAmount}</Text>
        {groupOrder?.creator === currentMember && (
          <Button
            title="Proceed to Checkout"
            onPress={() => navigation.navigate('CheckoutScreen')}
            buttonStyle={styles.checkoutButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
});

export default GroupOrderCart;
