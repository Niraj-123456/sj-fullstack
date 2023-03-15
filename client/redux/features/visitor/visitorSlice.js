import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visitorInfo: "",
};

export const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    storeVisitorInfo: (state, action) => {
      state.visitorInfo = action.payload;
    },
  },
});

export const { storeVisitorInfo } = visitorSlice.actions;

export default visitorSlice.reducer;
