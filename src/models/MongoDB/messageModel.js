//import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


const messageModel = model('Messages', messageSchema);

export default messageModel

// export default class ManagerMessageMongoDB extends ManagerMongoDB {
//     constructor() {
//         super(url, "messages", messageSchema)
//         //Acá van los atributos propios de la clase
//     }
//     //Acá van los métodos propios de la clase
// }