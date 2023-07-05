import { Router } from "express";
import { addProductToCart, createNewCart, emptyCart, getCart, removeProductCart, updateAllCart, updateProdQtyCart, createNewPurchase } from "../controllers/cart.controller.js";
import { checkSessionRole } from "../config/middlewares.js";

const routerCart = Router()

routerCart.get('/', checkSessionRole("User"), getCart)
//routerCart.post('/', createNewCart) Eliminamos la ruta porque ahora se crea con el usuario.
routerCart.post('/products/:pid', checkSessionRole("User"), addProductToCart)
routerCart.post('/purchase', checkSessionRole("User"), createNewPurchase)
routerCart.put('/', checkSessionRole("User"), updateAllCart)
routerCart.put('/products/:pid', checkSessionRole("User"), updateProdQtyCart)
routerCart.delete('/products/:pid', checkSessionRole("User"), removeProductCart)
routerCart.delete('/', checkSessionRole("User"), emptyCart)


export default routerCart;