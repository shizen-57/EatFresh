const initialState = {
  selectedItems: {
    items: [],
    restaurantName: ""
  }
};

const cartReducer = (state = initialState, action = {}) => {
  if (!action || typeof action !== 'object') {
    return state;
  }

  switch (action.type) {
    case "ADD_TO_CART": {
      if (!action.payload) return state;

      const newState = { ...state };

      if (action.payload.checkboxValue) {
        newState.selectedItems = {
          items: [...newState.selectedItems.items, action.payload],
          restaurantName: action.payload.restaurantName,
        };
      } else {
        newState.selectedItems = {
          items: newState.selectedItems.items.filter(
            (item) => item.name !== action.payload.name
          ),
          restaurantName: action.payload.restaurantName,
        };
      }
      return newState;
    }

    default:
      return state;
  }
};

export default cartReducer;