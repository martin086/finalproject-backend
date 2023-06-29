//import { getManagerUsers } from "../dao/daoManager.js";
import { findUsers, findUserById, findUserByEmail, findUserByToken, createUser, deleteUser, updateUser } from "../services/UserService.js";
import nodemailer from 'nodemailer';
import crypto from "crypto";
import { createHash } from "../utils/bcrypt.js";

export const getUsers = async (req,res) => {
    try {
        const users = await findUsers()
        res.status(200).json({users})
    } catch (error) {
        res.status(500).send({
            message: "Error en el server",
            error: error.message
        })
    }
}

export const getUserByEmail = async (req,res) => {
    try {
        const user = await findUserByEmail(email)
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({
            message: "No se pudo obtener el usuario.",
            error: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await findUserById(id);
        res.status(200).json({user});
    } catch (error) {
        res.status(500).send(error);
    }
};



// const userManagerData = await getManagerUsers()
// export const userManager = new userManagerData()

export const createNewUser = async (req, res) => {
    try {
        const user = await createUser(user)
        res.send({ status: "success", message: "User Created Successfully" })
    } catch (error) {
        res.status(500).send(error)
    }    
}

export const deleteUserById = async (req, res) => {
    try {
        const uid = req.params.userId;
        await deleteUser(uid);
        res.status(200).send(`User [ID:${uid}] deleted successfully`);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateUserById = async (req, res) => {
    try {
        const uid = req.params.userId;
        const data = req.body;
        await updateUser(uid, data);
        res.status(200).send(`User [ID:${uid}] updated successfully`);
    } catch (error) {
        res.status(500).send(error);
    }
};


//Password Recovery

// export const recoverPassword = async (req, res) => {
//     const { email } = req.body;
//     if(!email) {
//         return res.status(400).send({message: "User email is required."})
//     }
//     try {
//         const user = await findUserByEmail(email);
//         const token = crypto.randomBytes(20).toString('hex');
//         if (!user) {
//             return res.render('password/recover', {
//             error: 'User with this email does not exist',
//             });
//         }
        
//         user.passwordResetToken = token;
//         user.passwordResetExpires = Date.now() + 3600000; // 1 hour
//         await user.save();

//         const mailOptions = {
//             from: 'martinsuarezdev@gmail.com',
//             to: user.email,
//             subject: 'Password Recovery',
//             text: `Click the following link to reset your password: http://localhost:${process.env.PORT}/password/reset/${token}`,
//         };

//         await transporter.sendMail(mailOptions);

//         res.cookie('resetToken', token);
//         res.render('password/recoveryEmailSent', { message: 'Password recovery email sent!' });
//         console.log("Password recovery email sent.")
//     } catch (error) {
//         console.error(error);
//         res.render('password/recover', { error: 'An error occurred. Please try again.' });
//     }
// };

// export const resetPassword = async (req, res) => {
//     try {
//         const { resetToken } = req.cookies;
//         const { password, confirmPassword } = req.body;

//         console.log(`Token de recuperación: ${resetToken}`);
//         console.log(`Nuevo password: ${password} / Confirmación: ${confirmPassword}`)

//         if (password !== confirmPassword) {
//             return res.render('password/reset', {
//             token,
//             error: 'Passwords do not match',
//             });
//         }

//         const user = await findUserByToken({resetToken})
//         console.log(user)

//         if (!user) {
//             return res.render('password/reset', {
//             token,
//             error: 'Token is invalid. Please try again.',
//             });
//         }

//         const isTokenExpired = () => {
//             const elapsedTime = Date.now() - resetToken.timestamp //Tiempo desde que se realizó la petición de cambio de contraseña.
//             const expirationTime = user.passwordResetExpires //Una hora
//             return elapsedTime >= expirationTime //Si True, expiró el token. Si False, todavía no.
//         }

//         if(isTokenExpired) {
//             res.status(400).send('Token has expired. Please try again.');
//         }

//         user.password = createHash(password);
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires = undefined;
//         await user.save();

//         res.render('password/resetSuccess', { message: 'Password reset successful!' });
//     } catch (error) {
//         console.error(error);
//         res.render('password/reset', { token, error: 'An error occurred. Please try again.' });
//     }
// };
