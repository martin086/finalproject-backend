import { findCartById, createCart, updateCart, deleteCart } from "../services/CartService.js";
import { findProductById, updateOneProduct } from "../services/ProductService.js";
import { findPurchaseById, createPurchase } from "../services/TicketService.js";
import productModel from "../models/MongoDB/productModel.js";


//Get specified Cart and populate
export const getCart = async (req, res) => {
    if (req.session.login) {
        const idCart = req.session.user.idCart;

        try {
            const cart = await findCartById(idCart);
            if(!cart) {
                throw new Error("Carrito inexistente.");
            }

            const popCart = await cart.populate({ 
                path: "products.productId", model: productModel})
            res.status(200).json({ popCart })
        } catch (error) {
            res.status(500).send({
                message: "Error en el servidor.",
                error: error.message
            })
        }

    } else {
        return res.status(401).send("No existe sesion activa.")
    }
    
}

//Create New Cart
export const createNewCart = async (req, res) => {
    try {
        const cart = {}
        const newCart = await createCart(cart)
        res.send({
            status: "success",
            payload: newCart
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
    }
}

//Add a product to Cart
export const addProductToCart = async (req, res) => {
    if (req.session.login) {
        const idCart = req.session.user.idCart;
        const idProduct = req.params.pid;
        
        try {
            const existingProduct = await findProductById(idProduct);

            if (existingProduct) {
                const cart = await findCartById(idCart);
                const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));

                if (productIndex === -1) {
                    cart.products.push({ productId: idProduct });
                } else {
                    cart.products[productIndex].quantity += 1;
                }

                await cart.save();
                return res.status(200).send("Producto agregado al carrito.")
            }

        } catch (error) {
            res.status(500).send({
                message: "Error en el servidor.",
                error: error.message
            })
        }

    } else {
        return res.status(401).send("No existe sesión activa.")
    }
}
    
//Add an array of products to the cart
export const updateAllCart = async (req, res) => {
    try {
        const prodArray = req.body
        const addedProducts = await cartManager.updateAllProducts(req.params.cid, prodArray)

        res.send({
            status: "success",
            payload: addedProducts
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }

}
//Update only the quantity of a single product.
export const updateProdQtyCart = async (req, res) => {
    if (req.session.login) {
        const { quantity } = req.body;
        const idCart = req.session.user.idCart;
        const idProduct = req.params.pid;
        const newQty = parseInt(quantity);

        try {
            const cart = await findCartById(idCart);
            const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));

            if (productIndex === -1) {
                throw new Error("El producto no se encuentra en el carrito.");
            }

            cart.products[productIndex].quantity = newQty;
            await cart.save();
            return res.status(200).send("Producto actualizado.")

        } catch (error) {   
            res.status(500).send({
                message: "Error en el servidor.",
                error: error.message
            })
        }

    } else {
        return res.status(401).send("No existe sesión activa.")
    }
}
    
//Elimina el producto seleccionado del carrito.
export const removeProductCart = async (req, res) => {
    if (req.session.login) {
        const idCart = req.session.user.idCart;
        const idProduct = req.params.pid;

        try {
            const cart = await findCartById(idCart);
            const productIndex = cart.products.findIndex(product => product.productId.equals(idProduct));

            if (productIndex === -1) {
                throw new Error("El producto no se encuentra en el carrito.");
            }

            cart.products.splice(productIndex, 1);
            await cart.save();
            return res.status(200).send("Producto eliminado del carrito.")


        } catch (error) {
            res.status(500).send({
                message: "Error en el servidor.", 
                error: error.message
            })
        }

    } else {
        return res.status(401).send("No existe sesion activa.")
    }

}
//Remove all products from cart.
export const emptyCart = async (req, res) => {
    if (req.session.login) {
        const idCart = req.session.user.idCart;

        try {
            await updateCart(idCart, { products: [] });
            return res.status(200).send("El carrito se ha vaciado.")

        } catch (error) {
            res.status(500).send({
                message: "Error en el servidor", 
                error: error.message
            })
        }

    } else {
        return res.status(401).send("No existe sesion activa.")
    }
}


//Create New Purchase
export const createNewPurchase = async (req, res) => {
    if (req.session.login) {
        const idCart = req.session.user.idCart;
        const purchaser = req.session.user.email;
        console.log(idCart, purchaser)

        try {
            const cart = await findCartById(idCart);
            const popCart = await cart.populate({ 
                path: "products.productId", model: productModel})
            const productArray = popCart.products
                        
            if (productArray === -1) {
                throw new Error("El carrito no contiene productos para facturar.");
            }

            let totalAmount = 0;
            //console.log(productArray);
            productArray.forEach((item) => {
                console.log(`El precio es: $${item.productId.price}`)
                console.log(`La cantidad es: ${item.quantity}`)
                totalAmount += item.productId.price * item.quantity;
                let idProduct = item.productId._id;
                let stock = parseInt(item.productId.stock);
                let newStock = (stock - item.quantity);
                console.log(`El ID del producto es: ${idProduct}`)
                console.log(`El stock actual es: ${item.productId.stock}`)
                console.log(`El nuevo stock sería: ${newStock}`)

                if (newStock < 0) {
                    throw new Error(`No hay stock suficiente del producto: ${item.productId.title}. Por favor eliminar del carrito para continuar.`);
                }
                updateOneProduct(idProduct, {stock: newStock});
            });
            console.log(`El monto total de la compra es de: $${totalAmount}.`)

            const invoice = await createPurchase({
                total_amount: totalAmount,
                purchaser: purchaser,
            })     

            const savedInvoice = await invoice.save();
            await updateCart(idCart, { products: [] });
            return res.status(201).json({
                message: 'Purchase created successfully',
                invoice: savedInvoice,
            })


        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error creating purchase',
                error: error,
            });
        }
    }
}