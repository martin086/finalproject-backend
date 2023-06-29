import { Router } from 'express';
import { postFakerProducts , getFakerProducts} from '../faker/fakerProduct.controller.js';

const routerMockingProducts = Router()

// "/mockingproducts"
routerMockingProducts.get("/", getFakerProducts)
routerMockingProducts.post("/", postFakerProducts)
  
export default routerMockingProducts