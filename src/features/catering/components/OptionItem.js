import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const OptionItem = ({ options, isSelected, onSelect }) => {
  // Log the received options to debug
  console.log('OptionItem received options:', options);
  
  return (
    <TouchableOpacity 
      style={[styles.optionItem, isSelected && styles.selectedOption]}
      onPress={onSelect}
    >
      <View style={styles.optionLeft}>
        <BouncyCheckbox
          isChecked={isSelected}
          disableBuiltInState
          fillColor="#32CD32"
          onPress={onSelect}
        />
        <Text style={styles.optionText} numberOfLines={1}>
          {typeof options === 'object' && (options.name || options.title || 'Unnamed Option')}
        </Text>
      </View>
      <Text style={styles.optionPrice}>
        {options?.price > 0 ? `+৳${options.price.toFixed(2)}` : 'Free'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    minHeight: 60,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.7, // Give more space to the left side
    marginRight: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    flexShrink: 1, // Allow text to shrink if needed
    flexWrap: 'wrap', // Allow text to wrap
  },
  optionPrice: {
    color: '#32CD32',
    fontWeight: '600',
    fontSize: 14,
    flex: 0.3, // Give less space to price
    textAlign: 'right',
  },
  selectedOption: {
    backgroundColor: '#e6ffe6',
    borderColor: '#32CD32',
    borderWidth: 1,
  },
});

export default OptionItem;
