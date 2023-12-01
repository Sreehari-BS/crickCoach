import React, { useEffect, useState } from "react";
import { Box, Paper, Select, MenuItem, Grid, Pagination } from "@mui/material";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Card,
  Table,
  Sheet,
  CardContent,
} from "@mui/joy";
import { toast } from "react-toastify";
import Loader from "./Loader";
import CoachHeader from "./CoachHeader"
import CoachHomeSidebar from "./CoachHomeSidebar";
import { useListBookingsMutation } from "../slices/coachApiSlice";
import { useChangeStatusMutation } from "../slices/coachApiSlice";

const CoachHome = () => {
  const [bookingList, { isLoading }] = useListBookingsMutation();
  const [bookings, setBookings] = useState("");

  const [changeStatus] = useChangeStatusMutation();
  const [status, setStatus] = useState("");

  const listBookings = async (req, res) => {
    const { data } = await bookingList();
    if (data) {
      setBookings(data);
    }
  };

  const statusChange = async (bookingId, status) => {
    try {
      const { data } = await changeStatus({bookingId, status});
      if (data) {
        toast.success("Status Changed");
        listBookings()
      } else {
        toast.error("Can't change Status");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      case "Scheduled":
        return "blue";
      default:
        return "white";
    }
  };

  const createTableData = (
    serviceName,
    customer,
    duration,
    amount,
    date,
    time,
    status,
    id
  ) => ({
    serviceName,
    customer,
    duration,
    amount,
    date,
    time,
    status,
    id,
  });

  const rows =
    bookings &&
    bookings
      .map((book) =>
        createTableData(
          book.serviceName,
          book.user.name,
          book.duration,
          book.amount,
          book.date,
          book.time,
          book.status,
          book._id
        )
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    listBookings();
  }, []);

  return (
    <>
    <CoachHeader />
    <Box marginTop={8} sx={{ backgroundColor: "#FFF1EE", height: "91vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        maxWidth="95%"
        mx="auto"
        paddingTop={"1.5rem"}
      >
        <CoachHomeSidebar />
        <Paper elevation={10} style={{ width: "75%", borderRadius: "20px" }}>
          <Box p={2}>
            <br />
            <br />
            <br />
            <Typography
              level="h2"
              align="center"
              fontFamily={"monospace"}
              gutterBottom
            >
              Bookings
            </Typography>
            <Paper
              elevation={10}
              sx={{ backgroundColor: "#F98971", borderRadius: "15px" }}
            >
              <Sheet
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                  backgroundColor: "#F98971",
                  borderRadius: "15px",
                }}
              >
                {isLoading && <Loader />}
                <Table
                  hoverRow
                  size="lg"
                  stickyHeader
                  borderAxis="bothBetween"
                  sx={{ color: "white", borderColor: "white" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: "7%",
                          color: "white",
                          borderColor: "white",
                        }}
                      >
                        Si.No:
                      </th>
                      <th
                        style={{
                          width: "16%",
                          color: "white",
                          borderColor: "white",
                        }}
                      >
                        Service Name
                      </th>
                      <th style={{ color: "white", borderColor: "white" }}>
                        Customer
                      </th>
                      <th style={{ color: "white", borderColor: "white" }}>
                        Duration (min)
                      </th>
                      <th style={{ color: "white", borderColor: "white" }}>
                        Amount (₹)
                      </th>
                      <th style={{ color: "white", borderColor: "white" }}>
                        Date
                      </th>
                      <th style={{ color: "white", borderColor: "white" }}>
                        Time
                      </th>
                      <th style={{ color: "white", borderColor: "white" }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  {rows && rows.length > 0 ? (
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td style={{ color: "white", borderColor: "white" }}>
                            {index + 1}
                          </td>
                          <td style={{ color: "white", borderColor: "white" }}>
                            {row.serviceName}
                          </td>
                          <td style={{ color: "white", borderColor: "white" }}>
                            {row.customer}
                          </td>
                          <td style={{ color: "white", borderColor: "white" }}>
                            {row.duration} min
                          </td>
                          <td style={{ color: "white", borderColor: "white" }}>
                            ₹ {row.amount}
                          </td>
                          <td style={{ color: "white", borderColor: "white" }}>
                            {row.date}
                          </td>
                          <td style={{ color: "white", borderColor: "white" }}>
                            {row.time}
                          </td>
                          <td
                            style={{
                              color: getStatusColor(row.status),
                              fontWeight: 700,
                              borderColor: "white",
                            }}
                          >
                            {row.status === "Pending" ||
                            row.status === "Scheduled" ? (
                              <select
                                value={row.status}
                                style={{
                                  fontWeight: 700,
                                  borderColor: "white",
                                }}
                                onChange={(e) => {
                                  statusChange(row.id, e.target.value);
                                }}
                              >
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Scheduled">Scheduled</option>
                              </select>
                            ) : (
                              row.status
                            )}
                          </td>
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
                          color: "white",
                          whiteSpace: "nowrap",
                        }}
                      >
                        No Appointments Available
                      </Typography>
                    </Box>
                  )}
                </Table>
              </Sheet>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
    </>
  );
};

export default CoachHome;
