import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookingData: [],
  discounts: [],
  metaData: "",
  tableError: "",
};

const userBookingDataSlice = createSlice({
  name: "userBookingData",
  initialState,
  reducers: {
    addNewBooking: (state, action) => {
      return {
        ...state,
        bookingData: [action.payload, ...state.bookingData],
      };
    },
    bookingTableData: (state, action) => {
      state.bookingData = action.payload;
    },
    bookingDiscounts: (state, action) => {
      state.discounts = action.payload;
    },
    tableMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    tableDataError: (state, action) => {
      state.tableError = action.payload;
    },
  },
});

export const {
  addNewBooking,
  bookingTableData,
  bookingDiscounts,
  tableMetaData,
  tableDataError,
} = userBookingDataSlice.actions;
export default userBookingDataSlice.reducer;
