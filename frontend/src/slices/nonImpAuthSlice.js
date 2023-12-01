import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  impInfo:
    localStorage.getItem("impInfo") &&
    localStorage.getItem("impInfo") !== "undefined"
      ? JSON.parse(localStorage.getItem("impInfo"))
      : null,
};

const nonImpAuthSlice = createSlice({
  name: "impAuth",
  initialState,
  reducers: {
    setImpCredentials: (state, action) => {
      state.impInfo = action.payload;
      localStorage.setItem("impInfo", JSON.stringify(action.payload));
    },
    clearImpCredentials: (state, action) => {
      state.impInfo = null;
      localStorage.removeItem("impInfo");
    },
  },
});

export const { setImpCredentials, clearImpCredentials } =
  nonImpAuthSlice.actions;

export default nonImpAuthSlice.reducer;
