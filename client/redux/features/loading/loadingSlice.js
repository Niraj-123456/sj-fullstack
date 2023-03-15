import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPartialLoading: false,
  isPageLoading: false,
};

export const loadingSlice = createSlice({
  name: "isLoading",
  initialState,
  reducers: {
    togglePartialLoadingState: (state) => {
      state.isPartialLoading = !state.isPartialLoading;
    },

    togglePageLoadingState: (state) => {
      state.isPageLoading = !state.isPageLoading;
    },
  },
});

export const { togglePartialLoadingState, togglePageLoadingState } =
  loadingSlice.actions;
export default loadingSlice.reducer;
