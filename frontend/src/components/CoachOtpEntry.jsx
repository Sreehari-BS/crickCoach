import React, { useState } from "react";
import { Box, Paper, Grid, Typography, TextField, Button } from "@mui/material";
import { Form } from "react-bootstrap";
import { useCoachOtpVerifyMutation } from "../slices/coachApiSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const UserOtpEntry = () => {
  const [verify, { isLoading }] = useCoachOtpVerifyMutation();

  const { coachOtpInfo } = useSelector((state) => state.coachOtpAuth);
  const email = coachOtpInfo.email;
  const otp = coachOtpInfo.otp;

  const [enteredOtp, setEnteredOtp] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await verify({ enteredOtp, email, otp }).unwrap();
      toast.success("Verification Successful");
      navigate("/coachLogin");
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };
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
                src="https://cdn-icons-png.flaticon.com/512/939/939255.png"
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
