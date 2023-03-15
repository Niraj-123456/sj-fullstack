import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userHomeData: "",
};

export const homeDataSlice = createSlice({
  name: "homeData",
  initialState,
  reducers: {
    fetchUserHomeData: (state, action) => {
      state.userHomeData = action.payload;
    },
  },
});

export const { fetchUserHomeData } = homeDataSlice.actions;
export default homeDataSlice.reducer;
