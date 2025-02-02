import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { useGroupOrder } from '../context/GroupOrderContext';

export default function GroupOrderItem({ item }) {
  const { groupCart, setGroupCart, handleRemoveItem } = useGroupOrder();

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

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image 
          source={{ uri: item.image_url }}
          style={styles.image}
          defaultSource={require('../../../../assets/placeholder.png')}
        />
        <View style={styles.vegIndicator}>
          <View style={[styles.dot, { backgroundColor: item.isVeg ? '#0f8a0f' : '#e23744' }]} />
        </View>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.restaurant}>{item.restaurantName}</Text>
        
        {item.selectedOptions && (
          <View style={styles.optionsContainer}>
            {Object.entries(item.selectedOptions).map(([category, option]) => (
              <Text key={category} style={styles.optionText}>
                {option.name} (+৳{option.price})
              </Text>
            ))}
          </View>
        )}

        <View style={styles.bottomRow}>
          <Text style={styles.price}>৳{calculateItemTotal(item)}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>Qty: {item.quantity || 1}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Icon name="trash" type="font-awesome" color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 1,
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
  },
  leftContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  vegIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 2,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3e4152',
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 13,
    color: '#7e808c',
    marginBottom: 8,
  },
  optionsContainer: {
    marginVertical: 6,
  },
  optionText: {
    fontSize: 12,
    color: '#7e808c',
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3e4152',
  },
  quantityContainer: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quantity: {
    fontSize: 13,
    color: '#3e4152',
    fontWeight: '500',
  },
  removeButton: {
    padding: 10,
  },
});
