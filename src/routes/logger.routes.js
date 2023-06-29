import { Router } from "express";

const routerLogger = Router()

routerLogger.get('/', (req, res) => {
    try {
        req.logger.fatal(`${new Date().toLocaleTimeString()} - ERROR FATAL, no hay precios en ciertos productos.`)
        req.logger.error(`${new Date().toLocaleTimeString()} - ERROR, no hay stock en ciertos productos.`)
        req.logger.warning(`${new Date().toLocaleTimeString()} - WARNING, no hay imagenes en ciertos productos.`)
        req.logger.info(`${new Date().toLocaleTimeString()} - INFO, algunos avisos.`)
        req.logger.http(`${new Date().toLocaleTimeString()} - HTTP, todo funciona.`)
        req.logger.debug(`${new Date().toLocaleTimeString()} - DEBUG, todo funciona.`)

        res.status(200).send({
            message: 'Testing Logger success'
        })
    } catch (error) {
        req.logger.error(`Error on logger - ${error.message}`)
        res.status(500).send({
            status: 'error',
            error: error.message
        })
    }
})

export default routerLogger