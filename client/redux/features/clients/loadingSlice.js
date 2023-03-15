import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    toggleClientLoadingState: (state) => !state,
  },
});

export const { toggleClientLoadingState } = loadingSlice.actions;

export default loadingSlice.reducer;
