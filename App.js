import * as React from "react";
import RootNavigation from "./src/infrastructure/Navigation/app.navigator";
import { CartProvider } from './src/context/CartContext';
import { FavouritesContextProvider } from "./src/features/favourites/context/FavouriteContext";
import { GroupOrderProvider } from './src/features/group ordering/context/GroupOrderContext';

export default function App() {
  return (
    <CartProvider>
      <FavouritesContextProvider>
        <GroupOrderProvider>
          <RootNavigation />
        </GroupOrderProvider>
      </FavouritesContextProvider>
    </CartProvider>
  );
}