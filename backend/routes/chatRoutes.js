import express from "express";
const router = express.Router();
import {
  createChat,
  findChat,
  userChats,
} from "../controllers/chatControllers.js";

router.post("/", createChat);
router.get("/:memberId", userChats);
router.get("/find/:userId/:coachId", findChat);

export default router;
