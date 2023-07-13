import { Router } from "express";
import { getSession, requireAuth } from "../controllers/session.controller.js";
import { renderProducts, viewCarts, viewLogin, viewRegister, viewChat, viewRecoverPassword, viewResetPassword } from "../controllers/view.controller.js";
import { checkSessionRole, isSessionActive } from "../config/middlewares.js";

const routerViews = Router()

routerViews.get('/', viewLogin)
routerViews.get('/login', viewLogin)
routerViews.get('/register', viewRegister)
routerViews.get('/products', isSessionActive, renderProducts)
routerViews.get('/carts/:cid', checkSessionRole("User"), viewCarts)
routerViews.get('/chat', viewChat)

//Password Recovery Routes
routerViews.get('/password/forgot', viewRecoverPassword)
routerViews.get('/password/reset/:token', viewResetPassword)



export default routerViews