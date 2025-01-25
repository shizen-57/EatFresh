import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomizationModal = ({ visible, menuItem, onClose, onAddToCart }) => {
  const [selections, setSelections] = useState({});
  const [totalPrice, setTotalPrice] = useState(menuItem?.price || 0);

  useEffect(() => {
    if (menuItem?.options) {
      const initialSelections = {};
      Object.keys(menuItem.options).forEach(category => {
        // Select first option as default for each category
        if (menuItem.options[category].length > 0) {
          initialSelections[category] = menuItem.options[category][0].id;
        }
      });
      setSelections(initialSelections);
      calculateTotal(initialSelections);
    }
  }, [menuItem]);

  const calculateTotal = (currentSelections) => {
    let total = menuItem?.price || 0;
    
    Object.entries(currentSelections).forEach(([category, selectedId]) => {
      const option = menuItem.options[category].find(opt => opt.id === selectedId);
      if (option) {
        total += option.price;
      }
    });
    
    setTotalPrice(total);
  };

  const handleSelection = (category, optionId) => {
    const newSelections = {
      ...selections,
      [category]: optionId
    };
    setSelections(newSelections);
    calculateTotal(newSelections);
  };

  if (!menuItem) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <ScrollView>
            <Image 
              source={{ uri: menuItem.image_url }} 
              style={styles.itemImage}
            />
            <Text style={styles.itemName}>{menuItem.name}</Text>
            <Text style={styles.description}>{menuItem.description}</Text>

            {Object.entries(menuItem.options || {}).map(([category, options]) => (
              <View key={category} style={styles.optionSection}>
                <Text style={styles.categoryTitle}>
                  {category.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
                <View style={styles.optionsContainer}>
                  {options.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        selections[category] === option.id && styles.selectedOption
                      ]}
                      onPress={() => handleSelection(category, option.id)}
                    >
                      <Text style={[
                        styles.optionText,
                        selections[category] === option.id && styles.selectedOptionText
                      ]}>
                        {option.name}
                      </Text>
                      {option.price > 0 && (
                        <Text style={styles.optionPrice}>+৳{option.price}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.totalPrice}>Total: ৳{totalPrice}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => onAddToCart({ 
                ...menuItem,
                selections,
                finalPrice: totalPrice
              })}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  optionSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minWidth: '30%',
  },
  selectedOption: {
    borderColor: '#FF4B4B',
    backgroundColor: '#FFF5F5',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#FF4B4B',
    fontWeight: '500',
  },
  optionPrice: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomizationModal;
