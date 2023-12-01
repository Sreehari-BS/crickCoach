import React from "react";
import { Typography, Paper, Box, Button, Grid } from "@mui/material";
import { Container } from "react-bootstrap";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import {Link} from "react-router-dom"

const GuestHome = () => {
  return (
    <>
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ background: "#E5E5E5", height: "100vh" }}
      >
        <Paper
          elevation={8}
          sx={{
            background: "#26B4B6",
            width: "90%",
            height: "86vh",
            marginTop: "4.5rem",
            textAlign: "center",
            padding: "2rem",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
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
                <Typography
                  variant="h3"
                  sx={{
                    color: "white",
                    fontFamily: "monospace",
                    fontWeight: 800,
                    letterSpacing: ".3rem",
                    mt: 2,
                  }}
                >
                  crickCoach
                </Typography>
                <Container>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      mt: 2,
                      fontFamily: "sans-serif",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    First step to your cricketing career. Our team of
                    experienced coaches is committed to guiding you on your
                    journey to cricket greatness, offering personalized training
                    and expert insights.
                  </Typography>
                </Container>
                <Link to="/explore">
                <Button
                  sx={{
                    fontWeight: "bold",
                    width: "150px",
                    height: "50px",
                    mt: 2,
                    backgroundColor: "#4AF1DA",
                    color: "black",
                    marginTop: "2rem",
                  }}
                  color="secondary"
                  variant="contained"
                  startIcon={<ExploreRoundedIcon fontSize="large" />}
                >
                  Explore
                </Button>
                </Link>
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
                  width={220}
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/2023_CWC_Logo.svg/1200px-2023_CWC_Logo.svg.png"
                  alt="image"
                />
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  )
}

export default GuestHome