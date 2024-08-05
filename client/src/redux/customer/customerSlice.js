import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerData: null, // Single object for all customer data
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // setCustomerData is property
    setCustomerData: (state, action) => {
      state.customerData = action.payload;
    },

    clearCustomerData: (state) => {
      state.customerData = null;
  },
  },
});

export const { setCustomerData, clearCustomerData } = customerSlice.actions;

export const getCustomerData = (state) => state.customer.customerData; // Updated selector

export default customerSlice.reducer;