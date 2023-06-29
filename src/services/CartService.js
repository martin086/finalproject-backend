import cartModel from "../models/MongoDB/cartModel.js";

export const findCartById = async (id) => {
    try {
        const cart = await cartModel.findById(id)
        return cart
    } catch (error) {
        throw new Error(error)
    }
}

export const createCart = async (cart) => {
    try {
        const newCart = await cartModel()
        await newCart.save()
        return newCart
    } catch (error) {
        throw new Error(error)
    }
}

export const updateCart = async (id, info) => {
    try {
        return await cartModel.findByIdAndUpdate(id, info);
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteCart = async (id) => {
    try {
        return await cartModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
}
