import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { checkSessionRole } from "../config/middlewares.js";

const routerProducts = Router()

routerProducts.get("/", getProducts)
routerProducts.get("/:pid", getProduct)
routerProducts.post("/", checkSessionRole("Admin"), createProduct)
routerProducts.put("/:pid", checkSessionRole("Admin"), updateProduct)
routerProducts.delete("/:pid", checkSessionRole("Admin"), deleteProduct)


export default routerProducts;
