import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  homeData: [],
  serviceOptions: [],
};

export const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    storeHomePageData: (state, action) => {
      return { ...state, homeData: action.payload };
    },
  },
});

export const { storeHomePageData } = homePageSlice.actions;

export default homePageSlice.reducer;
