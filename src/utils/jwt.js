import jwt from "jsonwebtoken"

export const generateToken = (user) => {
    /*
    1°: Objeto de asociación del token
    2°: Clave privada del cifrado
    3°: Tiempo de expiración
    */
    const token = jwt.sign(user, process.env.SIGNED_COOKIE, {expiresIn: 
    '24h'})
    return token

}

export const authToken = (req,res,next) => {
    /*
    Casos:
    1.Token válido
    2.Token expirado o no existente
    3.Token no autorizado
    */
    //Consultar el token en el header
    const authHeader = req.headers.authorization
    //Token no existente o expirado
    if(!authHeader) {
        return res.status(401).send({error: "Usuario no autenticado"})
    }
    //Sacar la palabra Bearer del token
    const token = authHeader.split(' ')[1]
    //Chequear si el token es válido
    jwt.sign(token, process.env.SIGNED_COOKIE, (error, credentials) => {

        if(error) {
            return res.status(403).send({error: "Usuario no autorizado"})
        }
        //Token existe y es válido
        req.user = credentials.user
        next()
    })

}