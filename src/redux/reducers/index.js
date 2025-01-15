import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import favouriteReducer from "./favouriteReducer";

let reducers = combineReducers({
  cartReducer: cartReducer,
  favouriteReducer: favouriteReducer,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;