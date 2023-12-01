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
import { Form, Col, Row } from "react-bootstrap";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import {
  useLoginMutation,
  useGoogleAuthMutation,
} from "../slices/userApiSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Loader from "./Loader";

const UserLogin = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/home");
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const googleLogin = async (name, email, profileImage) => {
    try {
      const res = await googleAuth({
        name,
        email,
        profileImage,
      }).unwrap();
      if (res) {
        dispatch(setCredentials({ ...res }));
        navigate("/home");
      }
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
                  User LogIn
                </Typography>
                <br />
                <Form onSubmit={submitHandler}>
                  <TextField
                    type="email"
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
                  {isLoading && <Loader />}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, fontWeight: "bold", width: "100%" }}
                  >
                    Sign In
                  </Button>
                  <Row className="py-3 text-secondary">
                    <Col>
                      Didn't have an account?{" "}
                      <Link
                        to="/signUp"
                        style={{
                          textDecoration: "none",
                          fontWeight: "bold",
                          color: "darkcyan",
                        }}
                      >
                        Sign Up
                      </Link>
                    </Col>
                  </Row>
                </Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      const googleUserCredentials = jwtDecode(
                        credentialResponse.credential
                      );
                      const { name, email, picture } = googleUserCredentials;
                      
                      googleLogin(name, email, picture);
                    }}
                    onError={() => {
                      toast.error("Google login failed");
                    }}
                  />
                </Box>
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

export default UserLogin;
