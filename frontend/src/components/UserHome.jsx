import React, { useEffect, useState } from "react";
import { Box, Grid, Pagination, Paper, Avatar } from "@mui/material";
import {
  Card,
  AspectRatio,
  Button,
  CardContent,
  Typography,
  Modal,
  ModalClose,
  Sheet,
  ModalDialog,
  DialogTitle,
  DialogContent,
} from "@mui/joy";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  useListCoachMutation,
  useListCoachServiceMutation,
  useListAllServicesMutation,
  useReviewListMutation,
  useVerifyAppointmentMutation,
} from "../slices/userApiSlice";
import { setImpCredentials } from "../slices/nonImpAuthSlice";
import {
  useListCoachByServiceMutation,
  useSearchCoachMutation,
} from "../slices/userApiSlice";
import { useCreateChatMutation } from "../slices/chatApiSlice";
import {
  useAddMessageMutation,
  useGetMessageMutation,
} from "../slices/mesageApiSlice";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";
import { io } from "socket.io-client";

const userHome = () => {
  //Coach Pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  //Service Pagination
  const [servicePage, setServicePage] = React.useState(1);
  const [rowsPerServicePage, setRowsPerServicePage] = React.useState(4);

  //Review Pagination
  const [reviewPage, setReviewPage] = React.useState(1);
  const [rowsPerReviewPage, setRowsPerReviewPage] = React.useState(2);

  //SearchList Pagination
  const [searchPage, setSearchPage] = useState(1);
  const itemsPerPage = 4;

  //Modal
  const [open, setOpen] = React.useState(false);

  //Service Modal
  const [layout, setLayout] = React.useState(undefined);

  //Search Modal
  const [openSearch, setOpenSearch] = React.useState(false);

  const [chatModalLayout, setChatModalLayout] = React.useState(undefined);
  const [coachChatData, setCoachChatData] = useState("");
  const [userChat, setUserChat] = useState("");
  const [text, setText] = useState("");

  const [search, setSearch] = useState("");
  const [searchCoachList, setSearchCoachList] = useState("");
  const [coachList, setCoachList] = useState("");
  const [coachServiceList, setCoachServiceList] = useState("");
  const [allServiceList, setAllServiceList] = useState("");
  const [review, setReview] = useState("");
  const [avgRating, setAvgRating] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState("");
  const [onlineUsers, setOnlineUsers] = useState("");
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);

  const [listCoach, { isLoading }] = useListCoachMutation();
  const [listCoachService] = useListCoachServiceMutation();
  const [listAllServices] = useListAllServicesMutation();
  const [listCoachByService] = useListCoachByServiceMutation();
  const [reviewList] = useReviewListMutation();
  const [verifyAppointment] = useVerifyAppointmentMutation();
  const [chat] = useCreateChatMutation();
  const [createMessage] = useAddMessageMutation();
  const [messageList] = useGetMessageMutation();
  const [searchCoach] = useSearchCoachMutation();

  const [coachData, setCoachData] = useState(null);

  const dispatch = useDispatch();

  const coachSearch = async (search) => {
    const { data } = await searchCoach(search && search);
    setSearchCoachList(data);
  };

  const handleChange = (event, value) => {
    setSearchPage(value);
  };

  const coachesList = async () => {
    const { data } = await listCoach();
    if (data) {
      setCoachList(data);
    }
  };

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo && userInfo._id;
  const chatId = userChat && userChat._id;

  const completedAppointmentVerification = async (coachId) => {
    try {
      const { data } = await verifyAppointment(coachId);
      if (data) {
        const chatData = await chat({ userId, coachId }).unwrap();
        setChatModalLayout("fullscreen");
        setCoachChatData(data);
        setUserChat(chatData);
      } else {
        toast.error("Complete an appointment first");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const addMessage = async (e) => {
    e.preventDefault();
    const message = {
      chatId,
      senderId: userId,
      text,
    };
    try {
      const data = await createMessage(message).unwrap();
      setMessages([...messages, data]);
      setText("");
    } catch (error) {
      console.log(error);
    }
    // send message to socket server
    const receiverId = userChat.members.find((id) => id !== userId);
    setSendMessage({ ...message, receiverId });
  };

  const listMessage = async () => {
    try {
      const { data } = await messageList(chatId);
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const servicesList = async () => {
    const { data } = await listAllServices();
    if (data) {
      setAllServiceList(data);
    }
  };

  const handleModal = (coach) => {
    setCoachData(coach);
    setOpen(true);
  };

  const handlelistServices = async (coachId) => {
    const { data } = await listCoachService(coachId);
    if (data) {
      setCoachServiceList(data);
    } else {
      setCoachServiceList("");
    }
    setLayout("center");
  };

  const handleListCoachByService = async (serviceName) => {
    try {
      const { data } = await listCoachByService(serviceName);
      dispatch(setImpCredentials(data));
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const handleReviewList = async (coachId) => {
    const { data } = await reviewList(coachId);
    if (data) {
      setReview(data.reviews);
      setAvgRating(data.avgRating);
    }
  };

  useEffect(() => {
    coachesList();
    servicesList();
    {
      userChat && listMessage();
    }
  }, [userChat]);

  useEffect(() => {
    const newSocket = io("https://crickcoach.onrender.com");

    newSocket.on("connect", () => {
      setSocket(newSocket);
      newSocket.emit("new-user-add", userId);
      newSocket.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket && socket.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket &&
      socket.on("receive-message", (data) => {
        console.log("data", data);
        setReceiveMessage(data);
      });
  }, [socket]);

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chatId) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  return (
    <Box marginTop={9} sx={{ backgroundColor: "#E3FCFC", height: "100%" }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography fontFamily={"monospace"} level="h2">
              Explore Coaches
            </Typography>
          </Box>
          <Box>
            <input
              style={{
                height: 45,
                borderRadius: "10px",
                borderColor: "cyan",
              }}
              type="text"
              placeholder="Search coach ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
            <Button
              name="search"
              sx={{ ml: 1, backgroundColor: "darkcyan" }}
              onClick={() => {
                if (search.trim() !== "") {
                  coachSearch(search);
                  setOpenSearch(true);
                  setSearch("");
                }
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            marginTop: "0.5rem",
            borderRadius: "15px",
          }}
        >
          <Grid container spacing={2}>
            {coachList &&
              coachList
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((coach, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      invertedColors
                      sx={{ width: 312, backgroundColor: "#9DDAD6" }}
                    >
                      <AspectRatio height="120px" maxHeight="300px">
                        <img
                          src={
                            coach.profileImage
                              ? coach.profileImage
                              : "https://cdn-icons-png.flaticon.com/512/939/939255.png"
                          }
                          loading="lazy"
                          alt="profile Image"
                        />
                      </AspectRatio>
                      <div>
                        <Typography level="h3">{coach.name}</Typography>
                        <Typography level="body-sm">{coach.email}</Typography>
                      </div>
                      <CardContent orientation="horizontal">
                        <div>
                          <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            aria-label="Explore Bahamas Islands"
                            sx={{
                              ml: "auto",
                              alignSelf: "center",
                              fontWeight: 600,
                            }}
                            onClick={() => handlelistServices(coach._id)}
                          >
                            Services
                          </Button>
                        </div>
                        <Button
                          variant="solid"
                          size="md"
                          color="primary"
                          aria-label="Explore Bahamas Islands"
                          sx={{
                            ml: "auto",
                            alignSelf: "center",
                            fontWeight: 600,
                          }}
                          onClick={() => handleModal(coach)}
                        >
                          Explore
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Paper>
        <br />
        <Pagination
          count={Math.ceil(coachList.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
        />
        <br />
        {isLoading && <Loader />}
      </Container>
      <Container>
        <Typography fontFamily={"monospace"} level="h2">
          Explore Services
        </Typography>
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            marginTop: "0.5rem",
            borderRadius: "15px",
          }}
        >
          <Grid container spacing={2}>
            {allServiceList &&
              allServiceList
                .slice(
                  (servicePage - 1) * rowsPerServicePage,
                  servicePage * rowsPerServicePage
                )
                .map((service, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      invertedColors
                      sx={{ width: 312, backgroundColor: "#9DDAD6" }}
                    >
                      {service === "Batting" ? (
                        <AspectRatio height="120px" maxHeight="300px">
                          <img
                            src="https://thumbs.dreamstime.com/b/practicing-cricket-avatar-vector-illustration-design-92903797.jpg"
                            loading="lazy"
                            alt="profile Image"
                          />
                        </AspectRatio>
                      ) : service === "Bowling" ? (
                        <AspectRatio height="120px" maxHeight="300px">
                          <img
                            src="https://png.pngtree.com/png-clipart/20211009/original/pngtree-cricket-ball-png-image_6846615.png"
                            loading="lazy"
                            alt="profile Image"
                          />
                        </AspectRatio>
                      ) : service === "Fielding" ? (
                        <AspectRatio height="120px" maxHeight="300px">
                          <img
                            src="https://www.iwmbuzz.com/wp-content/uploads/2020/06/ab-de-villiers-the-new-age-fielding-sensation.jpg"
                            loading="lazy"
                            alt="profile Image"
                          />
                        </AspectRatio>
                      ) : service === "Keeping" ? (
                        <AspectRatio height="120px" maxHeight="300px">
                          <img
                            src="https://thumbs.dreamstime.com/b/cricket-wicket-keeper-catches-ball-60224858.jpg"
                            loading="lazy"
                            alt="profile Image"
                          />
                        </AspectRatio>
                      ) : service === "Strength Training" ? (
                        <AspectRatio height="120px" maxHeight="300px">
                          <img
                            src="https://thumbs.dreamstime.com/b/funny-man-avatar-dumbbells-funny-man-avatar-stretching-body-exercise-vector-illustration-graphic-design-139219207.jpg"
                            loading="lazy"
                            alt="profile Image"
                          />
                        </AspectRatio>
                      ) : (
                        <AspectRatio height="120px" maxHeight="300px">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREPFMuHfGJk-8_w3vkaHDQjiBGxAAiBzNo-kKESHTQOzw4QtDD5jq7RNY6uxwMmRc6TJ0&usqp=CAU"
                            loading="lazy"
                            alt="profile Image"
                          />
                        </AspectRatio>
                      )}
                      <div>
                        <Typography level="h3">{service}</Typography>
                      </div>
                      <CardContent orientation="horizontal">
                        <div></div>
                        <Link to="/service">
                          <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            aria-label="Explore Bahamas Islands"
                            sx={{
                              ml: "auto",
                              alignSelf: "center",
                              fontWeight: 600,
                            }}
                            onClick={() => handleListCoachByService(service)}
                          >
                            Explore
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Paper>
        <br />
        <Pagination
          count={Math.ceil(allServiceList.length / rowsPerServicePage)}
          page={servicePage}
          onChange={(event, value) => setServicePage(value)}
        />
        <br />
        {isLoading && <Loader />}
      </Container>
      {/* Modal-Explore Coach */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => {
          setOpen(false);
          setReview("");
          setShowReviews(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(3px)",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: "auto",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1, cursor: "pointer" }} />
          <Box
            sx={{
              width: "100%",
              position: "relative",
              overflow: { xs: "auto", sm: "initial" },
            }}
          >
            <Card
              orientation="horizontal"
              sx={{
                width: "700px",
                flexWrap: "wrap",
                [`& > *`]: {
                  "--stack-point": "500px",
                  minWidth:
                    "clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)",
                },
                // make the card resizable for demo
                overflow: "auto",
                resize: "horizontal",
              }}
            >
              <AspectRatio
                flex
                ratio="1"
                maxHeight={182}
                sx={{ minWidth: 182 }}
              >
                <img
                  src={
                    coachData && coachData.profileImage
                      ? coachData.profileImage
                      : "https://cdn-icons-png.flaticon.com/512/939/939255.png"
                  }
                  loading="lazy"
                  alt="Coach Profile Image"
                  style={{ maxWidth: 350 }}
                />
              </AspectRatio>
              <CardContent>
                <Typography fontSize="xl" fontWeight="lg">
                  {coachData && coachData.name}
                </Typography>
                <Typography
                  level="body-sm"
                  fontWeight="lg"
                  textColor="text.tertiary"
                >
                  {coachData && coachData.email}
                </Typography>
                <Typography
                  level="body-sm"
                  fontWeight="lg"
                  textColor="text.tertiary"
                >
                  {coachData && coachData.phoneNumber}
                </Typography>
                <Sheet
                  sx={{
                    bgcolor: "background.level1",
                    borderRadius: "sm",
                    p: 1.5,
                    my: 1.5,
                    display: "flex",
                    gap: 2,
                    "& > div": { flex: 1 },
                  }}
                >
                  <div>
                    <Typography level="body-xs" fontWeight="lg">
                      Age
                    </Typography>
                    <Typography fontWeight="lg">
                      {coachData && coachData.age ? coachData.age : ""}
                    </Typography>
                  </div>
                  <div>
                    <Typography level="body-xs" fontWeight="lg">
                      Experience
                    </Typography>
                    <Typography fontWeight="lg">
                      {coachData && coachData.experience
                        ? coachData.experience
                        : ""}
                    </Typography>
                  </div>
                  {/* <div>
                    <Typography level="body-xs" fontWeight="lg">
                      Rating
                    </Typography>
                    <Typography fontWeight="lg">8.9</Typography>
                  </div> */}
                </Sheet>
                <Box
                  sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}
                >
                  <Button
                    onClick={() => {
                      completedAppointmentVerification(
                        coachData && coachData._id
                      );
                      setOpen(false);
                    }}
                    variant="outlined"
                    color="neutral"
                  >
                    Chat
                  </Button>
                  {!showReviews ? (
                    <Button
                      onClick={() => {
                        handleReviewList(coachData && coachData._id);
                        setShowReviews(true);
                      }}
                      variant="solid"
                      color="primary"
                    >
                      Show Reviews
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setShowReviews(false);
                      }}
                      variant="solid"
                      color="danger"
                    >
                      Hide Reviews
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
            {showReviews && (
              <Box>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ fontFamily: "monospace" }} level="h2">
                    Reviews
                  </Typography>
                  <Typography sx={{fontFamily: "monospace", color: "coral"}} level="h4">
                    Rating: <b >{avgRating && avgRating}</b>
                  </Typography>
                </div>
                <br />
                <div
                  style={{ display: "flex", overflowX: "auto", marginLeft: 30 }}
                >
                  {review && review.length > 0 ? (
                    review.map((rev) =>
                      rev.reviews
                        .slice(
                          (reviewPage - 1) * rowsPerReviewPage,
                          reviewPage * rowsPerReviewPage
                        )
                        .map((item, index) => (
                          <Card
                            orientation="vertical"
                            size="lg"
                            variant="soft"
                            invertedColors
                            key={index}
                            sx={{
                              width: 312,
                              height: "100%",
                              backgroundColor: "#9DDAD6",
                              marginRight: "16px",
                            }}
                          >
                            <div>
                              <Typography level="h3" fontFamily={"monospace"}>
                                {item.appointment.user.name}
                              </Typography>
                            </div>
                            <CardContent orientation="horizontal">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography level="body-xs">
                                  Rating:{" "}
                                </Typography>
                                <Button
                                  variant="outlined"
                                  sx={{ marginLeft: "8px" }}
                                >
                                  <Typography
                                    fontSize="lg"
                                    fontWeight="lg"
                                    fontFamily={"monospace"}
                                    color="white"
                                  >
                                    {item.rating}
                                  </Typography>
                                </Button>
                              </div>
                            </CardContent>
                            <CardContent orientation="horizontal">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  fontSize="lg"
                                  fontWeight="lg"
                                  fontFamily={"monospace"}
                                >
                                  {item.comment}
                                </Typography>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )
                  ) : (
                    <Typography
                      className="text-center"
                      mt={2}
                      level="h2"
                      color="danger"
                      sx={{ fontFamily: "monospace" }}
                    >
                      No Reviews Available
                    </Typography>
                  )}
                </div>
                <br />
              </Box>
            )}
            {showReviews && (
              <Pagination
                count={Math.ceil(
                  (review && review.length ? review[0].reviews.length : 0) /
                    rowsPerReviewPage
                )}
                page={reviewPage}
                onChange={(event, value) => setReviewPage(value)}
              />
            )}
          </Box>
        </Sheet>
      </Modal>
      {/* Modal-Coach Services */}
      <Modal open={!!layout} onClose={() => setLayout(undefined)}>
        <ModalDialog layout={layout}>
          <ModalClose />
          <DialogTitle sx={{ fontFamily: "monospace" }}>
            {coachServiceList
              ? `${coachServiceList.coach.name}'s Services`
              : "Services"}
          </DialogTitle>
          <DialogContent>
            {coachServiceList ? (
              coachServiceList.services.map((service) => (
                <div>
                  <Card
                    orientation="vertical"
                    size="lg"
                    variant="soft"
                    invertedColors
                    sx={{
                      width: 312,
                      height: "100%",
                      backgroundColor: "#8ED9D6",
                    }}
                  >
                    <div>
                      <Typography level="h3" fontFamily={"monospace"}>
                        {service.serviceName}
                      </Typography>
                      <Typography level="body-sm">
                        {service.description}
                      </Typography>
                    </div>
                    <CardContent orientation="horizontal">
                      <div>
                        <Typography level="body-xs">Duration:</Typography>
                        <Typography
                          fontSize="lg"
                          fontWeight="lg"
                          fontFamily={"monospace"}
                        >
                          {service.duration}min
                        </Typography>
                      </div>
                      <Button
                        variant="solid"
                        size="md"
                        color="primary"
                        aria-label="Explore Bahamas Islands"
                        sx={{
                          ml: "auto",
                          alignSelf: "center",
                          fontWeight: 600,
                          fontFamily: "monospace",
                        }}
                        onClick={() => handleModal(coach)}
                      >
                        ₹{service.fees}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="text-danger" style={{ fontFamily: "monospace" }}>
                No service Available
              </div>
            )}
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* User Chat Modal */}
      <Modal
        open={!!chatModalLayout}
        onClose={() => setChatModalLayout(undefined)}
      >
        <ModalDialog layout={chatModalLayout}>
          <ModalClose />
          <DialogTitle>
            Chat with <b>{coachChatData && coachChatData.service.coach.name}</b>
          </DialogTitle>
          <hr />
          <Container>
            <Paper
              sx={{
                backgroundColor: "#5AC1C2",
                height: "80vh",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              elevation={10}
            >
              <DialogContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    alt={
                      coachChatData &&
                      coachChatData?.service?.coach?.profileImage
                    }
                    src={
                      coachChatData &&
                      coachChatData?.service?.coach?.profileImage
                    }
                  />
                  <Typography
                    level="h4"
                    m={2}
                    sx={{ color: "#045D5E", fontFamily: "monospace" }}
                  >
                    <b>
                      {coachChatData && coachChatData?.service?.coach?.name}
                    </b>
                  </Typography>
                </Box>
                <hr
                  style={{
                    color: "black",
                    width: "60%",
                    margin: "auto",
                    marginTop: 0,
                  }}
                />
              </DialogContent>
              <Box
                sx={{
                  height: "70%",
                  marginBottom: 2,
                  display: "flex",
                  flexDirection: "column-reverse",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {messages &&
                    messages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "inline-block",
                          backgroundColor:
                            message.senderId === userId ? "#1E7B7C" : "coral",
                          color: "white",
                          fontFamily: "monospace",
                          padding: 2,
                          borderRadius: "10px",
                          margin: 1,
                          marginRight: 30,
                          marginLeft: 28,
                          alignSelf:
                            message.senderId === userId
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <span>{message.text}</span>
                        <br />
                        <span
                          style={{
                            fontSize: 10,
                            color: "black",
                            fontFamily: "sans-serif",
                            textAlign:
                              message.senderId === userId ? "right" : "left",
                            display: "block",
                          }}
                        >
                          {format(message.createdAt)}
                        </span>
                      </Box>
                    ))}
                </Box>
              </Box>
              <Box
                sx={{
                  width: "70%",
                  margin: "auto",
                  marginBottom: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <InputEmoji
                  fontFamily="monospace"
                  placeholder="Type message..."
                  theme="auto"
                  keepOpened="true"
                  value={text}
                  onChange={(value) => setText(value)}
                />
                <Button
                  onClick={addMessage}
                  sx={{ backgroundColor: "#1E7B7C", color: "white" }}
                >
                  <b>Send</b>
                </Button>
              </Box>
            </Paper>
          </Container>
        </ModalDialog>
      </Modal>

      {/* SearchModal */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openSearch}
        onClose={() => setOpenSearch(false)}
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
          <Grid container direction="row" justify="center" alignItems="center">
            {searchCoachList && searchCoachList.length > 0 ? (
              searchCoachList
                .slice((page - 1) * itemsPerPage, searchPage * itemsPerPage)
                .map((coach, index) => (
                  <Grid key={index}>
                    <Card
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      invertedColors
                      sx={{ width: 312, backgroundColor: "#9DDAD6", m: 1 }}
                    >
                      <AspectRatio height="120px" maxHeight="300px">
                        <img
                          src={
                            coach.profileImage
                              ? coach.profileImage
                              : "https://cdn-icons-png.flaticon.com/512/939/939255.png"
                          }
                          loading="lazy"
                          alt="profile Image"
                        />
                      </AspectRatio>
                      <div>
                        <Typography level="h3">{coach.name}</Typography>
                        <Typography level="body-sm">{coach.email}</Typography>
                      </div>
                      <CardContent orientation="horizontal">
                        <div>
                          <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            aria-label="Explore Bahamas Islands"
                            sx={{
                              ml: "auto",
                              alignSelf: "center",
                              fontWeight: 600,
                            }}
                            onClick={() => handlelistServices(coach._id)}
                          >
                            Services
                          </Button>
                        </div>
                        <Button
                          variant="solid"
                          size="md"
                          color="primary"
                          aria-label="Explore Bahamas Islands"
                          sx={{
                            ml: "auto",
                            alignSelf: "center",
                            fontWeight: 600,
                          }}
                          onClick={() => handleModal(coach)}
                        >
                          Explore
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
            ) : (
              <Typography
                level="h1"
                color="danger"
                sx={{ fontFamily: "monospace", fontWeight: 200 }}
              >
                No coaches found.
              </Typography>
            )}
          </Grid>
          {searchCoachList.length > itemsPerPage && (
            <Pagination
              count={Math.ceil(searchCoachList.length / itemsPerPage)}
              page={searchPage}
              onChange={handleChange}
            />
          )}
        </Sheet>
      </Modal>
    </Box>
  );
};

export default userHome;
