import { UserModel } from "../models/user.model.js";
import { NullOrUndefined } from "../untils/checknull.until.js";
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
    const role = req.userData.role;
    if (role == 'user') {
      const userId = req.userData.userId;
      const reqUserId = req.params.userId;
      if (userId !== reqUserId) {
        return res.status(403).json({
          msg: "No update permission",
        });
      }
    }
    const allUsers = await UserModel.find();
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ msg: "No users found." });
    }
    res.status(200).json({ allUsers: allUsers });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const reqUserId = req.params.userId;
    if (userId !== reqUserId) {
      return res.status(403).json({
        msg: "No update permission",
      });
    }
    const body = Object.values(req.body); //thong tin ma ho update vao
    if (NullOrUndefined.checkNullOrNondefined(body)) {
      return res.status(400).json({
        msg: "Null or undefined ",
      });
    }
    const { userName, gender, dayOfBirth, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updateUser = await UserModel.findByIdAndUpdate(reqUserId, { userName, password: hashedPassword, gender, dayOfBirth, phoneNumber }, { new: true });
    //mongoose
    if (!updateUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.status(200).json({
      msg: "User updated successfully",
      updateUser: updateUser,
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
      return res.status(400).json({ msg: 'Email is existed' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const file = req.file;
    // Kiểm tra xem có file hình ảnh được gửi từ client không
    if (!file) {
      return res.status(400).json({ error: 'Vui lòng chọn một tập tin hình ảnh' });
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
      role: 'user',
      gender,
      dayOfBirth,
      phoneNumber,
      image: imageUrl
    });
    await newUser.save();
    res.status(201).json({ msg: "success register", UserModel: newUser });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ msg: error.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await UserModel.findOne({ email });
    if (!checkUser) throw new Error('User not found');
    const isValidPassword = await bcrypt.compare(password, checkUser.password);
    if (!isValidPassword) throw new Error('incorrect account password');

    const secretKey = process.env.secretKey;
    const token = jwt.sign({ userId: checkUser._id, role: checkUser.role }, secretKey, { expiresIn: '1h' });
    res.json({ msg: "Sign up success", token });
  } catch (error) {
    res.status(400).json({ msg: error.error });
  }
}

export {
  getAllUsers,
  updateUser,
  deleteUser,
  register,
  login
}