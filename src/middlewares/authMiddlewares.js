import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from "../models/user.model.js";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const tokenUser = req.headers.authorization.split(' ')[1]; // bearer <token<
    if (!tokenUser) {
      throw new Error("Invalid token");
    }
    const decoded = jwt.verify(tokenUser, process.env.secretKey);
    console.log(decoded);
    // Kiểm tra thời hạn của token
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp - currentTimestamp > 60) { // Nếu thời hạn còn hơn 60 giây, không cần refresh
      req.userData = decoded;
      next();
    } else {
      const checkUser = await UserModel.findById(decoded.userId);
      if (!checkUser) throw new Error('User not found');
      // Tạo token mới
      const secretKey = process.env.secretKey;
      const newToken = jwt.sign({ userId: checkUser._id, role: checkUser.role }, secretKey, { expiresIn: '1h' });
      req.userData = newToken;
      next();
    }
  } catch (error) {
    res.status(403).json({ msg: error.message });
  }
};
