import { io } from "../index.js"
import { readMessages, createMessage } from "../services/MessageService.js"

export const getMessages = async (req, res) => {
    try {
        const messages = await readMessages()
        console.log(messages)

        res.status(200).json({
            messages: messages
        })
    } catch (error) {
        res.status(500).send({
            message: `Internal server error`,
            error: error.message
        })

    }
}

export const sendMessage = async (req, res) => {
    const { message } = req.body
    const { first_name, last_name, email } = req.session.user

    try {
        await createMessage({
            name: `${first_name} ${last_name}`,
            email,
            message
        })
        const messages = await readMessages()
        io.emit(messages)

        res.status(200).send({
            message: "Mensaje enviado",
        });

    } catch (error) {
        res.status(500).send({
            message: "Internal server error.",
            error: error.message
        });
    }
}