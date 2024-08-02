import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCheckoutFormFilled: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutFormFilled(state, action) {
      state.isCheckoutFormFilled = action.payload;
    },
  },
});

export const { setCheckoutFormFilled } = checkoutSlice.actions;

export default checkoutSlice.reducer;
