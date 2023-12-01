import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpInfo:
    localStorage.getItem("otpInfo") &&
    localStorage.getItem("otpInfo") !== "undefined"
      ? JSON.parse(localStorage.getItem("otpInfo"))
      : null,
};

const userOTPAuthSlice = createSlice({
  name: "otpAuth",
  initialState,
  reducers: {
    setUserOtpCredentials: (state, action) => {
      state.otpInfo = action.payload;
      localStorage.setItem("otpInfo", JSON.stringify(action.payload));
    },
    clearUserOtpCredentials: (state, action) => {
      state.otpInfo = null;
      localStorage.removeItem("otpInfo");
    },
  },
});

export const { setUserOtpCredentials, clearUserOtpCredentials } =
  userOTPAuthSlice.actions;

export default userOTPAuthSlice.reducer;
