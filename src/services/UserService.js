import userModel from "../models/MongoDB/userModel.js";

export const findUsers = async () => {
    try {
        const users = await userModel.find()
        return users
    } catch (error) {
        throw new Error(error)
    }
}

export const findUserById = async (id) => {
    try {
        const user = await userModel.findById(id)
        return user
    } catch (error) {
        throw new Error(error)
    }
}

export const findUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({ email: email })
        return user
    } catch (error) {
        throw new Error(error)
    }
}

export const findUserByToken = async (token) => {
    try {
      const user = await userModel.findOne({ resetPassToken: token });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  };

export const createUser = async (user) => {
    try {
        const newUser = await userModel.create(user)
        await newUser.save()
        return newUser
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteUser = async (id) => {
    try {
        return await userModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
}

export const updateUser = async (id, info) => {
    try {
        return await userModel.findByIdAndUpdate(id, info);
    } catch (error) {
        throw new Error(error);
    }
}