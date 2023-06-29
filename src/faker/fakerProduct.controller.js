import { faker } from '@faker-js/faker';
import { findFakerProducts, createFakerProduct } from '../faker/fakerProductService.js';

export const getFakerProducts = async (req, res) => {
  try {
      const fakerProducts = await findFakerProducts()
      res.status(200).json({fakerProducts})

  } catch (error) {
      res.status(500).send({
        message: "Hubo un error en el servidor", 
        error: error.message
      })
  }
}

export const postFakerProducts = async (req, res) => {
  try {
    for (let i=0; i < 100 ; i++) {
      await createFakerProduct(mockingProducts())
    }    

    res.status(200).send("Se han creado 100 mockingProducts.")

  } catch (error) {
    res.status(500).send({
      message: "Hubo un error en el servidor", 
      error: error.message
    })
  }
}

const mockingProducts = () =>  {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.datatype.string(6),
    price: faker.commerce.price(),
    stock: faker.datatype.number({ min: 0, max: 99, precision: 1 }),
    category: faker.commerce.product(),
    thumbnail: faker.image.imageUrl()
  };
}