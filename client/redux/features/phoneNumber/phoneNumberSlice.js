import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phoneNumber: null,
};

const phoneNumberSlice = createSlice({
  name: "phoneNumber",
  initialState,
  reducers: {
    storePhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    clearPhoneNumber: (state) => {
      state.phoneNumber = null;
    },
  },
});

export const { storePhoneNumber, clearPhoneNumber } = phoneNumberSlice.actions;

export default phoneNumberSlice.reducer;
