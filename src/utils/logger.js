import winston from "winston";

const customLevelOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'blue',
        debug: 'green'
    }
}


//Logger para entorno de desarrollo solo incluye console.
const devLogger = winston.createLogger({
    levels: customLevelOpt.levels,
    transports: [
        new winston.transports.Console({
            levels: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        })
    ]
})

//Logger para entorno de producción incluye archivo a partir de nivel info.
const prodLogger = winston.createLogger({
    levels: customLevelOpt.levels,
    transports: [
        new winston.transports.Console({
            levels: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            levels: 'error',
            filename: './errors.log',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        })
    ]
})

const getLoggerType = () => {
    if (process.env.NODE_ENV === 'dev') {
        return devLogger
    }
    return prodLogger
}

const logger = getLoggerType()

export const addLogger = (req, res, next) => {
    req.logger = logger //Llamo al logger definido previamente.
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}