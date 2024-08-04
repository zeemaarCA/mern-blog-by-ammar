import { createContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (currentUser) {
        try {
          const res = await fetch(`/api/cart/${currentUser._id}`);
          const data = await res.json();
          if (res.ok) {
            setCartItems(data.cartItems || []);
          } else {
            console.error("Failed to fetch cart items:", data.message);
          }
        } catch (error) {
          console.error("An unexpected error occurred:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  const updateCart = async (newCartItems) => {
    if (currentUser) {
      try {
        const res = await fetch(`/api/cart/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartItems: newCartItems }),
        });

        if (res.ok) {
          setCartItems(newCartItems);
        } else {
          const data = await res.json();
          console.error("Failed to update cart:", data.message);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const removeItem = async (id) => {
    if (currentUser) {
      try {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        await updateCart(updatedCartItems);
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, updateCart, cartCount, removeItem, loading }}>
      {children}
    </CartContext.Provider>
  );
};
