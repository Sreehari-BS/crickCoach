import React from "react";
import {
  Box,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { Typography } from "@mui/joy";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { coachLogout } from "../slices/coachAuthSlice";
import { useLogoutCoachMutation } from "../slices/coachApiSlice";
import { clearCoachOtpCredentials } from "../slices/coachOTPAuthSlice";

const CoachHomeSidebar = () => {
  const { coachInfo } = useSelector((state) => state.coachAuth);

  const [coachLogoutApiCall] = useLogoutCoachMutation();

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const coachLogoutHandler = async () => {
    try {
      await coachLogoutApiCall().unwrap();
      dispatch(clearCoachOtpCredentials());
      dispatch(coachLogout());
      navigate("/explore");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper
      elevation={10}
      style={{
        width: "24%",
        backgroundColor: "#F49884",
        borderRadius: "20px",
      }}
    >
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Link to="/coachProfile">
          <Avatar
            src={
              coachInfo.profileImage
                ? coachInfo.profileImage
                : "https://cdn-icons-png.flaticon.com/512/939/939255.png"
            }
            alt="Coach Profile Image"
            style={{ width: "150px", height: "150px" }}
          />
        </Link>
        <Typography
          sx={{
            paddingTop: 2,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".1rem",
          }}
          level="h5"
          color="white"
        >
          {coachInfo.name}
        </Typography>
        <Typography level="subtitle2" color="white">
          {coachInfo.email}
        </Typography>
        <Typography level="subtitle2" color="white">
          {coachInfo.phoneNumber}
        </Typography>
        <Button onClick={coachLogoutHandler} variant="contained" color="error">
          Logout
        </Button>
        <Divider
          sx={{
            width: "100%",
            height: "2px",
            marginTop: "10px",
            marginBottom: "10px",
            backgroundColor: "white",
          }}
        />
        <List>
          <Link to="/coachHome" style={{ textDecoration: "none" }}>
            <ListItem button className={"text-center"}>
              <ListItemText
                primary={
                  <Typography
                    level="body1"
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    Services
                  </Typography>
                }
              />
            </ListItem>
          </Link>
          <Link to="/coachBookings" style={{ textDecoration: "none" }}>
            <ListItem button className={"text-center"}>
              <ListItemText
                primary={
                  <Typography
                    level="body1"
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    Bookings
                  </Typography>
                }
              />
            </ListItem>
          </Link>
          <Link to="/coachTimeSlots" style={{ textDecoration: "none" }}>
            <ListItem button className={"text-center"}>
              <ListItemText
                primary={
                  <Typography
                    level="body1"
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    Time Slot
                  </Typography>
                }
              />
            </ListItem>
          </Link>
          <Link to="/coachReviews" style={{ textDecoration: "none" }}>
            <ListItem button className={"text-center"}>
              <ListItemText
                primary={
                  <Typography
                    level="body1"
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    User Reviews
                  </Typography>
                }
              />
            </ListItem>
          </Link>
          <Link to="/coachVideos" style={{ textDecoration: "none" }}>
            <ListItem button className={"text-center"}>
              <ListItemText
                primary={
                  <Typography
                    level="body1"
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    My Videos
                  </Typography>
                }
              />
            </ListItem>
          </Link>
          <Link to="/coachWallet" style={{ textDecoration: "none" }}>
            <ListItem button className={"text-center"}>
              <ListItemText
                primary={
                  <Typography
                    level="body1"
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    Wallet
                  </Typography>
                }
              />
            </ListItem>
          </Link>
          <Link to="/coachConnect" style={{ textDecoration: "none" }}>
            <ListItem button className={"text-center"}>
              <ListItemText
                primary={
                  <Typography
                    level="body1"
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    Communicate
                  </Typography>
                }
              />
            </ListItem>
          </Link>
        </List>
      </Box>
    </Paper>
  );
};

export default CoachHomeSidebar;
