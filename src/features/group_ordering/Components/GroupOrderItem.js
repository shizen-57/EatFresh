import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native'; // Use React Native's Text

export default function GroupOrderItem({ item }) {
  return (
    <View style={styles.container}>
      {item.image && (
        <Image 
          source={{ uri: item.image }}
          style={styles.image}
        />
      )}
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.addedBy}>Added by: {item.addedBy}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addedBy: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
