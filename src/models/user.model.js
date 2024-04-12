
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
        type: Boolean,
        default: 0
    },
    dayOfBirth: {
        type: Date
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    }
});

export const UserModel = mongoose.model("User", userSchema);

