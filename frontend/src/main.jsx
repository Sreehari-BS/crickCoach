import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import GuestHomeScreen from "./screens/GuestHomeScreen.jsx";
import Explore from "./components/Explore.jsx";
import UserRegistration from "./components/UserRegistration.jsx";
import CoachRegistration from "./components/CoachRegistration.jsx";
import UserLogin from "./components/UserLogin.jsx";
import CoachLogin from "./components/CoachLogin.jsx";
import UserHome from "./components/UserHome.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CoachPrivateRoute from "./components/CoachPrivateRoute.jsx";
import AdminPrivateRoute from "./components/AdminPrivateRoute.jsx";
import UserProfile from "./components/UserProfile.jsx";
import CoachHome from "./components/CoachHome.jsx";
import CoachProfile from "./components/CoachProfile.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminHome from "./components/AdminHome.jsx";
import AdminUserList from "./components/AdminUserList.jsx";
import AdminCoachList from "./components/AdminCoachList.jsx";
import UserCoachListByService from "./components/UserCoachListByService.jsx";
import CoachBookings from "./components/CoachBookings.jsx";
import CoachTimeSlots from "./components/CoachTimeSlots.jsx";
import CoachReviews from "./components/CoachReviews.jsx";
import CoachVideos from "./components/CoachVideos.jsx";
import CoachWallet from "./components/CoachWallet.jsx";
import CoachConnect from "./components/CoachConnect.jsx";
import UserAppointmentSuccess from "./components/UserAppointmentSuccess.jsx";
import UserOtpEntry from "./components/UserOtpEntry.jsx";
import CoachOtpEntry from "./components/CoachOtpEntry.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<GuestHomeScreen />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/signUp" element={<UserRegistration />} />
      <Route path="/logIn" element={<UserLogin />} />
      <Route path="/coachLogin" element={<CoachLogin />} />
      <Route path="/coachSignUp" element={<CoachRegistration />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/verify" element={<UserOtpEntry />} />
      <Route path="/verifyCoach" element={<CoachOtpEntry />} />
      {/* User Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/home" element={<UserHome />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/service" element={<UserCoachListByService />} />
        <Route path="/Success" element={<UserAppointmentSuccess />} />
      </Route>
      {/* Coach Private Routes */}
      <Route path="" element={<CoachPrivateRoute />}>
        <Route path="/coachHome" element={<CoachHome />} />
        <Route path="/coachProfile" element={<CoachProfile />} />
        <Route path="/coachBookings" element={<CoachBookings />} />
        <Route path="/coachTimeSlots" element={<CoachTimeSlots />} />
        <Route path="/coachReviews" element={<CoachReviews />} />
        <Route path="/coachVideos" element={<CoachVideos />} />
        <Route path="/coachWallet" element={<CoachWallet />} />
        <Route path="/coachConnect" element={<CoachConnect />} />
      </Route>
      {/* Admin Private Route */}
      <Route path="" element={<AdminPrivateRoute />}>
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/adminHome/customers" element={<AdminUserList />} />
        <Route path="/adminHome/coaches" element={<AdminCoachList />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
