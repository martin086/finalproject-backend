import fakerProductModel from '../faker/fakerProductModel.js';

export const findFakerProducts = async () => {
  try {
      const fakerProducts = await fakerProductModel.find()
      return fakerProducts
  } catch (error) {
      throw new Error(error)
  }
}

export const createFakerProduct = async (fakerProduct) => {
  try {
      const newFakerProduct = await fakerProductModel(fakerProduct)
      await newFakerProduct.save()
      return newFakerProduct
  } catch (error) {
      throw new Error(error)
  }
}