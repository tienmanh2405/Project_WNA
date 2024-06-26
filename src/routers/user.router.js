import express from 'express';
import { getAllUsers, updateUser, deleteUser, register, login, getUsers, requestRefreshToken } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import validation from '../middlewares/validationMiddleware.js';
import { register as registerSchema, login as loginSchema } from '../validations/auth.validation.js';
import uploader from '../middlewares/uploader.middlewares.js';



const router = express.Router();

// Lấy thông tin người dùng 
router.get('/', verifyToken, getAllUsers);
// Đăng ký tài khoản
router.post('/register', validation(registerSchema), uploader.single("image"), register);

// Đăng nhập        
router.post('/login', validation(loginSchema), login);

// Cập nhật thông tin người dùng
router.put('/', verifyToken, uploader.single("image"), updateUser);

// Xóa người dùng chi admin
router.delete('/:userId', verifyToken, deleteUser);
//test
router.post('/getuser', getUsers);

// requestRefreshToken
router.post('/refreshToken', requestRefreshToken);

export default router;
