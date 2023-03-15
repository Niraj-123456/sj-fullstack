import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
  metaData: "",
  error: "",
};

export const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    allClients: (state, action) => {
      state.clients = action.payload;
    },
    clientMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    clientError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { allClients, clientMetaData, clientError } = clientSlice.actions;
export default clientSlice.reducer;
