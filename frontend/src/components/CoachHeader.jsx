import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Tooltip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutCoachMutation } from "../slices/coachApiSlice";
import { coachLogout } from "../slices/coachAuthSlice";
import { clearCoachOtpCredentials } from "../slices/coachOTPAuthSlice";

const pages = ["LiveScores", "About", "Services", "Contact"];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);


  const { coachInfo } = useSelector((state) => state.coachAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [coachLogoutApiCall] = useLogoutCoachMutation();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const coachLogoutHandler = async () => {
    try {
      await coachLogoutApiCall().unwrap();
      handleCloseUserMenu();
      dispatch(clearCoachOtpCredentials());
      dispatch(coachLogout());
      navigate("/explore");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#DC6950" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SportsCricketRoundedIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />

            <Link
              to={"/coachHome"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                }}
              >
                crickCoach
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <SportsCricketRoundedIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              crickCoach
            </Typography>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                marginLeft: "auto",
                marginRight: "100px",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {/* <Button onClick={coachLogoutHandler} >Logout</Button> */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Click for More">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={coachInfo.name} src={coachInfo.profileImage} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Link
                    to="/coachProfile"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <MenuItem onClick={handleCloseUserMenu} key="CoachProfile">
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={coachLogoutHandler} key="logoutCoach">
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
