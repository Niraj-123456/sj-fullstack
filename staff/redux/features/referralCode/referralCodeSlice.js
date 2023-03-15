import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  referralCode: null,
};

const referralCodeSlice = createSlice({
  name: "referralCode",
  initialState,
  reducers: {
    storeReferralCode: (state, action) => {
      state.referralCode = action.payload;
    },
    clearReferralCode: (state) => {
      state.referralCode = null;
    },
  },
});

export const { storeReferralCode, clearReferralCode } =
  referralCodeSlice.actions;
export default referralCodeSlice.reducer;
