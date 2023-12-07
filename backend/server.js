import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
const port = process.env.PORT;
import userRoutes from "./routes/userRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import AdminRoutes from "./routes/adminRoutes.js";
import ChatRoutes from "./routes/chatRoutes.js";
import MessageRoutes from "./routes/messageRoute.js";
import path from "path";

connectDB();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://crick-coach-frontend.vercel.app",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  //For adding new User
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  //Send Message
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to: ", receiverId);
    console.log("Data", data);
    if (user) {
      const mess = io.to(user.socketId).emit("receive-message", data);
      if (mess) {
        console.log("Receiving on socket : ", user.socketId, data);
      }
    }
  });
  //On disconnect
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes);

app.get("/", (req, res) => res.send("Server is Ready"));

app.use(notFound);
app.use(errorHandler);

//Production Script
// app.use(express.static("./frontend/dist"))
// app.get("*", (req,res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
// })

httpServer.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
