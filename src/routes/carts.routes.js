import { Router } from "express";
import { addProductToCart, createNewCart, emptyCart, getCart, removeProductCart, updateAllCart, updateProdQtyCart, createNewPurchase } from "../controllers/cart.controller.js";
import { checkSessionRole } from "../config/middlewares.js";

const routerCart = Router()

routerCart.get('/:cid', checkSessionRole("User"), getCart)
//routerCart.post('/', createNewCart) Eliminamos la ruta porque ahora se crea con el usuario.
routerCart.post('/:cid/products/:pid', checkSessionRole("User"), addProductToCart)
routerCart.post('/:cid/purchase', checkSessionRole("User"), createNewPurchase)
//routerCart.put('/:cid', updateAllCart)
routerCart.put('/:cid/products/:pid', checkSessionRole("User"), updateProdQtyCart)
routerCart.delete('/:cid/products/:pid', checkSessionRole("User"), removeProductCart)
routerCart.delete('/:cid', checkSessionRole("User"), emptyCart)


export default routerCart;