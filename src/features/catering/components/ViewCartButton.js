import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ViewCartButton = ({ itemCount, total, onPress }) => {
  const insets = useSafeAreaInsets();

  if (itemCount === 0) return null;

  return (
    <TouchableOpacity 
      style={[styles.container, { paddingBottom: insets.bottom }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.button}>
        <View style={styles.itemCount}>
          <Text style={styles.itemCountText}>{itemCount}</Text>
        </View>
        <Text style={styles.viewCartText}>View Cart</Text>
        <Text style={styles.totalText}>${total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 10,
  },
  button: {
    backgroundColor: '#32CD32',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingHorizontal: 20,
  },
  itemCount: {
    backgroundColor: '#fff',
    borderRadius: 15,
    minWidth: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCountText: {
    color: '#32CD32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ViewCartButton;
