import { Schema, model } from "mongoose";

const fakerProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  thumbnail: {
    type: Array,
    default: []
}
})

const fakerProductModel = model("fakerProducts", fakerProductSchema);

export default fakerProductModel;