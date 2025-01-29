import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OrderItem({ item }) {
  const { 
    name, 
    selectedOptions, 
    finalPrice,
    quantity = 1 
  } = item;

  const renderCustomizations = () => {
    if (!selectedOptions) return null;

    return Object.entries(selectedOptions).map(([category, option]) => (
      <Text key={category} style={styles.customization}>
        {option.name} (+৳{option.price})
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          {quantity > 1 && (
            <Text style={styles.quantityBadge}>×{quantity}</Text>
          )}
        </View>
        {renderCustomizations()}
      </View>
      <Text style={styles.price}>৳{finalPrice?.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mainInfo: {
    flex: 1,
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  quantityBadge: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  customization: {
    color: "gray",
    fontSize: 14,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
});