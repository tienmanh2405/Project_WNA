import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    try {
        const tokenUser = req.headers.authorization.split(' ')[1]; // bearer <token<
        if (!tokenUser) {
            throw new Error ("Invalid token");
        } 
      const decoded = jwt.verify(tokenUser, process.env.secretKey);
      console.log(decoded);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(403).json({ msg: error.error });
  }
};
