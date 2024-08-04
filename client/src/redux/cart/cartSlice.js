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
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectTotalQuantity = (state) => {
  return state.cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
};

export default cartSlice.reducer;
