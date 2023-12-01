import React from 'react'
import { Paper, Box, Grid, Button } from "@mui/material";
import {Link} from "react-router-dom"

const Explore = () => {
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
            textAlign: "center",
            p: "2rem",
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  background: "#198D8E",
                  padding: "1rem",
                  color: "white",
                  borderRadius: "10px",
                }}
              >
                <img
                  width={170}
                  src="https://cdn-icons-png.flaticon.com/512/1193/1193070.png"
                  alt="Customer Avatar"
                />
                <p color={""}>
                  <strong>Are you looking for a Coach ?</strong>
                </p>
                <Link to="/signUp">
                <Button variant="contained">Sign Up as a Customer</Button>
                </Link>
                <br />
                <br />
                <p>
                  Already Registered ?{" "}
                  <Link to="/logIn">
                  <Button
                    sx={{ bgcolor: "green" }}
                    variant="contained"
                    color="success"
                  >
                    Sign In
                  </Button>{" "}
                  </Link>
                </p>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                    background: "#fff",
                    padding: "1rem",
                    borderRadius: "10px",
                  }}
              >
                <img
                  width={170}
                  src="https://cdn-icons-png.flaticon.com/512/939/939255.png"
                  alt="Coach Avatar"
                />
                <p color={""}>
                  <strong>Are you a Coach ?</strong>
                </p>
                <Link to="/coachSignUp">
                <Button variant="contained">Sign Up as a Coach</Button>
                </Link>
                <br />
                <br />
                <p>
                  Already Registered ?{" "}
                  <Link to="/coachLogin">
                  <Button
                    sx={{ bgcolor: "green" }}
                    variant="contained"
                    color="success"
                  >
                    Sign In
                  </Button>{" "}
                  </Link>
                </p>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  )
}

export default Explore