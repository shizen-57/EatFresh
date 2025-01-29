import React, { useState, memo, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Icon } from 'react-native-elements'; // Add this import
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Divider } from "react-native-elements";
import { useCart } from "../../context/CartContext";
import { useGroupOrder } from "../../features/group_ordering/context/GroupOrderContext";

// Subcomponents
const FoodInfo = memo(({ food, onPress }) => (
  <TouchableOpacity style={styles.foodInfo} onPress={onPress}>
    <Text style={styles.titleStyle}>{food.name}</Text>
    <Text style={styles.description}>{food.description}</Text>
    <Text style={styles.price}>৳{food.price}</Text>
    <View style={styles.dishTypes}>
      {food.dish_type?.map((type, index) => (
        <Text key={index} style={styles.dishType}>{type}</Text>
      ))}
    </View>
    {food.customizable && (
      <Text style={styles.customizable}>Customizable</Text>
    )}
  </TouchableOpacity>
));

const FoodImage = memo(({ food }) => (
  <Image 
    source={{ uri: food.image_url }} 
    style={styles.foodImage}
  />
));

const MenuItem = memo(({ food, onSelect, isChecked, isGroupOrder }) => (
  <TouchableOpacity 
    style={styles.menuItemStyle} 
    onPress={() => onSelect(food)}
    activeOpacity={0.7}
  >
    <View style={styles.contentContainer}>
      <View style={styles.info}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {food.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>৳{food.price}</Text>
          {food.customizable && (
            <Text style={styles.customizableText}>Customizable</Text>
          )}
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: food.image_url }}
          style={styles.foodImage}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>
    </View>
    {food.popularItem && (
      <View style={styles.popularBadge}>
        <Icon name="star" type="material" size={16} color="#fff" />
        <Text style={styles.popularText}>Popular</Text>
      </View>
    )}
  </TouchableOpacity>
));

