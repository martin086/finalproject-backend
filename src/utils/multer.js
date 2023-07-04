import multer from "multer";
import * as path from 'path'
import { __dirname } from "../path.js"

// Multer settings
const storage = multer.diskStorage({
    // destination example: '/src/public/uploads/profile/654789123_filename.jpg'
    destination: function (req, file, cb) {
        cb(null,__dirname+'/public/documents')
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.uid}_${file.originalname}`)
    }
})

export const uploader = multer({ storage }) 