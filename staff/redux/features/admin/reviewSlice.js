import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookingReviews: [],
  metaData: "",
  error: "",
};

const reviewSlice = createSlice({
  name: "bookingReview",
  initialState,
  reducers: {
    allBookingReviews: (state, action) => {
      state.bookingReviews = action.payload;
    },
    addBookingReview: (state, action) => {
      return {
        ...state,
        bookingReviews: [action.payload, ...state.bookingReviews],
      };
    },
    updateBookingReview: (state, action) => {
      return {
        ...state,
        bookingReviews: state.bookingReviews.map((review) =>
          review.id === action.payload.id ? action.payload : review
        ),
      };
    },
    reviewMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    reviewError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  allBookingReviews,
  addBookingReview,
  updateBookingReview,
  reviewMetaData,
  reviewError,
} = reviewSlice.actions;
export default reviewSlice.reducer;
