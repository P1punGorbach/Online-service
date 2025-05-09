// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

// 1) создаём контекст
const CartContext = createContext();

// 2) провайдер, оборачиваем в него всё приложение
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = item => setCartItems(prev => [...prev, item]);
  const removeFromCart = id => setCartItems(prev => prev.filter(i => i.id !== id));

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 3) хук для удобного доступа к корзине
export function useCart() {
  return useContext(CartContext);
}
