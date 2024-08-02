/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cartData = Cookies.get('cart');
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
  }, []);

  const updateCart = (newCartItems) => {
    setCartItems(newCartItems);
    Cookies.set('cart', JSON.stringify(newCartItems));
  };

  const removeItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    updateCart(updatedCartItems);
  };


  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, updateCart, cartCount, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
