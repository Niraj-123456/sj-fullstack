import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardBookingTableData: [],
  metaData: "",
  error: "",
};

export const bookingSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addBookingByStaff: (state, action) => {
      return {
        ...state,
        dashboardBookingTableData: [
          action.payload,
          ...state.dashboardBookingTableData,
        ],
      };
    },
    updateBookingByStaff: (state, action) => {
      return {
        ...state,
        dashboardBookingTableData: state.dashboardBookingTableData.map(
          (booking) =>
            booking.id === action.payload.id ? action.payload : booking
        ),
      };
    },
    updateBookingReview: (state, action) => {
      return {
        ...state,
        dashboardBookingTableData: state.dashboardBookingTableData.map(
          (booking) =>
            booking.id === action.payload.reviewedBooking.id
              ? {
                  ...booking,
                  bookingReview: {
                    createdDateTime: action.payload?.createdDateTime,
                    employeeFeedbackExplanation:
                      action.payload?.employeeFeedbackExplanation,
                    employeeRating: action.payload?.employeeRating,
                    id: action.payload?.id,
                    lastChangedDateTime: action.payload?.lastChangedDateTime,
                    serviceRating: action.payload?.serviceRating,
                    serviceRatingExplanation:
                      action.payload?.serviceRatingExplanation,
                  },
                }
              : booking
        ),
      };
    },
    dashBoardData: (state, action) => {
      state.dashboardBookingTableData = action.payload;
    },

    tableMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    tableError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addBookingByStaff,
  updateBookingByStaff,
  updateBookingReview,
  dashBoardData,
  tableMetaData,
  tableError,
} = bookingSlice.actions;
export default bookingSlice.reducer;
