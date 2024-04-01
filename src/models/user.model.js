import mongoose from "mongoose";

// const User_Model_Name = "User";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female","other"]
    },
    dayOfBirth: {
        type: Date
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    }
});

export const UserModel = mongoose.model("User", userSchema);
