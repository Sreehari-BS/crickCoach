import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

const createChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    members: { $all: [req.body.userId, req.body.coachId] },
  });
  if (!chat) {
    const newChat = new Chat({
      members: [req.body.userId, req.body.coachId],
    });
    await newChat.save();
    return res.status(200).json(newChat);
  }
  res.status(200).json(chat);
});

const userChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    members: { $in: [req.params.memberId] },
  });
  const memberArray = [];
  if (chats) {
    for (const chat of chats) {
      for (const member of chat.members) {
        if (member.toString() !== req.params.memberId.toString()) {
          const user = await User.findById(member);
          memberArray.push(user);
        }
      }
    }
  }
  res.status(200).json(memberArray);
});

const findChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    members: { $all: [req.params.userId, req.params.coachId] },
  });
  res.status(200).json(chat);
});

export { createChat, userChats, findChat };
