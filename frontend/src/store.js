import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import coachAuthReducer from "./slices/coachAuthSlice"
import adminAuthReducer from "./slices/adminAuthSlice"
import nonImpAuthReducer from "./slices/nonImpAuthSlice"
import userOTPAuthSlice from "./slices/userOTPAuthSlice";
import coachOTPAuthSlice from "./slices/coachOTPAuthSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    coachAuth: coachAuthReducer,
    adminAuth: adminAuthReducer,
    impAuth: nonImpAuthReducer,
    otpAuth: userOTPAuthSlice,
    coachOtpAuth: coachOTPAuthSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // devTools: process.env.NODE_ENV !== "production",
});

export default store;
