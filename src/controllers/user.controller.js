import { UserModel } from "../models/user.model.js";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';



dotenv.config();
// connect cloudianry
cloudinary.config({
  cloud_name: 'dh0lhvm9l',
  api_key: '314188383667441',
  api_secret: 'g_PBWzOuyUVbjMZymyMR8BjwfZE'
});

const getAllUsers = async (req, res) => {
  try {

    const userId = req.userData.userId;
    const allUsers = await UserModel.findById(userId);
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ msg: "No users found." });
    }
    res.status(200).json({ data: allUsers });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const getUsers = async (req, res) => {
  try {
    const { filters, sorting, pagination } = req.body;
    const { userId } = filters || {};
    const { pageSize, pageNumber } = pagination || {};
    let query = UserModel.find();
    if (userId) {
      query = query.findOne({ _id: userId });
    }

    if (sorting && sorting.length > 0) {
      sorting.forEach(({ field, order }) => {
        if (field && order && (order === 1 || order === -1)) {
          query = query.sort({ [field]: order });
        }
      });
    }

    if (pageSize !== -1) {
      const skip = (pageNumber - 1) * pageSize;
      query = query.skip(skip).limit(pageSize);
    }

    const users = await query;

    res.status(200).json({
      msg: 'Get users successfully!',
      data: users
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
      stack: err.stack
    });
  }
}



const updateUser = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { userName, gender, dayOfBirth, phoneNumber } = req.body;
    const file = req.file;
    // Kiểm tra xem có file hình ảnh được gửi từ client không
    if (!file) {
      return res.status(400).json({ error: 'Vui lòng chọn một tập tin hình ảnh', success: false });
    }
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const fileName = file.originalname.split('.')[0];

    // Upload hình ảnh lên Cloudinary và nhận lại URL của hình ảnh đã tải lên
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: 'auto',
        folder: "WNA"
        // có thể thêm field folder nếu như muốn tổ chức
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const imageUrl = result.secure_url;
    const updateUser = await UserModel.findByIdAndUpdate(userId, { userName, gender, dayOfBirth, phoneNumber, image: imageUrl }, { new: true });
    //mongoose
    if (!updateUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.status(200).json({
      data: updateUser
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const role = req.userData.role;
    const reqUserId = req.params.userId;

    // Kiểm tra quyền xóa
    if (role == "user") {
      return res.status(403).json({
        error: "No delete permission",
      });
    }

    // Xác định và xóa người dùng
    const deletedUser = await UserModel.findByIdAndDelete(reqUserId);

    if (!deletedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      msg: "User deleted successfully",
      deletedUser: deletedUser,
    });
  } catch (error) {
    res.status(400).json({ msg: error.error });
  }
};



const register = async (req, res) => {
  try {
    const {
      userName,
      password,
      email,
      gender,
      dayOfBirth,
      phoneNumber,
    } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email is existed', success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const file = req.file;
    // Kiểm tra xem có file hình ảnh được gửi từ client không
    if (!file) {
      return res.status(400).json({ error: 'Vui lòng chọn một tập tin hình ảnh', success: false });
    }
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const fileName = file.originalname.split('.')[0];

    // Upload hình ảnh lên Cloudinary và nhận lại URL của hình ảnh đã tải lên
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: 'auto',
        folder: "WNA"
        // có thể thêm field folder nếu như muốn tổ chức
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const imageUrl = result.secure_url;
    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
      role: "user",
      gender,
      dayOfBirth,
      phoneNumber,
      image: imageUrl
    });
    await newUser.save();
    res.status(201).json({ msg: "success register", success: true, UserModel: newUser });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ msg: error.message, success: false });
  }
}

const generateAccessToken = (user) => {
  const secretKey = process.env.secretKey;
  return jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
}
const generateRefreshToken = (user) => {
  const refreshSecretKey = process.env.refreshSecretKey;
  return jwt.sign({ userId: user._id, role: user.role }, refreshSecretKey, { expiresIn: '2h' });
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await UserModel.findOne({ email });
    if (!checkUser) throw new Error('User not found');
    const isValidPassword = await bcrypt.compare(password, checkUser.password);
    if (!isValidPassword) throw new Error('incorrect account password');

    const accessToken = generateAccessToken(checkUser);

    const refreshToken = generateRefreshToken(checkUser);
    res.json({ msg: "Sign up success", success: true, accessToken, refreshToken, userId: checkUser.id });
  } catch (error) {
    res.status(400).json({ msg: error.error, success: false });
  }
}

const requestRefreshToken = (req, res) => {
  const refreshToken = req.body.localRefreshToken;
  if (!refreshToken) return res.status(401).json("You're not authenticated");
  const user = jwt.verify(refreshToken, process.env.refreshSecretKey);
  if (user) {
    const secretKey = process.env.secretKey;
    const newAccessToken = jwt.sign({ userId: user.userId, role: user.role }, secretKey, { expiresIn: '1h' });
    const refreshSecretKey = process.env.refreshSecretKey;
    const newRefreshToken = jwt.sign({ userId: user.userId, role: user.role }, refreshSecretKey, { expiresIn: '2h' });
    return res.json({ success: true, userId: user.userId, newAccessToken, newRefreshToken });
  } else {
    return res.status(403).json("Invalid refreshToken");
  }
};


export {
  getAllUsers,
  updateUser,
  deleteUser,
  register,
  login,
  getUsers,
  requestRefreshToken
}