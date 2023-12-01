import express from "express"
const router = express.Router()
import {addMessage, getMessage} from "../controllers/messageController.js"

router.post("/", addMessage)
router.get("/:chatId", getMessage)

export default router