import { UserModel } from "../models/user.model.js";
import { NullOrUndefined } from "../untils/checknull.until.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getAllUsers = async (__, res) => {
  try {
    const allUsers = await UserModel.find();
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ msg: "No users found." });
    }
    res.status(200).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
// const getUser = async (req, res) => {
//     try {
//       const getUser = await UserModel.findById(req.params.id);
//       if (!getUser) {
//         res.status(404).json({ msg: "User not found." });
//       }
//       res.status(200).json({user: getUser});
//     }catch (error) {
//     res.status(404).json({ msg: error.error });
//   }
// }

const updateUser = async (req, res) => {
  try {
    const userId = req.userData.userId; 
    const reqUserId = req.params.userId;
    if (userId !== reqUserId) {  //userId trung ==> nguoi dung da dang nhap ==> ho co quyen update tai khoan cua minh
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
    // body se nhap theo dang ̣{userName, password}
    const { userName } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updateUser = await UserModel.findByIdAndUpdate(reqUserId, { userName, password : hashedPassword}, { new: true });
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
    res.status(400).json({ msg: error.error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.userData.userId; 
    const reqUserId = req.params.userId;

    // Kiểm tra quyền xóa
    if (userId !== reqUserId) {
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
          role,
          gender,
          dayOfBirth,
          phoneNumber,
      } = req.body;
      const existingUser = await UserModel.findOne({ email });
       if (existingUser) {
        return res.status(400).json({ msg: 'Email is existed' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
       const newUser = new UserModel({ userName, email, password: hashedPassword });
      await newUser.save();
      // const hashPassword = await bcrypt.hash(password, salt);
      //   const userNew = await UserModel.create({
      //       userName,
      //       password: hashPassword,
      //       email
      //   });
        res.status(201).json({msg:"success register",UserModel: newUser});
    } catch (error) {
        res.status(400).json({msg: error.error});
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
        const token = jwt.sign({userId : checkUser._id}, secretKey,{ expiresIn: '1h' });
        res.json({ msg: "Sign up success", token });
    } catch(error) {
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