import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coachOtpInfo:
    localStorage.getItem("coachOtpInfo") &&
    localStorage.getItem("coachOtpInfo") !== "undefined"
      ? JSON.parse(localStorage.getItem("coachOtpInfo"))
      : null,
};

const coachOTPAuthSlice = createSlice({
  name: "coachOtpAuth",
  initialState,
  reducers: {
    setCoachOtpCredentials: (state, action) => {
      state.coachOtpInfo = action.payload;
      localStorage.setItem("coachOtpInfo", JSON.stringify(action.payload));
    },
    clearCoachOtpCredentials: (state, action) => {
      state.coachOtpInfo = null;
      localStorage.removeItem("coachOtpInfo");
    },
  },
});

export const { setCoachOtpCredentials, clearCoachOtpCredentials } =
  coachOTPAuthSlice.actions;

export default coachOTPAuthSlice.reducer;
