import passport from "passport";
import jwt from "jsonwebtoken";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import { transporter } from "../index.js";
import { findUserByEmail, findUserById, updateUser } from "../services/UserService.js";
import crypto from "crypto";

export const registerUser = async (req, res, next) => {
    try {
        passport.authenticate('register', async (err, user) => {
            if (err) {
                return res.status(401).send({
                    message: "Ha ocurrido un error con el registro.",
                    error: err.message })
            }
            if (!user) {
                return res.status(401).send("El usuario ya existe.")
            }
            return res.status(200).send("El usuario se ha registrado exitosamente.")
        })(req, res, next)
        
    } catch (error) {
        res.status(500).send({
            message: "Error en el servidor.",
            error: error.message
        })
    }
}

export const loginUser = async (req, res, next) => {
    try {
        passport.authenticate('login', (err, user) => {
            if (err) {
                return res.status(401).send({
                    message: "Ha ocurrido un error durante el login",
                    error: err.message
                })
            }
            if (!user) {
                return res.status(401).send("Datos incorrectos.")
            }
            req.session.login = true;
            req.session.user = user;
            return res.status(200).send(`Bienvenido ${req.session.user.first_name}, tu rol es ${req.session.user.role}`)
        })(req, res, next)

    } catch (error) {
        res.status(500).send({
            message: "Hubo un error en el servidor", 
            error: error.message
        })
    }

}


// export const checkLogin = async (req, res) => {
//     try {
        
//         const { email, password } = req.body

//         if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//             req.session.login = true
//             req.session.userFirst = "Admin Backend"
//             req.session.role = "admin"
//             console.log(`${email} logged in as ${req.session.role}`)
//             res.redirect('/products')
//         } else {
//             const user = await findUserByEmail(email)

//             if (user && validatePassword(password, user.password)) {
//                 req.session.login = true
//                 req.session.userFirst = user.first_name
//                 req.session.role = user.role
//                 console.log(`${email} logged in as ${user.role}`)
//                 res.redirect('/products')
//             } else {
//                 res.status(401).json({
//                     message: "Please check your credentials."
//                 })
//             }
//         }
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }


export const getSession = async (req, res) => {
    try {
        if (req.session.login) {
            const sessionData = {
                name: req.session.user.first_name,
                role: req.session.user.role
            }
            return sessionData
        } else {
            res.redirect('/login', 500, { message: "Please Login" })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const destroySession = (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy()
            console.log(`Session closed`)
            res.status(200).redirect('/')
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const requireAuth = (req, res, next) => {
    console.log(req.session.login)
    req.session.login ? next() : res.redirect('/login')

}

//Password Recovery
export const sendResetPwdLink = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        
        if (!user) {
            res.status(404).send({
                status: 'error',
                message: 'User with this email does not exist',
            });
            return
        }

        const resetLink = await generatePwdResetLink(user, req, res)

        const recoveryEmailOpts = {
            from: process.env.MAILER_USER,
            to: email,
            subject: 'Password Reset Link',
            html: `
            <p>Hola ${user.first_name},</p>
            <p>Haz click <a href="${resetLink}">aquí</a> para reestablecer tu contraseña:</p>
    
            <p>Si no solicitaste un cambio de contraseña, ignora este correo.</p>
            `
        }
        await transporter.sendMail(recoveryEmailOpts);

        
        req.logger.info(`Password reset link sent to ${email}`)
        res.status(200).send({
            status: 'success',
            message: `Password reset link sent to ${email}`
        })

    } catch (error) {
        req.logger.error(`Error in password reset procedure - ${error.message}`)
        res.status(500).send({
            status: 'error',
            message: error.message
        })
        next(error)
    }
}

async function generatePwdResetLink(user, req, res) {
    const token = await jwt.sign({ user_id: user._id }, process.env.SIGNED_COOKIE, { expiresIn: '1h' })
    req.logger.info(`Generated password reset cookie: ${token}`)

    return `http://localhost:${process.env.PORT}/password/reset/${token}`
}

export const resetPassword = async (req, res, next) => {
    const { password, confirmPassword, token } = req.body

    console.log(`El token es: ${token}`)
    if (!token) {
        res.status(401).send({
            status: 'error',
            message: 'Token expired'
        })
        return
    }
    if (!password) {
        res.status(400).send({
            status: 'error',
            message: 'Enter new password'
        })
        return
    }

    try {
        const readToken = jwt.verify(token, process.env.SIGNED_COOKIE);
        const userID = readToken.user_id;
        const userFound = await findUserById(userID);
        console.log(`readToken es: ${JSON.stringify(readToken)}`)
        console.log(`UserID es: ${userID}`)
        console.log(`El user es: ${userFound}`)

        if (!userFound) {
            res.status(404).send({
                status: 'error',
                message: 'User was not found'
            })
        }
        if (password !== confirmPassword) {
            res.status(400).send({
                status: 'error',
                message: 'Both passwords must match'
            })
            return
        }
        if (await validatePassword(password, userFound.password)) {
            res.status(400).send({
                status: 'error',
                message: 'You cannot reuse a password. Please type a new one'
            })
            return
        }

        //If everything is correct, update the password.
        const newPassword = await createHash(password.toString());
        await updateUser(userFound._id, { password: newPassword, });
        res.status(200).send({
            status: 'success',
            message: 'Password was changed successfully'
        })

    } catch (error) {
        res.status(500).send({
            message: 'Error on password reset',
            error: error.message
        })
        next(error)        
    }
}
