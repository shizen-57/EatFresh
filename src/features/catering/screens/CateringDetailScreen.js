import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Image, Input, Divider } from 'react-native-elements';
import { useCatering } from '../context/CateringContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';  // Corrected quote

const OptionItem = ({ options, isSelected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.optionItem, isSelected && styles.selectedOption]}
    onPress={onSelect}
  >
    <View style={styles.optionMainContent}>
      <View style={styles.optionLeft}>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={isSelected}
            disableBuiltInState
            fillColor="#fc8019"
            unfillColor="#fff"
            onPress={onSelect}
            size={20}
          />
        </View>
        <View style={styles.optionDetails}>
          <Text style={styles.optionText}>
            {options?.name || 'Unnamed Option'}
          </Text>
          <Text style={styles.optionPrice}>
            {options?.price > 0 ? `৳${options?.price?.toFixed(2)}` : 'Free'}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const DetailHeader = ({ item }) => (
  <View style={styles.headerContainer}>
    <Image 
      source={{ uri: item.image }} 
      style={styles.headerImage}
      PlaceholderContent={<ActivityIndicator />}
    />
    <View style={styles.headerInfo}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.basePrice}>Base Price: ৳{item.price}</Text>
    </View>
  </View>
);

const DateTimeSelector = ({ date, onDatePress, onTimePress }) => (
  <View style={styles.dateTimeContainer}>
    <TouchableOpacity style={styles.dateButton} onPress={onDatePress}>
      <MaterialIcons name="calendar-today" size={24} color="#32CD32" />
      <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.dateButton} onPress={onTimePress}>
      <MaterialIcons name="access-time" size={24} color="#32CD32" />
      <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
    </TouchableOpacity>
  </View>
);

const CateringDetailScreen = ({ route, navigation }) => {
  const { item, restaurantName } = route.params;
  const { addToCateringCart } = useCatering();
  const [quantity, setQuantity] = useState(''); // Changed to empty string
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState('date');
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizations, setCustomizations] = useState({});

  const handleCustomizationSave = (selections) => {
    setCustomizations(selections);
  };

  const calculateTotalPrice = () => {
    const parsedQuantity = parseInt(quantity) || 0;
    const basePrice = item.price * parsedQuantity;
    
    // Calculate customization total
    const customizationTotal = Object.entries(customizations).reduce((sum, [optionCategory, options]) => {
      const price = options?.price || 0;
      // Multiply price by quantity only for add-ons
      return sum + (price * (optionCategory === 'add_ons' ? parsedQuantity : 1));
    }, 0);

    return basePrice + customizationTotal;
  };

  const handleAddToCart = () => {
    const parsedQuantity = parseInt(quantity);
    if (!parsedQuantity || parsedQuantity < (item.minGuests || 10)) {
      Alert.alert('Invalid Quantity', `Minimum ${item.minGuests || 10} guests required`);
      return;
    }

    const finalItem = {
      ...item,
      quantity: parsedQuantity,
      specialInstructions,
      deliveryDate,
      restaurantName,
      customizations,
      totalPrice: calculateTotalPrice()
    };

    addToCateringCart(finalItem);
    navigation.navigate('CateringCart');
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setDeliveryDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShowDatePicker(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const handleOptionSelect = (category, options) => {
    setCustomizations(prev => ({
      ...prev,
      [category]: options
    }));
  };

  // Add validation for customization options
  const hasCustomizations = React.useMemo(() => {
    return item.options && Object.keys(item.options).some(key => 
      Array.isArray(item.options[key]) && item.options[key].length > 0
    );
  }, [item.options]);

  // Update the customization section render logic
  const renderCustomizationOptions = () => {
    if (!item.options) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customization Options</Text>
        {Object.keys(item.options).map(category => {
          const options = item.options[category];
          if (!Array.isArray(options) || options.length === 0) return null;

          return (
            <View key={category} style={styles.optionCategory}>
              <Text style={styles.categoryTitle}>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
              <View style={styles.optionsContainer}>
                {options.map(option => (
                  <OptionItem
                    key={option.id}
                    options={{
                      id: option.id,
                      name: option.optionName || option.name || option.title, // Try all possible name fields
                      price: option.price
                    }}
                    isSelected={customizations[category]?.id === option.id}
                    onSelect={() => handleOptionSelect(category, option)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DetailHeader item={item} />
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Input
            label="Quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={(val) => setQuantity(val)}
            containerStyle={styles.input}
          />
          
          <DateTimeSelector 
            date={deliveryDate}
            onDatePress={showDatepicker}
            onTimePress={showTimepicker}
          />
        </View>

        {hasCustomizations && (
          <>
            <Divider style={styles.divider} />
            {renderCustomizationOptions()}
          </>
        )}

        <Input
          label="Special Instructions"
          multiline
          numberOfLines={3}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          containerStyle={styles.input}
        />

        {showDatePicker && (
          <DateTimePicker
            value={deliveryDate}
            mode={mode}
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>৳{calculateTotalPrice().toFixed(2)}</Text>
        </View>
        <Button
          title="Add to Catering Cart"
          onPress={handleAddToCart}
          buttonStyle={styles.addButton}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerImage: {
    width: '100%',
    height: 220,
  },
  headerInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#7e808c',
    marginBottom: 8,
    lineHeight: 20,
  },
  basePrice: {
    fontSize: 16,
    color: '#282c3f',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 16,
  },
  optionCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#282c3f',
    marginBottom: 12,
  },
  optionItem: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f3',
  },
  optionMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  optionDetails: {
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    color: '#282c3f',
    marginBottom: 4,
  },
  optionPrice: {
    fontSize: 14,
    color: '#fc8019',
    fontWeight: '500',
  },
  selectedOption: {
    backgroundColor: '#fff8f3',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f3',
  },
  addButton: {
    backgroundColor: '#fc8019',
    paddingVertical: 14,
    borderRadius: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 14,
    color: '#7e808c',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d4d5d9',
  },
  dateText: {
    fontSize: 14,
    color: '#282c3f',
    marginLeft: 8,
  },
  divider: {
    height: 8,
    backgroundColor: '#f8f8f8',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  optionsContainer: {
    marginTop: 8,
    paddingHorizontal: 2,
  },
});

export default CateringDetailScreen;
