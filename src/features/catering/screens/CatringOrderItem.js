import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Image } from 'react-native-elements';
import PropTypes from 'prop-types';

const CateringOrderItem = ({ item }) => {
  const formatDate = (date) => {
    try {
      // Check if date is a string and needs parsing
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Validate if date is valid
      if (!(dateObj instanceof Date) || isNaN(dateObj)) {
        return 'Date not specified';
      }

      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const renderCustomizations = () => {
    if (!item.customizations) return null;

    return Object.entries(item.customizations).map(([category, option]) => (
      <Text key={category} style={styles.customization}>
        {category.replace(/_/g, ' ')}: {option.name}
        {option.price > 0 ? ` (+$${option.price})` : ''}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text h4>{item.name}</Text>
        <Text>Quantity: {item.quantity}</Text>
        <Text>Delivery: {formatDate(item.deliveryDate)}</Text>
        {item.specialInstructions && (
          <Text>Notes: {item.specialInstructions}</Text>
        )}
        {renderCustomizations()}
        <Text style={styles.price}>
          ${(item.totalPrice || 0).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

CateringOrderItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    quantity: PropTypes.number,
    deliveryDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    specialInstructions: PropTypes.string,
    totalPrice: PropTypes.number,
    customizations: PropTypes.object
  }).isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 15,
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
    fontWeight: 'bold',
  },
  customization: {
    fontSize: 12,
    color: '#000',
    fontStyle: 'italic',
  },
});

export default React.memo(CateringOrderItem);
