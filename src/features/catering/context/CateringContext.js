import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { db, addDoc, collection } from '../../../../firebase';

/**
 * @typedef {Object} CateringContextType
 * @property {Array} cateringCart - Array of items in cart
 * @property {number} guestCount - Number of guests
 * @property {Date} selectedDateTime - Selected date and time
 * @property {Function} setGuestCount - Function to update guest count
 * @property {Function} setSelectedDateTime - Function to update date/time
 * @property {Function} addToCateringCart - Function to add item to cart
 * @property {Function} saveCateringOrder - Function to save order
 */

const CateringContext = createContext(null);

export const CateringProvider = ({ children }) => {
  const [cateringCart, setCateringCart] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [guestCount, setGuestCount] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [error, setError] = useState(null);

  const addToCateringCart = useCallback((item) => {
    if (!item?.id) {
      setError('Invalid item data');
      return;
    }

    // Ensure all required fields are present
    const processedItem = {
      ...item,
      image: item.image_url || item.image,
      price: item.basePrice || item.price,
      totalPrice: item.totalPrice,
      customizations: item.customizations || {},
      quantity: item.quantity || 1,
      deliveryDate: item.deliveryDate || new Date(),
      specialInstructions: item.specialInstructions || ''
    };

    console.log('Adding to cart:', processedItem); // Debug log

    setCateringCart(prev => [...prev, processedItem]);
  }, []);

  const calculateItemTotal = (item) => {
    const basePrice = item.price * (item.quantity || 1);
    const customizationTotal = Object.values(item.customizations || {})
      .reduce((sum, option) => sum + (option?.price || 0), 0);
    return basePrice + customizationTotal;
  };

  const removeFromCart = useCallback((itemId) => {
    setCateringCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCateringCart([]);
  }, []);

  const saveCateringOrder = useCallback(async (orderDetails) => {
    try {
      if (!cateringCart.length) {
        throw new Error('Cart is empty');
      }

      const order = {
        items: cateringCart,
        totalAmount: cateringCart.reduce((sum, item) => sum + item.totalPrice, 0),
        orderDate: new Date(),
        status: 'pending',
        ...orderDetails
      };

      const docRef = await addDoc(collection(db, 'cateringOrders'), order);
      clearCart();
      return docRef.id;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [cateringCart, clearCart]);

  const contextValue = {
    cateringCart,
    guestCount,
    selectedDateTime,
    error,
    setGuestCount,
    setSelectedDateTime,
    addToCateringCart,
    removeFromCart,
    clearCart,
    saveCateringOrder,
    calculateItemTotal
  };

  return (
    <CateringContext.Provider value={contextValue}>
      {children}
    </CateringContext.Provider>
  );
};

CateringProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useCatering = () => {
  const context = useContext(CateringContext);
  if (!context) {
    throw new Error('useCatering must be used within a CateringProvider');
  }
  return context;
};
