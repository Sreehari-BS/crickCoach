import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";

const addMessage = asyncHandler(async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new Message({
    chatId,
    senderId,
    text,
  });
  const result = await message.save();
  res.status(200).json(result);
});

const getMessage = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const result = await Message.find({ chatId });
  res.status(200).json(result);
});

export { addMessage, getMessage };
