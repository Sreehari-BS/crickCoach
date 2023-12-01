import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Button,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import SportsOutlinedIcon from "@mui/icons-material/SportsOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { styled, useTheme } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { adminLogout } from "../slices/adminAuthSlice";
import { useLogoutAdminMutation } from "../slices/adminApiSlice";
import { useGetUserListMutation } from "../slices/adminApiSlice";
import { useBlockUserMutation } from "../slices/adminApiSlice";
import { useUnblockUserMutation } from "../slices/adminApiSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: "#E887E4",
      color: "white",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": { ...closedMixin(theme), backgroundColor: "#E887E4" },
  }),
}));

//Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AdminUserList = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  //Pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const [userList, setUserList] = useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutAdmin] = useLogoutAdminMutation();

  const [listUser, { isLoading }] = useGetUserListMutation();

  const [blockUser] = useBlockUserMutation();

  const [unblockUser] = useUnblockUserMutation();

  const logoutHandler = async () => {
    try {
      await logoutAdmin().unwrap();
      dispatch(adminLogout());
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  const listUserData = async () => {
    const { data } = await listUser();
    if (data) {
      setUserList(data);
    }
  };

  const handleBlockUser = async (id) => {
    try {
      const { data } = await blockUser(id);
      if (data) {
        toast.success("User Blocked");
        listUserData();
      } else {
        toast.error("Can't Block User");
      }
    } catch (error) {
      toast.error("Error: ", error);
    }
  };

  const handleUnblockUser = async (id) => {
    try {
      const { data } = await unblockUser(id);
      if (data) {
        toast.success("User unblocked");
        listUserData();
      } else {
        toast.error("Can't Unblock User");
      }
    } catch (error) {
      toast.error("Error: ", error);
    }
  };

  useEffect(() => {
    listUserData();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: "#C740BF" }} open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
          <SportsCricketRoundedIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
            }}
          >
            crickCoach
          </Typography>
          <Box sx={{ marginLeft: "auto", marginRight: "2rem" }}>
            <Button color="error" variant="contained" onClick={logoutHandler}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <Link
              to="/adminHome"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <DashboardOutlinedIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Link>

            <Link
              to="/adminHome/customers"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <AccountBoxOutlinedIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText primary="Users" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Link>

            <Link
              to="/adminHome/coaches"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <SportsOutlinedIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary="Coaches"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        <Box
          sx={{ background: "#FFEBFE", height: "91vh" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Paper
            elevation={8}
            sx={{
              background: "#AD59AA",
              width: "90%",
              p: "2rem",
              borderRadius: "10px",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                background: "#F6FFFF",
                padding: "1rem",
                color: "#000",
                borderRadius: "10px",
              }}
            >
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Si.No:</StyledTableCell>
                      <StyledTableCell align="left">Name</StyledTableCell>
                      <StyledTableCell align="left">E-Mail</StyledTableCell>
                      <StyledTableCell align="left">
                        Phone Number
                      </StyledTableCell>
                      <StyledTableCell align="left">is_blocked</StyledTableCell>
                      <StyledTableCell align="left">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userList &&
                      userList
                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                        .map((user, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                              {(page - 1) * rowsPerPage + index + 1}
                            </StyledTableCell>
                            <StyledTableCell>{user.name}</StyledTableCell>
                            <StyledTableCell>{user.email}</StyledTableCell>
                            <StyledTableCell style={{color: user.phoneNumber ? "inherit" : "red"}}>
                              {user.phoneNumber ? user.phoneNumber : "nill"}
                            </StyledTableCell>
                            <StyledTableCell>
                              {`${user.is_blocked}`}
                            </StyledTableCell>
                            <StyledTableCell>
                              {user.is_blocked ? (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={() => handleUnblockUser(user._id)}
                                >
                                  Unblock
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleBlockUser(user._id)}
                                >
                                  Block
                                </Button>
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              {isLoading && <Loader />}
              <Pagination
                count={Math.ceil(userList.length / rowsPerPage)}
                page={page}
                color="secondary"
                onChange={(event, value) => setPage(value)}
              />
            </Paper>  
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminUserList;
