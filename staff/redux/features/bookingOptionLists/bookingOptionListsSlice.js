import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceLists: [],
  bookingStatuses: [],
  serviceProviders: [],
};

const bookingOptionListsSlice = createSlice({
  name: "bookingOptionLists",
  initialState,
  reducers: {
    allServiceLists: (state, action) => {
      state.serviceLists = action.payload;
    },
    allBookingStatuses: (state, action) => {
      state.bookingStatuses = action.payload;
    },
    allServiceProviders: (state, action) => {
      state.serviceProviders = action.payload;
    },
  },
});

export const { allServiceLists, allBookingStatuses, allServiceProviders } =
  bookingOptionListsSlice.actions;
export default bookingOptionListsSlice.reducer;
