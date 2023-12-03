import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardOverflow,
  CardActions,
  Select,
  Option,
} from "@mui/joy";
import { Pagination } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useListCoachByServiceMutation,
  useWalletBalanceMutation,
  useWalletPaymentMutation,
} from "../slices/userApiSlice";
import { setImpCredentials } from "../slices/nonImpAuthSlice";
import { Form, NavItem } from "react-bootstrap";
import { toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const UserCoachListByService = () => {
  const { impInfo } = useSelector((state) => state.impAuth);

  const { userInfo } = useSelector((state) => state.auth);
  // Pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  const [selectedDates, setSelectedDates] = useState(
    Array(impInfo && impInfo.length).fill("")
  );
  const [selectedSlots, setSelectedSlots] = useState(
    Array(impInfo && impInfo.length).fill("")
  );

  const [showBookButton, setShowBookButton] = useState([]);
  const [showPayPal, setShowPayPal] = useState([]);

  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [fees, setfees] = useState("");
  const [user, setUser] = useState("");
  const [service, setService] = useState("");
  const [coach, setCoach] = useState("");

  const [listCoachByService] = useListCoachByServiceMutation();

  const [walletBalance] = useWalletBalanceMutation();
  const [balance, setBalance] = useState(0);

  const [walletPayment] = useWalletPaymentMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const serverUrl = "https://crick-coach-azure-app.azurewebsites.net";

  const handleListCoachByService = async (serviceName) => {
    try {
      const { data } = await listCoachByService(serviceName);
      dispatch(setImpCredentials(data));
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const handleWalletBalance = async () => {
    const { data } = await walletBalance();
    if (data) {
      setBalance(data);
    }
  };

  const createOrder = (
    data,
    serviceFee,
    serviceName,
    serviceDuration,
    userId,
    serviceId,
    date,
    time,
    coachId
  ) => {
    return axios
      .post(`${serverUrl}/api/user/orders`, {
        cart: [
          {
            sku: serviceName,
            cost: serviceFee,
            duration: serviceDuration,
            user: userId,
            service: serviceId,
            appointmentDate: date,
            appointmentTime: time,
            coach: coachId,
          },
        ],
      })
      .then((response) => response.data.id)
      .catch((error) => console.error(error));
  };

  const onApprove = (data, cart, index) => {
    return axios
      .post(`${serverUrl}/api/user/orders/${data.orderID}/capture`, {
        orderID: data.orderID,
        cart: cart,
      })
      .then((response) => {
        handleListCoachByService(serviceName);

        navigate("/success");

        return response.data;
      })
      .catch((error) => console.error(error));
  };

  const handleBookAppointment = (index) => {
    if (!selectedDates[index] || !selectedSlots[index]) {
      toast.error("Please select a date and time.");
      return;
    }

    const newShowBookButton = Array(impInfo.length).fill(false);
    newShowBookButton[index] = true;
    setShowBookButton(newShowBookButton);

    const newShowPayPal = Array(impInfo.length).fill(false);
    newShowPayPal[index] = true;
    setShowPayPal(newShowPayPal);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setShowPayPal(true);
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const handleWalletPayment = async (
    serviceId,
    serviceName,
    duration,
    amount,
    date,
    time,
    coachId,
  ) => {
    try {
      if (balance < fees) {
        return toast.error("Not enough wallet balance");
      }
      const { data } = await walletPayment({
        serviceId,
        serviceName,
        duration,
        amount,
        date,
        time,
        coachId,
      });
      if (data) {
        navigate("/success");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  return (
    <Box
      marginTop={9}
      p={3}
      sx={{
        backgroundColor: "#E3FCFC",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography fontFamily={"monospace"} level="h2">
        {impInfo && impInfo[0]?.serviceName} Services
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {impInfo &&
          impInfo
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((item, index) => (
              <Card
                sx={{
                  width: 340,
                  maxWidth: "100%",
                  boxShadow: "lg",
                  marginTop: 2,
                  margin: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
                size="lg"
                key={index}
              >
                <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
                  <Avatar
                    src={
                      item.coach.profileImage
                        ? item.coach.profileImage
                        : "https://cdn-icons-png.flaticon.com/512/939/939255.png"
                    }
                    sx={{ "--Avatar-size": "4rem" }}
                  />
                  <Typography fontFamily={"monospace"} level="title-lg">
                    {item.coach.name}
                  </Typography>
                  <Typography level="body-sm" sx={{ maxWidth: "24ch" }}>
                    {item.description}
                  </Typography>
                  <Box
                    sx={{
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Typography fontFamily={"monospace"}>
                      Age: <strong>{item.coach.age}</strong>
                    </Typography>
                    <Typography fontFamily={"monospace"}>
                      Experience: <strong>{item.coach.experience} year</strong>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      "& > button": { borderRadius: "2rem" },
                    }}
                  >
                    <Typography fontFamily={"monospace"}>
                      Duration: <strong>{item.duration}min</strong>
                    </Typography>
                    <br />
                    <Typography fontFamily={"monospace"}>
                      Fee: <strong>₹{item.fees}</strong>
                    </Typography>
                  </Box>
                </CardContent>

                <Form onSubmit={submitHandler}>
                  <CardOverflow sx={{ bgcolor: "background.level1" }}>
                    <CardActions buttonFlex="1">
                      <Typography
                        level="body-md"
                        sx={{
                          color: "primary.main",
                          fontWeight: "bold",
                          marginBottom: 2,
                          fontFamily: "monospace",
                        }}
                      >
                        Select a slot
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Select
                          placeholder="Select a date"
                          name="date"
                          onChange={(e, newValue) => {
                            setSelectedDates((prevDates) => {
                              const newDates = [...prevDates];
                              newDates[index] = newValue;
                              return newDates;
                            });
                          }}
                          sx={{ color: "text.secondary", fontWeight: "medium" }}
                          required
                        >
                          {item.timeSlot
                            .filter(
                              (slot) => new Date(slot.date) >= currentDate
                            )
                            .map((slot, slotIndex) => (
                              <Option key={slotIndex} value={slot.date}>
                                {slot.date}
                              </Option>
                            ))}
                        </Select>
                        <Select
                          placeholder="Select a time"
                          name="time"
                          onChange={(e, newValue) => {
                            setSelectedSlots((prevSlots) => {
                              const newSlots = [...prevSlots];
                              newSlots[index] = newValue;
                              return newSlots;
                            });
                          }}
                          sx={{ color: "text.primary", fontWeight: "light" }}
                          required
                        >
                          {item.timeSlot
                            .find((slot) => slot.date === selectedDates[index])
                            ?.availableSlots.map((time, timeIndex) => (
                              <Option key={timeIndex} value={time}>
                                {time}
                              </Option>
                            ))}
                        </Select>
                      </Box>
                    </CardActions>
                  </CardOverflow>
                  <CardOverflow
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <CardActions buttonFlex="1">
                      <ButtonGroup variant="solid">
                        {!showPayPal[index] && (
                          <Button
                            type="button"
                            sx={{
                              backgroundColor: "#20817D",
                              width: "100%",
                            }}
                            onClick={() => {
                              handleBookAppointment(index);
                              setServiceName(item.serviceName);
                              setDuration(item.duration);
                              setfees(item.fees);
                              setUser(userInfo._id);
                              setService(item._id);
                              setCoach(item.coach._id);
                              handleWalletBalance();
                            }}
                          >
                            Book An Appointment
                          </Button>
                        )}
                        {showPayPal[index] && (
                          <Box>
                            <PayPalButtons
                              createOrder={(data, actions) =>
                                createOrder(
                                  data,
                                  fees,
                                  serviceName,
                                  duration,
                                  user,
                                  service,
                                  selectedDates[index],
                                  selectedSlots[index],
                                  coach,
                                  actions
                                )
                              }
                              onApprove={(data, actions) =>
                                onApprove(
                                  data,
                                  {
                                    sku: serviceName,
                                    cost: fees,
                                    duration: duration,
                                    user: user,
                                    service: service,
                                    appointmentDate: selectedDates[index],
                                    appointmentTime: selectedSlots[index],
                                    coach: coach,
                                  },
                                  index
                                )
                              }
                            />
                            <Button
                              sx={{
                                width: "250px",
                                backgroundColor: "green",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "darkcyan",
                                },
                                mt: 2,
                                mb: 2,
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                              onClick={() =>
                                handleWalletPayment(
                                  service,
                                  serviceName,
                                  duration,
                                  fees,
                                  selectedDates[index],
                                  selectedSlots[index],
                                  coach
                                )
                              }
                            >
                              Pay Using Wallet <br />
                              Wallet Balance : ₹ {balance}
                            </Button>
                          </Box>
                        )}
                      </ButtonGroup>
                    </CardActions>
                  </CardOverflow>
                </Form>
              </Card>
            ))}
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Pagination
          count={Math.ceil(
            impInfo && impInfo.length > 0 && impInfo.length / rowsPerPage
          )}
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
};

export default UserCoachListByService;
