import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookingStatuses: [],
  serviceProviders: [],
};

const bookingOptionListsSlice = createSlice({
  name: "bookingOptionLists",
  initialState,
  reducers: {
    allBookingStatuses: (state, action) => {
      state.bookingStatuses = action.payload;
    },
    allServiceProviders: (state, action) => {
      state.serviceProviders = action.payload;
    },
  },
});

export const { allBookingStatuses, allServiceProviders } =
  bookingOptionListsSlice.actions;
export default bookingOptionListsSlice.reducer;
