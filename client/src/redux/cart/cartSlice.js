// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setCartItems(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      const item = action.payload;
      const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    updateItemQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === id);
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity = quantity;
      }
    },
    removeItem(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
    clearCart: (state) => {
      state.items = [];
      state.loading = false; // Reset loading state
      state.error = null;   // Reset error state
  },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setCartItems,
  addItem,
  updateItemQuantity,
  removeItem,
  setError,
  clearCart
} = cartSlice.actions;



export const selectCartItems = (state) => state.cart.items;

export const selectTotalQuantity = (state) => {
  // Check if items is an array before reducing
  return Array.isArray(state.cart.items)
    ? state.cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;
};



export default cartSlice.reducer;
