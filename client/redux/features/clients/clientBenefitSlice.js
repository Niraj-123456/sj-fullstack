import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  benefitsData: [],
  metaData: "",
  error: "",
};

export const clientBenefitSlice = createSlice({
  name: "clientBenefits",
  initialState,
  reducers: {
    benefitsTableData: (state, action) => {
      state.benefitsData = action.payload;
    },
    benefitsMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    benefitsError: (state, action) => {
      state.tableError = action.payload;
    },
  },
});

export const { benefitsTableData, benefitsMetaData, benefitsError } =
  clientBenefitSlice.actions;
export default clientBenefitSlice.reducer;
