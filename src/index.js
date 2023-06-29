import 'dotenv/config'
import './config/config.js'
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { readMessages, createMessage } from './services/MessageService.js'
import * as path from 'path'
import { __dirname } from "./path.js"
import router from './routes/index.routes.js'
import MongoStore from 'connect-mongo'
import initializePassport from './config/passport.js'
import passport from 'passport'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { errorHandler } from './config/middlewares.js'
import { addLogger } from './utils/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'



// const whiteList = ['http://localhost:3000'] //Rutas validas a mi servidor

// const corsOptions = { //Reviso si el cliente que intenta ingresar a mi servidor esta o no en esta lista
//     origin: (origin, callback) => {
//         if (whiteList.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by Cors'))
//         }
//     }
// }


//Express Server
const app = express()

//Middlewares
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URLMONGODB,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

//Mongoose
const connectionMongoose = async () => {
    await mongoose.connect(process.env.URLMONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((err) => console.log(err));
}

connectionMongoose()

//Conexión para Testing
export const connectionTestMongoose = async () => {
    await mongoose.connect(process.env.URLMONGOTEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((err) => console.log(err));
}


//Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Backend Final Project - Coderhouse",
            description: "Proyecto final de backend. Comisión: 39685. Alumno: Martín Suarez."
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Port
app.set("port", process.env.PORT || 8080)

//Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, "./views"))
app.use('/', express.static(__dirname + '/public'))

//Logger
app.use(addLogger)

//Routes
app.use('/', router)

//Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

//Nodemailer
export const transporter = nodemailer.createTransport({ //Genero la forma de enviar info desde mail (o sea, desde Gmail con x cuenta)
    host: 'smtp.gmail.com', //Defino que voy a utilizar un servicio de Gmail
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER, //Mail del que se envia informacion
        pass: process.env.MAILER_PASS,
        authMethod: 'LOGIN'
    }
})

// app.get('/email', async (req, res) => {
//     //console.log(process.env.MAILER_PASS)
//     await transporter.sendMail({
//         from: 'Test Coder martinsuarezdev@gmail.com',
//         to: "franciscopugh01@gmail.com",
//         subject: "Saludos, nueva prueba",
//         html: `
//             <div>
//                 <h2>Hola, esta es una nueva prueba desde la clase de Coder</h2>
//             </div>
//         `,
//         attachments: []
//     })
//     res.send("Email enviado")
// })

// Error Handler
app.use(errorHandler)

//Launch
const server = app.listen(app.get("port"), ()=> console.log(`Server on port ${app.get("port")}`))

//Socket.io (Chat Server)
export const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("Chat client online");

    socket.on("message", async newMessage => {
        await createMessage([newMessage]);
        const messages = await readMessages();
        console.log(messages)
        socket.emit("allMessages", messages)
    })

    socket.on("load messages", async () => {
        const messages = await readMessages()
        console.log(messages)
        socket.emit("allMessages", messages)
    })
})


//Subprocesos e Hilos
// import cluster from 'cluster'
// import { cpus } from 'os'
// import express from 'express'

// const numSubProcesos = cpus().length


// if (cluster.isPrimary) {
//     console.log("Soy el proceso principal supervisor")
//     for (let i = 0; i < numSubProcesos; i++) {
//         cluster.fork() //Genero un proceso hilo
//     }

// } else {
//     const app = express()
//     app.get("/suma", (req, res) => {
//         let suma = 0

//         for (let i = 0; i < 100000; i++) {
//             suma += i
//         }
//         console.log({ status: "success", message: `Hola, soy un subproceso con el id ${process.pid} con el resultado ${suma}` })
//         res.send("Hola")
//     })
//     console.log(`Hola, soy un subproceso con el id ${process.pid}`)
//     app.listen(4000, () => console.log("Server on port 4000"))
//     //cluster.fork() No puedo generar un subproceso a traves de un subproceso
// }


// export const isTokenExpired = (passwordData) => {
//     const elapsedTime = Date.now() - passwordData.timestamp //Tiempo desde que se realizó la petición de cambio de contraseña.
//     const expirationTime = 60 * 60 * 1000 //Una hora
//     return elapsedTime >= expirationTime //Si True, expiró el token. Si False, todavía no.
// }

//https://www.youtube.com/watch?v=O49g_OVPe6Q