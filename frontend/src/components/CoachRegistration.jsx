import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Form, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterCoachMutation } from "../slices/coachApiSlice";
import axios from "axios";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { setCoachOtpCredentials } from "../slices/coachOTPAuthSlice";

const CoachRegistration = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { coachInfo } = useSelector((state) => state.coachAuth);

  const [registerCoach, { isLoading }] = useRegisterCoachMutation();

  useEffect(() => {
    if (coachInfo) {
      navigate("/coachHome");
    }
  }, [navigate, coachInfo]);

  const handleCertificatesUpload = (e) => {
    const selectedImages = e.target.files;
    setCertificates([...certificates, ...selectedImages]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      for (let i = 0; i < certificates.length; i++) {
        formData.append("images", certificates[i]);
      }
      const data = await axios.post(
        "https://crickcoach.onrender.com/api/coach/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(setCoachOtpCredentials({ ...data.data }));
      toast.success("OTP sent to email");
      navigate("/verifyCoach");
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  return (
    <Box>
      <Box
        sx={{ background: "#E5E5E5", height: "100vh" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingTop={"4.5rem"}
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
                  Coach Registration
                </Typography>
                <br />
                <Form onSubmit={submitHandler}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <FormControl sx={{ width: "100%" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      required
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </FormControl>

                  <FormControl sx={{ width: "100%" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-confirmPassword">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                      name="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </FormControl>

                  <div>
                    <Form.Group controlId="image" className="mb-3">
                      <Form.Label>
                        <strong>Upload Certificates</strong>
                      </Form.Label>
                      <Form.Control
                        onChange={handleCertificatesUpload}
                        type="file"
                        required
                        multiple
                      />
                    </Form.Group>
                  </div>

                  {isLoading && <Loader />}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, fontWeight: "bold", width: "100%" }}
                  >
                    Sign Up
                  </Button>

                  <Row className="py-3 text-secondary">
                    <Col>
                      Already have an account?{" "}
                      <Link
                        to="/coachLogin"
                        style={{
                          textDecoration: "none",
                          fontWeight: "bold",
                          color: "darkcyan",
                        }}
                      >
                        Sign In
                      </Link>
                    </Col>
                  </Row>
                </Form>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  background: "#198D8E",
                  padding: "1rem",
                  color: "white",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/939/939255.png"
                  alt="image"
                  className="img-fluid"
                  style={{ maxWidth: "100%" }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CoachRegistration;
