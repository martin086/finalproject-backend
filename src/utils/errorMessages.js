import passport from 'passport'

export const passportError = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) { //Errores del Token (token no válido, formato no adecuado, no existe, etc.)
                return next(error)
            }

            if(!user) {
                return res.status(401).send({error: info.message ? info.message : info.toString()})
            }

            req.user = user
            next()
        })(req, res, next)
    }
}

export const roleVerification = (role) => {
    return async (req, res, next) => {
        const userAccess = req.user.user[0]
        if(!req.user) {
            return res.status(401).send({error: "User not authorized"})
        }
        
        if (userAccess.role != role) {
            return res.status(401).send({error: "User permission not according to requirement."})
        }
        
        next()

    }

}