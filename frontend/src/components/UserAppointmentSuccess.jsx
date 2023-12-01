import React from "react";
import {
  AspectRatio,
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Typography,
} from "@mui/joy";
import { Paper } from "@mui/material";
import { Container } from "react-bootstrap";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import { useSelector } from "react-redux";
import Lottie from "react-lottie-player";
import AppointmentAnimation from "../animations/appointmentAnimation - 1699094089746.json";
import { Link } from "react-router-dom";

const UserAppointmentSuccess = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "91vh",
      }}
    >
      <Paper
        elevation={10}
        style={{ width: "100%", height: "600px", marginTop: 100 }}
      >
        <Card
          data-resizable
          sx={{
            textAlign: "center",
            alignItems: "center",
            width: "100%",
            height: "600px",
            // to make the demo resizable
            overflow: "auto",
            resize: "horizontal",
            "--icon-size": "100px",
          }}
        >
          <CardOverflow variant="solid" sx={{ backgroundColor: "#198D8E" }}>
            <AspectRatio
              variant="outlined"
              ratio="1"
              sx={{
                m: "auto",
                transform: "translateY(50%)",
                borderRadius: "50%",
                width: "var(--icon-size)",
                boxShadow: "sm",
                bgcolor: "background.surface",
                position: "relative",
                color: "#198D8E",
              }}
            >
              <div>
                <BakeryDiningIcon sx={{ fontSize: "4rem", color: "#198D8E" }} />
              </div>
            </AspectRatio>
          </CardOverflow>
          <Typography
            level="h2"
            sx={{
              mt: "calc(var(--icon-size) / 2)",
              fontFamily: "monospace",
              color: "green",
            }}
          >
            🎊 Congrats {userInfo.name} 🎊
          </Typography>
          <CardContent sx={{ maxWidth: "40ch" }}>
            Your Appointment booking has beeen{" "}
            <Typography
              level="h3"
              sx={{ fontFamily: "monospace", color: "green" }}
            >
              <b>successful</b>
            </Typography>
            .
            <hr />
            <Lottie
              animationData={AppointmentAnimation}
              play
              style={{ maxWidth: 180, maxHeight: 190, marginLeft: 60 }}
            />
          </CardContent>
          <CardActions
            orientation="vertical"
            buttonFlex={1}
            sx={{
              "--Button-radius": "40px",
              width: "clamp(min(100%, 160px), 50%, min(100%, 200px))",
            }}
          >
            <Link to="/home">
            <Button variant="solid" sx={{ backgroundColor: "#198D8E" }}>
              Go to Home
            </Button>
            </Link>
          </CardActions>
        </Card>
      </Paper>
    </Container>
  );
};

export default UserAppointmentSuccess;
