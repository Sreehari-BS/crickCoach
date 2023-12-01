import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coachInfo: localStorage.getItem("coachInfo")
    ? JSON.parse(localStorage.getItem("coachInfo"))
    : null,
};

const coachAuthSlice = createSlice({
  name: "coachAuth",
  initialState,
  reducers: {
    setCoachCredentials: (state, action) => {
      state.coachInfo = action.payload;
      localStorage.setItem("coachInfo", JSON.stringify(action.payload));
    },
    coachLogout: (state, action) => {
      state.coachInfo = null;
      localStorage.removeItem("coachInfo");
    },
  },
});

export const { setCoachCredentials, coachLogout } = coachAuthSlice.actions;

export default coachAuthSlice.reducer;
