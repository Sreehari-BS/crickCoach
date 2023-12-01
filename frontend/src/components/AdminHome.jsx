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
  Backdrop,
  Modal,
  TablePagination,
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
import { Container } from "react-bootstrap";
import { styled, useTheme } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import { adminLogout } from "../slices/adminAuthSlice";
import { useLogoutAdminMutation } from "../slices/adminApiSlice";
import { useGetUnapprovedCoachListMutation } from "../slices/adminApiSlice";
import { useApproveCoachMutation } from "../slices/adminApiSlice";
import { useRejectCoachMutation } from "../slices/adminApiSlice";
import { useCoachAppointmentsMutation } from "../slices/adminApiSlice";
import { useAppointmentReportMutation } from "../slices/adminApiSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

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

//Modal
const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

const styleAppModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 50,
  borderRadius: "20px",
  p: 4,
};

const AdminHome = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  //Pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  //Report Table Pagination
  const [pageTable, setPageTable] = React.useState(0);
  const [rowsPerPageTable, setRowsPerPageTable] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPageTable(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageTable(+event.target.value);
    setPageTable(0);
  };

  //Modal
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedCoach, setSelctedCoach] = useState(null);
  const handleOpen = (coach) => {
    setSelctedCoach(coach);
    setOpenModal(true);
  };
  const handleClose = () => setOpenModal(false);

  //Report Modal
  const [openAppModal, setOpenAppModal] = React.useState(false);
  const handleOpenAppModal = () => setOpenAppModal(true);
  const handleCloseAppModal = () => {
    setOpenAppModal(false);
    setStartDate("");
    setEndDate("");
  };

  const [unapprovedCoachList, setUnapprovedCoachList] = useState("");
  const [appointments, setAppointments] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutAdmin] = useLogoutAdminMutation();

  const [listUnapprovedCoach, { isLoading }] =
    useGetUnapprovedCoachListMutation();

  const [approveCoach] = useApproveCoachMutation();

  const [rejectCoach] = useRejectCoachMutation();

  const [appointmentsData] = useCoachAppointmentsMutation();

  const [appointmentsReport] = useAppointmentReportMutation();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ChartJS.register(ArcElement, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Appointments by Coaches",
      },
    },
  };

  const labels = [];
  const completedCounts = [];
  const cancelledCounts = [];
  const totalRevenue = [];

  if (appointments) {
    appointments.forEach((appointment) => {
      labels.push(appointment.coachName);
      completedCounts.push(appointment.completedCount);
      cancelledCounts.push(
        appointment.appointmentCount - appointment.completedCount
      );
      totalRevenue.push(appointment.totalRevenue);
    });
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Completed",
        data: completedCounts,
        backgroundColor: "#89DC77",
      },
      {
        label: "Cancelled",
        data: cancelledCounts,
        backgroundColor: "#F75D3A",
      },
    ],
  };

  const optionsSecond = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Revenue by coaches",
      },
    },
  };

  const dataSecond = {
    labels,
    datasets: [
      {
        label: "Revenue earned",
        data: totalRevenue,
        backgroundColor: [
          "#79F0E2",
          "#F0BA79",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "#79F0E2",
          "#F0BA79",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  //Report Table
  const columns = [
    { id: "user", label: "User", align: "center", minWidth: 170 },
    { id: "coach", label: "Coach", align: "center", minWidth: 170 },
    {
      id: "serviceName",
      label: "ServiceName",
      minWidth: 170,
      align: "center",
    },
    {
      id: "duration",
      label: "Duration(min)",
      minWidth: 170,
      align: "center",
    },
    {
      id: "fee",
      label: "Fee (₹)",
      minWidth: 170,
      align: "center",
    },
    {
      id: "date",
      label: "Date",
      minWidth: 170,
      align: "center",
    },
    {
      id: "time",
      label: "Time",
      minWidth: 170,
      align: "center",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
      align: "center",
    },
  ];

  function createData(
    user,
    coach,
    serviceName,
    duration,
    fee,
    date,
    time,
    status
  ) {
    return { user, coach, serviceName, duration, fee, date, time, status };
  }

  const rows =
    Array.isArray(report) && report.length
      ? report.map((item) =>
          createData(
            item.user.name,
            item.service.coach.name,
            item.serviceName,
            item.duration,
            item.amount,
            item.date,
            item.time,
            item.status
          )
        )
      : [];

  const getAppointmentsReport = async (e) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      toast.error("Enter Proper Dates.");
      return;
    }
    try {
      const data = await appointmentsReport({
        startDate,
        endDate,
      }).unwrap();
      setReport(data);
      handleOpenAppModal();
    } catch (error) {
      toast.error("Error: ", error);
    }
  };

  const appointmentsList = async () => {
    try {
      const { data } = await appointmentsData();
      setAppointments(data);
    } catch (error) {
      toast.error("Error: ", error.message);
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutAdmin().unwrap();
      dispatch(adminLogout());
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  const listUnapprovedCoachData = async () => {
    const { data } = await listUnapprovedCoach();
    if (data) {
      setUnapprovedCoachList(data);
    }
  };

  const handleApproveCoach = async (id) => {
    try {
      const { data } = await approveCoach(id);
      if (data) {
        toast.success("successfully Approved");
        listUnapprovedCoachData();
      } else {
        toast.error("Can't Approve");
      }
    } catch (error) {
      toast.error("Error: ", error);
    }
  };

  const handleRejectCoach = async (id) => {
    try {
      const { data } = await rejectCoach(id);
      if (data) {
        toast.success("successfully Rejected");
        listUnapprovedCoachData();
      } else {
        toast.error("Can't Reject");
      }
    } catch (error) {
      toast.error("Error: ", error);
    }
  };

  useEffect(() => {
    listUnapprovedCoachData();
    appointmentsList();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#C740BF" }}
          open={open}
        >
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
                  <ListItemText
                    primary="Users"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
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
          <Box sx={{ background: "#FFEBFE", height: "100%" }}>
            <br />
            <Typography variant="h5" sx={{ marginLeft: "4.5rem" }}>
              <strong style={{ color: "#AD59AA " }}>Coach Requests</strong>
            </Typography>
            <Paper
              elevation={8}
              sx={{
                marginLeft: "4.5rem",
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
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell align="left">Actions</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {unapprovedCoachList &&
                        unapprovedCoachList
                          .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                          .map((coach, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell component="th" scope="row">
                                {(page - 1) * rowsPerPage + index + 1}
                              </StyledTableCell>
                              <StyledTableCell>{coach.name}</StyledTableCell>
                              <StyledTableCell>{coach.email}</StyledTableCell>
                              <StyledTableCell>
                                {coach.phoneNumber}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleOpen(coach)}
                                >
                                  View Details
                                </Button>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => handleApproveCoach(coach._id)}
                                >
                                  Approve
                                </Button>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleRejectCoach(coach._id)}
                                >
                                  Reject
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
                {isLoading && <Loader />}
                <Pagination
                  count={Math.ceil(unapprovedCoachList.length / rowsPerPage)}
                  page={page}
                  color="secondary"
                  onChange={(event, value) => setPage(value)}
                />
              </Paper>
            </Paper>
            <Container>
              <hr />
            </Container>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "93%",
                height: "500px",
                m: 7,
              }}
            >
              <Paper
                elevation={10}
                sx={{
                  width: "55%",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "20px",
                  padding: 2,
                }}
              >
                <Bar options={options} data={data} />
              </Paper>
              <Paper
                elevation={10}
                sx={{
                  width: "44%",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: 0.75,
                  borderRadius: "20px",
                }}
              >
                <Doughnut options={optionsSecond} data={dataSecond} />
              </Paper>
            </Box>
            <Container>
              <hr />
            </Container>
            <form onSubmit={getAppointmentsReport}>
              <Box
                sx={{
                  width: "93%",
                  height: "100px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  m: "auto",
                }}
              >
                <Box>
                  <Typography variant="h6" color={"#AF1991"}>
                    Select Starting Date
                  </Typography>
                  <input
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    name="startDate"
                    value={startDate}
                    required
                  />
                </Box>
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: "#AF1991" }}
                  >
                    View Appointments Report
                  </Button>
                </Box>
                <Box>
                  <Typography variant="h6" color={"#AF1991"}>
                    Select Ending Date
                  </Typography>
                  <input
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                    name="endDate"
                    value={endDate}
                    required
                  />
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>

      {/* Coach Certificates */}
      <div>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={openModal}>
            <Box sx={style}>
              <Typography id="spring-modal-title" variant="h6" component="h2">
                {selectedCoach ? selectedCoach.name : "nothing"}
              </Typography>
              {selectedCoach &&
                selectedCoach.certificates.map((certificate, index) => (
                  <img
                    style={{ borderRadius: "20px", marginTop: "1rem" }}
                    key={index}
                    width={440}
                    src={certificate}
                    alt={`Certificate ${index}`}
                  />
                ))}
            </Box>
          </Fade>
        </Modal>
      </div>

      {/* Appointment Report */}
      <Modal
        open={openAppModal}
        onClose={handleCloseAppModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleAppModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Appointments from <b style={{ color: "green" }}>{startDate}</b> to{" "}
            <b style={{ color: "red" }}>{endDate}</b>
          </Typography>
          {report && report.length < 1 ? (
            <Typography
              variant="h4"
              id="modal-modal-description"
              sx={{ mt: 2, color: "red", fontFamily: "monospace" }}
            >
              No appointments fount
            </Typography>
          ) : (
            <Paper
              elevation={10}
              sx={{ width: "100%", overflow: "hidden", borderRadius: "20px" }}
            >
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        pageTable * rowsPerPageTable,
                        pageTable * rowsPerPageTable + rowsPerPageTable
                      )
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPageTable}
                page={pageTable}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AdminHome;
