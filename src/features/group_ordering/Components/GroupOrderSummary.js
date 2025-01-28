import React from 'react';
import { View, StyleSheet, Text } from 'react-native'; // Use React Native's Text
import { FontAwesome5 } from '@expo/vector-icons';

export default function GroupOrderSummary({ memberCount, totalItems }) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <FontAwesome5 name="users" size={24} color="#000" />
        <Text style={styles.infoText}>
          {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <FontAwesome5 name="shopping-bag" size={24} color="#000" />
        <Text style={styles.infoText}>
          {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    marginTop: 8,
    fontSize: 16,
    color: '#000',
  },
});
