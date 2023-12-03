import React, { useState, useEffect } from "react";
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
import { Form } from "react-bootstrap";
import CoachHeader from "./CoachHeader"
import { useDispatch, useSelector } from "react-redux";
import { useUpdateCoachMutation } from "../slices/coachApiSlice";
import { setCoachCredentials } from "../slices/coachAuthSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";
import axios from "axios";

const CoachProfile = () => {
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const dispatch = useDispatch();

  const { coachInfo } = useSelector((state) => state.coachAuth);

  const [updateCoach, { isLoading }] = useUpdateCoachMutation();

  useEffect(() => {
    setName(coachInfo.name);
    setEmail(coachInfo.email);
    setPhoneNumber(coachInfo.phoneNumber);
    setProfileImage(coachInfo.profileImage);
    setAge(coachInfo.age);
    setExperience(coachInfo.experience);
  }, [
    coachInfo.name,
    coachInfo.email,
    coachInfo.phoneNumber,
    coachInfo.profileImage,
    coachInfo.age,
    coachInfo.experience,
  ]);

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setProfileImage(selectedImage);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const formData = new FormData();
        formData.append("image", profileImage);
        await axios.put("https://crick-coach-azure-app.azurewebsites.net/api/coach/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const res = await updateCoach({
          _id: coachInfo._id,
          name,
          email,
          phoneNumber,
          age,
          experience,
          password,
          confirmPassword,
        }).unwrap();
        dispatch(setCoachCredentials({ ...res }));
        toast.success("Profile Updated");
      } catch (error) {
        toast.error(error?.data?.message || error.error || error.message);
      }
    }
  };

  return (
    <Box>
      <CoachHeader />
      <Box
        sx={{ height: "100%", background: "#E5E5E5" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          elevation={8}
          sx={{
            background: "#DC6950",
            width: "90%",
            p: "2rem",
            borderRadius: "10px",
            marginTop: "6rem",
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
                  Update Profile
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
                    disabled
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

                  <TextField
                    variant="outlined"
                    type="number"
                    required
                    fullWidth
                    id="age"
                    label="Age"
                    name="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    variant="outlined"
                    type="number"
                    required
                    fullWidth
                    autoComplete="true"
                    id="experience"
                    label="Experience in Years"
                    name="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </FormControl>

                  <div>
                    <Form.Group controlId="image" className="mb-3">
                      {coachInfo.profileImage ? (
                        <Form.Label>
                          <strong>Change Profile Image</strong>
                        </Form.Label>
                      ) : (
                        <Form.Label>
                          <strong>Upload Profile Image</strong>
                        </Form.Label>
                      )}
                      <Form.Control onChange={handleImageUpload} type="file" />
                    </Form.Group>
                  </div>

                  {isLoading && <Loader />}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, fontWeight: "bold", width: "100%" }}
                  >
                    Update
                  </Button>
                </Form>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} sx={{ position: "relative" }}>
              {coachInfo.profileImage ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <img
                    src={coachInfo.profileImage}
                    alt="coach_image"
                    className="img-fluid"
                    style={{ maxWidth: "100%", borderRadius: "10px" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    fontFamily={"monospace"}
                    color={"white"}
                    variant="h4"
                  >
                    <strong>No Profile image</strong>
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CoachProfile;
