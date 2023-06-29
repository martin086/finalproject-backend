import ticketModel from "../models/MongoDB/ticketModel.js";

export const findPurchaseById = async (id) => {
    try {
        const ticket = await ticketModel.findById(id)
        return ticket
    } catch (error) {
        throw new Error(error)
    }
}

export const createPurchase = async (invoice) => {
    try {
        const newTicket = await ticketModel.create(invoice)
        await newTicket.save()
        return newTicket
    } catch (error) {
        throw new Error(error)
    }
}