const CustomizationModal = memo(({ 
  selectedFood, 
  modalVisible, 
  selectedOptions, 
  onClose, 
  onOptionSelect, 
  onAddToCart, 
  calculateTotalPrice,
  isGroupOrder 
}) => {
  const [quantity, setQuantity] = useState(1);

  // Add quantity controls
  const adjustQuantity = (increment) => {
    setQuantity(prev => Math.max(1, prev + increment));
  };

  const finalPrice = calculateTotalPrice(selectedFood, selectedOptions) * quantity;

  if (!selectedFood) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedFood.name}</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {selectedFood.options && Object.entries(selectedFood.options).map(([category, options]) => (
              <View key={category} style={styles.optionCategory}>
                <Text style={styles.categoryTitle}>
                  {category.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionItem,
                      selectedOptions[category]?.id === option.id && styles.selectedOption
                    ]}
                    onPress={() => onOptionSelect(category, option)}
                  >
                    <Text>{option.name}</Text>
                    <Text>+৳{option.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  onPress={() => adjustQuantity(-1)}
                  style={styles.quantityButton}
                >
                  <Icon 
                    name="minus" 
                    type="font-awesome-5" 
                    size={12} 
                    color="#000"
                  />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => adjustQuantity(1)}
                  style={styles.quantityButton}
                >
                  <Icon 
                    name="plus" 
                    type="font-awesome-5" 
                    size={12} 
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.totalPrice}>
              Total: ৳{finalPrice}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToCart(quantity)}
          >
            <Text style={styles.addButtonText}>
              Add to {isGroupOrder ? 'Group Cart' : 'Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const MenuItemsComponent = ({ restaurantName, restaurantId, foods }) => {
  const { selectedItems, addToCart } = useCart();
  const { groupOrder, addItemToGroupCart, currentMember, groupCart } = useGroupOrder();
  
  // Update isItemInCart to check for current user's items only
  const isItemInCart = useCallback((itemId) => {
    if (groupOrder) {
      // Only check items added by the current user
      return groupCart.some(item => 
        item.id === itemId && item.addedBy === currentMember
      );
    }
    
    if (!selectedItems?.restaurants) return false;
    return Object.values(selectedItems.restaurants).some(restaurant => 
      restaurant.items.some(item => item.id === itemId)
    );
  }, [selectedItems, groupOrder, groupCart, currentMember]);

  const [modalState, setModalState] = useState({
    visible: false,
    selectedFood: null,
    selectedOptions: {}
  });

  const handleFoodSelect = useCallback((food) => {
    setModalState({
      visible: true,
      selectedFood: food,
      selectedOptions: {}
    });
  }, []);

  const handleOptionSelect = useCallback((category, option) => {
    setModalState(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [category]: option
      }
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({
      visible: false,
      selectedFood: null,
      selectedOptions: {}
    });
  }, []);

  const calculateTotalPrice = useCallback((food, options) => {
    if (!food) return 0;
    const basePrice = food.price || 0;
    const optionsPrice = options ? 
      Object.values(options).reduce((sum, option) => sum + (option.price || 0), 0) 
      : 0;
    return basePrice + optionsPrice;
  }, []);

  const handleAddToCart = useCallback((quantity) => {
    const { selectedFood, selectedOptions } = modalState;
    const basePrice = calculateTotalPrice(selectedFood, selectedOptions);
    
    const itemToAdd = {
      ...selectedFood,
      selectedOptions,
      price: selectedFood.price,
      finalPrice: basePrice * quantity,
      restaurantName,
      restaurantId,
      addedAt: new Date().toISOString(),
      quantity
    };

    if (groupOrder) {
      addItemToGroupCart(itemToAdd, currentMember);
    } else {
      addToCart(itemToAdd, restaurantName, restaurantId, true);
    }
    
    handleCloseModal();
  }, [modalState, calculateTotalPrice, groupOrder, addItemToGroupCart, addToCart]);

  const memoizedFoods = useMemo(() => (
    foods.map((food) => (
      <View key={food.id}>
        <MenuItem 
          food={food}
          onSelect={handleFoodSelect}
          isChecked={isItemInCart(food.id)}
          isGroupOrder={!!groupOrder}
        />
        <Divider width={0.5} />
      </View>
    ))
  ), [foods, isItemInCart, handleFoodSelect, groupOrder]);

  if (!Array.isArray(foods) || foods.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text>
          {!Array.isArray(foods) ? 'Error loading menu items' : 'No menu items available'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {memoizedFoods}
      <CustomizationModal
        selectedFood={modalState.selectedFood}
        modalVisible={modalState.visible}
        selectedOptions={modalState.selectedOptions}
        onClose={handleCloseModal}
        onOptionSelect={handleOptionSelect}
        onAddToCart={handleAddToCart}
        calculateTotalPrice={calculateTotalPrice}
        isGroupOrder={!!groupOrder}
      />
    </ScrollView>
  );
}

const MenuItems = memo(MenuItemsComponent);

const styles = StyleSheet.create({
  menuItemStyle: {
    padding: 16,
    backgroundColor: '#fff',
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginRight: 8,
  },
  customizableText: {
    fontSize: 13,
    color: '#00a854',
    fontWeight: '500',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 16,
    backgroundColor: '#ff3008',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  foodInfo: {
    width: 240,
    justifyContent: "space-evenly",
  },
  titleStyle: {
    fontSize: 19,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  dishTypes: {
    flexDirection: "row",
    marginTop: 5,
    flexWrap: "wrap",
  },
  dishType: {
    fontSize: 12,
    color: "gray",
    marginRight: 8,
    backgroundColor: "#f5f5f5",
    padding: 4,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  optionCategory: {
    marginBottom: 15
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 5,
    borderRadius: 5
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'right'
  },
  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  customizable: {
    color: 'green',
    fontSize: 12,
    marginTop: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedOption: {
    backgroundColor: '#e6ffe6',
    borderColor: 'green',
    borderWidth: 1,
  },
  menuList: {
    padding: 20,
  },
  groupAddButton: {
    backgroundColor: '#4CAF50',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default memo(MenuItemsComponent);