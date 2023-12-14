import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Select,
  MenuItem,
  Grid,
  Pagination,
  Avatar,
} from "@mui/material";
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
  CardContent,
} from "@mui/joy";
import { toast } from "react-toastify";
import Loader from "./Loader";
import CoachHeader from "./CoachHeader";
import CoachHomeSidebar from "./CoachHomeSidebar";
import {
  useFindUserMutation,
  useFindChatMutation,
} from "../slices/chatApiSlice";
import {
  useGetMessageMutation,
  useAddMessageMutation,
} from "../slices/mesageApiSlice";
import { useSelector } from "react-redux";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";
import { io } from "socket.io-client";

const CoachHome = () => {
  const [users, setUsers] = useState("");
  const [chat, setChat] = useState("");
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [text, setText] = useState("");
  const [userList, { isLoading }] = useFindUserMutation();
  const [chatData] = useFindChatMutation();
  const [messageData] = useGetMessageMutation();
  const [createMessage] = useAddMessageMutation();

  const { coachInfo } = useSelector((state) => state.coachAuth);
  const coachID = coachInfo && coachInfo._id;
  const chatId = chat && chat._id;

  const listUser = async () => {
    try {
      const { data } = await userList(coachID);
      if (data) {
        const sortedUsers = [...data].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chatInfo = async (userId, coachId) => {
    try {
      const { data } = await chatData({ userId, coachId });
      setChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      const { data } = await messageData(chat._id);
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addMessage = async (e) => {
    e.preventDefault();
    const message = {
      chatId,
      senderId: coachID,
      text,
    };
    try {
      const data = await createMessage(message).unwrap();
      setMessages([...messages, data]);
      setText("");
    } catch (error) {
      console.log(error);
    }
    //send message to socket server
    const receiverId = chat.members.find((id) => id !== coachID);
    setSendMessage({ ...message, receiverId });
  };

  useEffect(() => {
    listUser();
    if (chat) {
      getMessages();
    }
  }, [chat]);

  useEffect(() => {
    const newSocket = io("https://crickcoach.onrender.com");

    newSocket.on("connect", () => {
      setSocket(newSocket);
      newSocket.emit("new-user-add", coachID);
      newSocket.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [coachID]);

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
              <Typography
                level="h2"
                align="center"
                fontFamily={"monospace"}
                gutterBottom
              >
                Connect with Customers
              </Typography>
              <hr />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Paper
                  elevation={10}
                  sx={{
                    width: "20%",
                    height: "550px",
                    backgroundColor: "#F6AF9A",
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    className="text-center"
                    sx={{ m: 2, fontFamily: "monospace" }}
                    level="h4"
                  >
                    Chats
                  </Typography>
                  <hr
                    style={{ width: "70%", margin: "auto", color: "Black" }}
                  />
                  <Box
                    sx={{
                      height: "460px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        overflowY: "scroll",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                      }}
                    >
                      {users &&
                        users.map((user, index) => (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              m: 2,
                              height: "50px",
                              backgroundColor: "#CB5839",
                              borderRadius: "20px",
                              cursor: "pointer",
                            }}
                            key={index}
                            onClick={() => {
                              setUser(user);
                              chatInfo(user._id, coachID);
                            }}
                          >
                            <Avatar
                              src={user.profileImage}
                              alt={user.profileImage}
                            />
                            <Typography
                              level="h5"
                              ml={1}
                              sx={{ color: "white", fontFamily: "monospace" }}
                            >
                              <b>{user.name}</b>
                            </Typography>
                          </Box>
                        ))}
                      {isLoading && <Loader />}
                    </Box>
                  </Box>
                </Paper>

                <Paper
                  elevation={10}
                  sx={{
                    backgroundColor: "#DCA393",
                    width: "78%",
                    height: "550px",
                    borderRadius: "20px",
                  }}
                >
                  {user ? (
                    <>
                      <Box
                        sx={{
                          height: "550px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Avatar
                            alt={user && user.profileImage}
                            src={user && user.profileImage}
                          />
                          <Typography
                            level="h4"
                            m={2}
                            sx={{ color: "#CB5839", fontFamily: "monospace" }}
                          >
                            <b>{user && user.name}</b>
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
                                      message.senderId === coachID
                                        ? "coral"
                                        : "#1E7B7C",
                                    color: "white",
                                    fontFamily: "monospace",
                                    padding: 2,
                                    borderRadius: "10px",
                                    margin: 1,
                                    marginRight: 20,
                                    marginLeft: 20,
                                    alignSelf:
                                      message.senderId === coachID
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
                                        message.senderId === coachID
                                          ? "right"
                                          : "left",
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
                            sx={{ backgroundColor: "coral", color: "white" }}
                          >
                            <b>Send</b>
                          </Button>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Typography
                      level="h3"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: "230px",
                        fontFamily: "monospace",
                        color: "white",
                      }}
                    >
                      Click on the customers for getting started...
                    </Typography>
                  )}
                </Paper>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CoachHome;
