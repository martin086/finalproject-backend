import { Schema, model } from "mongoose";


const ticketSchema = new Schema({
  invoice_number: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    default: () => {
      return new Date().valueOf();
    },
  },
  purchase_time: {
    type: Date,
    default: Date.now,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const ticketModel = model("Ticket", ticketSchema);

export default ticketModel
