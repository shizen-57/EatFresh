import * as React from "react";
import RootNavigation from "./src/infrastructure/Navigation/app.navigator";
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <RootNavigation />
    </CartProvider>
  );
}