import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const tokenUser = req.headers.authorization.split(' ')[1]; // bearer <token<
    if (!tokenUser) {
      throw new Error("Invalid token");
    }
    const decoded = jwt.verify(tokenUser, process.env.secretKey);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};
