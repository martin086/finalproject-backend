//const selectedDB = process.env.DBSELECTION

//O importo MongoDB o importo Postgres
// export const getManagerProducts = async() => {
//     const productModel = process.env.DBSELECTION == 1 
//     ? await import('../models/MongoDB/productModel.js').then(module => module.default) 
//     : await import('../models/Postgresql/productModel.js').then(module => module.default)
//     return productModel
// }

// export const getManagerCart = async() => {
//     const cartModel = process.env.DBSELECTION == 1 
//     ? await import('../models/MongoDB/cartModel.js').then(module => module.default) 
//     : await import('../models/Postgresql/cartModel.js').then(module => module.default)
//     return cartModel
// }

// export const getManagerMessages = async() => {
//     const messageModel = process.env.DBSELECTION == 1 
//     ? await import('../models/MongoDB/messageModel.js').then(module => module.default) 
//     : await import('../models/Postgresql/messageModel.js').then(module => module.default)
//     return messageModel
// }

// export const getManagerUsers = async() => {
//     const userModel = process.env.DBSELECTION == 1 
//     ? await import('../models/MongoDB/userModel.js').then(module => module.default) 
//     : await import('../models/Postgresql/userModel.js').then(module => module.default)
//     return userModel
// }