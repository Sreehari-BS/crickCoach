import React, { useState, useEffect } from "react";
import { Box, Paper, Grid, Typography, TextField, Button } from "@mui/material";
import { Form } from "react-bootstrap";
import {
  useOtpVerifyMutation,
  useResendOtpMutation,
} from "../slices/userApiSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserOtpCredentials } from "../slices/userOTPAuthSlice";

const UserOtpEntry = () => {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const [verify, { isLoading }] = useOtpVerifyMutation();
  const [resendOtp] = useResendOtpMutation();

  const { otpInfo } = useSelector((state) => state.otpAuth);
  const email = otpInfo.email;
  const otp = otpInfo.otp;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resendOtpHandler = async () => {
    try {
      const data = await resendOtp({ email }).unwrap();
      if (data) {
        dispatch(setUserOtpCredentials({ ...data }));
        toast.success("New OTP send to your email");
        setCountdown(60);
        setShowResend(false)
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await verify({ enteredOtp, email, otp }).unwrap();
      toast.success("Verification Successful");
      navigate("/logIn");
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResend(true);
    }
  }, [countdown]);

  return (
    <>
      <Box
        sx={{ background: "#E5E5E5", height: "100vh" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          elevation={8}
          sx={{
            background: "#26B4B6",
            width: "90%",
            p: "2rem",
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <br />
              <br />
              <br />
              <br />
              <Paper
                elevation={3}
                sx={{
                  background: "#F6FFFF",
                  padding: "1rem",
                  color: "#000",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  variant="h4"
                  fontFamily="monospace"
                  fontWeight={700}
                  color="black"
                >
                  Verify OTP
                </Typography>
                <br />
                <Form onSubmit={submitHandler}>
                  <TextField
                    type="tel"
                    variant="outlined"
                    required
                    fullWidth
                    id="otp"
                    label="Enter the OTP sent to mail"
                    name="otp"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h7">
                      Resend OTP in <b>{countdown}</b>sec
                    </Typography>
                    <Typography variant="h6" sx={{fontFamily: "monospace"}}>Didn't receive OTP ? </Typography>
                    {showResend && (
                      <span
                        onClick={resendOtpHandler}
                        style={{
                          color: "green",
                          fontWeight: 700,
                          fontFamily: "monospace",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                      >
                        {" "}
                        Resend OTP{" "}
                      </span>
                    )}
                  </Box>

                  {isLoading && <Loader />}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, fontWeight: "bold", width: "100%" }}
                  >
                    Verify
                  </Button>
                </Form>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1193/1193070.png"
                alt="image"
                className="img-fluid"
                style={{ maxWidth: "70%" }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default UserOtpEntry;
