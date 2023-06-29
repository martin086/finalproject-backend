import { Router } from "express"
import { checkSessionRole, isSessionActive } from "../config/middlewares.js"
import { getMessages, sendMessage } from "../controllers/chat.controller.js"

const routerChat = Router()

routerChat.get('/', isSessionActive, getMessages)
routerChat.post('/', checkSessionRole("User"), sendMessage)

export default routerChat