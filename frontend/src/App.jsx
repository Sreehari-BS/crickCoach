import React from "react";
import Header from "./components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  const location = useLocation();

  const isAdminHome =
    location.pathname === "/adminHome" ||
    location.pathname === "/adminHome/customers" ||
    location.pathname === "/adminHome/coaches" ||
    location.pathname === "/coachBookings" ||
    location.pathname === "/coachHome" ||
    location.pathname === "/coachTimeSlots" ||
    location.pathname === "/coachReviews" ||
    location.pathname === "/coachVideos" ||
    location.pathname === "/coachWallet" ||
    location.pathname === "/coachConnect" ||
    location.pathname === "/coachProfile";

  const initialOptions = {
    clientId:
      "Ab_Rs4VQ6lakRZw-jMRQgaSIQLTucwldocWig5y98-MzVfdH_Pz35gzFA-7V9UA6EIkznO1ezUHI-rIo",
    currency: "USD",
    intent: "capture",
  };

  return (
    <>
      <GoogleOAuthProvider clientId="1001407053328-0elan7hij42gdovn46gvef3e49e3p44o.apps.googleusercontent.com">
        <PayPalScriptProvider options={initialOptions}>
          {!isAdminHome && <Header />}
          <ToastContainer />
          <Outlet />
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
