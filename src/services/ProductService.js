import productModel from "../models/MongoDB/productModel.js";

export const findProducts = async () => {
    try {
        const products = await productModel.find()
        return products
    } catch (error) {
        throw new Error(error)
    }
}


export const findProductById = async (id) => {
    try {
        const product = await productModel.findById(id)
        return product
    } catch (error) {
        throw new Error(error)
    }
}

export const paginateProducts = async (filters, options) => {
    try {
        const paginated = await productModel.paginate(filters, options);
        return paginated 
    } catch (error) {
        throw error
    }
}

export const createOneProduct = async (prod) => {
    try {
        const newProduct = await productModel.insertMany(prod)
        await newProduct.save()
        return newProduct
    } catch (error) {
        throw new Error(error)
    }
}

export const updateOneProduct = async (id, info) => {
    try {
        return await productModel.findByIdAndUpdate(id, info);
    } catch (error) {
        throw new Error(error);
    }
}

export const deleteOneProduct = async (id) => {
    try {
        return await productModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
}