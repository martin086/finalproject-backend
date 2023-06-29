//import { ManagerMongoDB } from "../db/mongoDBManager.js";
import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const url = process.env.URLMONGODB

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        index: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    thumbnail: {
        type: Array,
        default: []
    }
})

productSchema.plugin(paginate)

const productModel = model('Products', productSchema)

export default productModel

// class ManagerProductsMongoDB extends ManagerMongoDB {
//     constructor() {
//         super(url, "products", productSchema)
//     }

//     async paginate(filter, options) {
//         super.setConnection()
//         try {
//             return await this.model.paginate(filter, options)
//         } catch (error) {
//             return error
//         }
//     }
// }

// export default ManagerProductsMongoDB