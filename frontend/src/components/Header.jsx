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
  Rating,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  Modal,
  ModalClose,
  Sheet,
  Table,
} from "@mui/joy";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useListAppointmentByUserMutation,
  useCancelAppointmentMutation,
  useLogoutMutation,
  useAddReviewMutation,
  useUserWalletHistoryMutation,
} from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import { useLogoutCoachMutation } from "../slices/coachApiSlice";
import { clearImpCredentials } from "../slices/nonImpAuthSlice";
import { clearUserOtpCredentials } from "../slices/userOTPAuthSlice";
import Loader from "./Loader";
import { toast } from "react-toastify";
import Lottie from "react-lottie-player";
import WalletAnimation from "../animations/walletAnimation - 1699888880459.json";

const pages = ["LiveScores", "About", "Services", "Contact"];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  //Drawer
  const [open, setOpen] = React.useState(false);

  //modal
  const [openModal, setOpenModal] = React.useState(false);
  const [heading, setHeading] = useState("");

  //Review Modal
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [rating, SetRating] = useState(0);
  const [comment, setComment] = useState("");
  const isDisabled = rating === 0 || rating === null || comment.length === 0;
  const [appointment, setAppointment] = useState("");

  //Wallet Modal
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [wallet, setWallet] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [coachLogoutApiCall] = useLogoutCoachMutation();

  const [listAppointments, { isLoading }] = useListAppointmentByUserMutation();
  const [appointments, setAppointments] = useState("");

  const [cancelAppointment] = useCancelAppointmentMutation();

  const [addReview] = useAddReviewMutation();

  const [walletData] = useUserWalletHistoryMutation();

  const createWalletCreditData = (date, amount) => {
    return { date, amount };
  };

  const createWalletDebitData = (date, amount) => {
    return { date, amount };
  };

  const walletRows =
    wallet &&
    wallet?.credits?.map((item) =>
      createWalletCreditData(item.date, item.amount)
    );

  const walletDebitRows =
    wallet &&
    wallet?.debits?.map((item) =>
      createWalletDebitData(item.date, item.amount)
    );

  const getWalletData = async () => {
    try {
      const { data } = await walletData();
      if (data) {
        setWallet(data);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const appointmentList = async () => {
    try {
      const { data } = await listAppointments();
      if (data) {
        setAppointments(data);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const upcomingAppointments = async () => {
    try {
      const { data } = await listAppointments();
      if (data) {
        const pendingAppointments = data.filter(
          (item) => item.status === "Pending"
        );
        setAppointments(pendingAppointments);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const completedAppointments = async () => {
    try {
      const { data } = await listAppointments();
      if (data) {
        const completedAppointments = data.filter(
          (item) => item.status === "Completed"
        );
        setAppointments(completedAppointments);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const cancelledAppointments = async () => {
    try {
      const { data } = await listAppointments();
      if (data) {
        const cancelledAppointments = data.filter(
          (item) => item.status === "Cancelled"
        );
        setAppointments(cancelledAppointments);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const { data } = await cancelAppointment(appointmentId);
      if (data) {
        toast.success("Appointment cancelled & Amount added to wallet");

        setAppointments((appointments) =>
          appointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      } else {
        toast.error("Can't cancel appointment");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const handleRating = (event, newValue) => {
    SetRating(newValue);
  };
  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleAddReview = async (rating, comment, appointmentId) => {
    try {
      const { data } = await addReview({ rating, comment, appointmentId });
      if (data) {
        toast.success("Rating added succesfully");
        setOpenReviewModal(false);
        SetRating(0);
        setComment("");
        setAppointment("");
        setOpenModal(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const createTableData = (
    serviceName,
    coach,
    duration,
    amount,
    date,
    time,
    status,
    id,
    is_reviewed
  ) => ({
    serviceName,
    coach,
    duration,
    amount,
    date,
    time,
    status,
    id,
    is_reviewed,
  });

  const rows =
    appointments &&
    appointments
      .map((app) =>
        createTableData(
          app.serviceName,
          app.service.coach.name,
          app.duration,
          app.amount,
          app.date,
          app.time,
          app.status,
          app._id,
          app.is_reviewed
        )
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));

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

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      handleCloseUserMenu();
      dispatch(clearImpCredentials());
      dispatch(clearUserOtpCredentials());
      dispatch(logout());
      navigate("/explore");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#198D8E" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SportsCricketRoundedIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />

            <Link
              to={userInfo ? "/home" : "/"}
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

            {!userInfo && (
              <Box sx={{ flexGrow: 0 }}>
                <Link to="/explore">
                  <Button
                    sx={{
                      background: "#4AF1DA",
                      color: "black",
                      fontWeight: "bold",
                    }}
                    color="warning"
                    variant="contained"
                    startIcon={<ExploreRoundedIcon />}
                  >
                    Explore
                  </Button>
                </Link>
              </Box>
            )}

            {userInfo && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Click for More">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar src={userInfo?.profileImage} alt={userInfo?.name} />
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
                    to="/profile"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <MenuItem onClick={handleCloseUserMenu} key="profile">
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                  </Link>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      setOpen(true);
                    }}
                    key="appointments"
                  >
                    <Typography textAlign="center">Appointments</Typography>
                  </MenuItem>
                  <MenuItem
                    key="wallet"
                    onClick={() => {
                      handleCloseUserMenu();
                      setOpenWalletModal(true);
                      getWalletData();
                    }}
                  >
                    <Typography textAlign="center">Wallet</Typography>
                  </MenuItem>
                  <MenuItem onClick={logoutHandler} key="logout">
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer */}
      <Drawer
        open={open}
        anchor="right"
        size="sm"
        color="success"
        variant="soft"
        invertedColors
        onClose={() => setOpen(false)}
      >
        <Box
          role="presentation"
          onClick={() => setOpen(false)}
          onKeyDown={() => setOpen(false)}
        >
          <br />
          <List>
            <ListItem key="all">
              <ListItemButton
                onClick={() => {
                  setOpenModal(true);
                  setHeading("All Appointments");
                  appointmentList();
                }}
              >
                <b>All Appointments</b>
              </ListItemButton>
            </ListItem>
            <br />
            <ListItem key="upcoming">
              <ListItemButton
                onClick={() => {
                  setOpenModal(true);
                  setHeading("Upcoming Appointments");
                  upcomingAppointments();
                }}
              >
                <b>Upcoming Appointments</b>
              </ListItemButton>
            </ListItem>
            <br />
            <ListItem key="completed">
              <ListItemButton
                onClick={() => {
                  setOpenModal(true);
                  setHeading("Completed Appointments");
                  completedAppointments();
                }}
              >
                <b>Completed Appointments</b>
              </ListItemButton>
            </ListItem>
            <br />
            <ListItem key="cancelled">
              <ListItemButton
                onClick={() => {
                  setOpenModal(true);
                  setHeading("Cancelled Appointments");
                  cancelledAppointments();
                }}
              >
                <b>Cancelled Appointments</b>
              </ListItemButton>
            </ListItem>
            <br />
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Modal */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: "80%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            id="modal-title"
            variant="h4"
            fontWeight="lg"
            mb={1}
            sx={{ fontFamily: "monospace" }}
          >
            <b>{heading}</b>
          </Typography>
          <hr />
          <Sheet sx={{ maxHeight: 400, overflow: "auto" }}>
            {isLoading && <Loader />}
            <Table hoverRow size="lg" stickyHeader borderAxis="both">
              <thead>
                <tr>
                  <th style={{ width: "7%" }}>Si.No:</th>
                  <th style={{ width: "16%" }}>Service Name</th>
                  <th>Coach</th>
                  <th>Duration (min)</th>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  {rows &&
                    rows.some(
                      (row) =>
                        row.status === "Pending" || row.status === "Completed"
                    ) && <th>Action</th>}
                </tr>
              </thead>
              {rows && rows.length > 0 ? (
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.serviceName}</td>
                      <td>{row.coach}</td>
                      <td>{row.duration} min</td>
                      <td>₹ {row.amount}</td>
                      <td>{row.date}</td>
                      <td>{row.time}</td>
                      <td style={{ fontWeight: 700 }}>{row.status}</td>
                      {row.status === "Pending" ? (
                        <td>
                          <Button
                            onClick={() => handleCancelAppointment(row.id)}
                            variant="contained"
                            color="error"
                          >
                            Cancel
                          </Button>
                        </td>
                      ) : row.status === "Completed" &&
                        row.is_reviewed === false ? (
                        <td>
                          <Button
                            onClick={() => {
                              setOpenReviewModal(true);
                              setAppointment(row.id);
                            }}
                            variant="contained"
                            sx={{ backgroundColor: "darkcyan" }}
                          >
                            + Review
                          </Button>
                        </td>
                      ) : row.status === "Completed" &&
                        row.is_reviewed === true ? (
                        <td>
                          <Button
                            disabled
                            variant="contained"
                            sx={{ backgroundColor: "darkcyan" }}
                          >
                            Reviewed
                          </Button>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))}
                </tbody>
              ) : (
                <Box>
                  <br />
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "monospace",
                      color: "red",
                      whiteSpace: "nowrap",
                    }}
                  >
                    No Appointments Available
                  </Typography>
                </Box>
              )}
            </Table>
          </Sheet>
        </Sheet>
      </Modal>

      {/* Review Modal */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openReviewModal}
        onClose={() => {
          setOpenReviewModal(false);
          SetRating(0);
          setComment("");
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Box
            sx={{
              width: "400px",
              height: "280px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4">
              Rating: <b>{rating}</b>
            </Typography>
            <Rating
              sx={{ mb: 1 }}
              onChange={handleRating}
              defaultValue={rating}
              precision={0.5}
            />
            <Typography sx={{ mb: 2 }}>Tell us how it is </Typography>
            <TextField
              sx={{ mb: 1 }}
              onChange={handleComment}
              multiline
              maxRows={4}
              label="Say Something"
              placeholder="Type Something"
              value={comment}
            />
            <Button
              disabled={isDisabled}
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => handleAddReview(rating, comment, appointment)}
            >
              Submit
            </Button>
          </Box>
        </Sheet>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "darkcyan", fontFamily: "monospace" }}
            mb={1}
          >
            {userInfo && userInfo.name}'s Wallet
          </Typography>
          <Lottie
            animationData={WalletAnimation}
            play
            style={{ maxWidth: 190, maxHeight: 190, margin: "auto" }}
          />
          <Typography
            className="text-center"
            variant="h6"
            sx={{ fontFamily: "monospace" }}
          >
            Wallet Balance:
            <b style={{ color: "green" }}> ₹{wallet && wallet.balance}</b>
          </Typography>
          <br />
          <Typography
            color={"green"}
            variant="h5"
            sx={{ fontWeight: 600, fontFamily: "monospace" }}
          >
            Credits:
          </Typography>
          <hr />
          <Sheet sx={{ maxHeight: 100, overflow: "auto" }}>
            <Table
              sx={{ maxWidth: 500 }}
              borderAxis="yBetween"
              stickyHeader
              size="lg"
            >
              <thead>
                <tr>
                  <th>Si.No:</th>
                  <th>date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {walletRows &&
                  walletRows.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {new Date(row.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ color: "green", fontWeight: 700 }}>
                        ₹{row.amount}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Sheet>
          <Typography
            color={"red"}
            variant="h5"
            sx={{ fontWeight: 600, fontFamily: "monospace" }}
          >
            Debits:
          </Typography>
          <hr />
          <Sheet sx={{ maxHeight: 100, overflow: "auto" }}>
            <Table
              sx={{ maxWidth: 500 }}
              borderAxis="yBetween"
              stickyHeader
              size="lg"
            >
              <thead>
                <tr>
                  <th>Si.No:</th>
                  <th>date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {walletDebitRows &&
                  walletDebitRows.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {new Date(row.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ color: "red", fontWeight: 700 }}>
                        ₹{row.amount}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Sheet>
        </Sheet>
      </Modal>
    </>
  );
};

export default Header;
