import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState({
    items: [],
    restaurantName: "",
    restaurantId: null
  });

  const addToCart = (item, restaurantName, restaurantId, checkboxValue) => {
    if (checkboxValue) {
      setSelectedItems({
        items: [...selectedItems.items, item],
        restaurantName: restaurantName,
        restaurantId: restaurantId
      });
    } else {
      setSelectedItems({
        items: selectedItems.items.filter(
          (existingItem) => !(existingItem.name === item.name && 
                            existingItem.restaurantId === restaurantId)
        ),
        restaurantName: restaurantName,
        restaurantId: restaurantId
      });
    }
  };

  return (
    <CartContext.Provider value={{ selectedItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
