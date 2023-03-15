import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataBar: "",
  serviceLists: [],
  bookingStatusLists: "",
  serviceProviders: [],
};

const staffDashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    staffDataBar: (state, action) => {
      state.dataBar = action.payload;
    },
    staffServiceLists: (state, action) => {
      state.serviceLists = action.payload;
    },
    staffBookingStatusLists: (state, action) => {
      state.bookingStatusLists = action.payload;
    },
    allServiceProviders: (state, action) => {
      state.serviceProviders = action.payload;
    },
  },
});

export const {
  staffDataBar,
  staffServiceLists,
  staffBookingStatusLists,
  allServiceProviders,
} = staffDashboardSlice.actions;

export default staffDashboardSlice.reducer;
