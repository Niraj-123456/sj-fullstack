import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    toggleStaffLoadingState: (state) => !state,
  },
});

export const { toggleStaffLoadingState } = loadingSlice.actions;
export default loadingSlice.reducer;
