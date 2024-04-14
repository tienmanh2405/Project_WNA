import express from 'express';
import { getAllUsers, updateUser, deleteUser, register, login } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import validation from '../middlewares/validationMiddleware.js';
import { register as registerSchema, login as loginSchema } from '../validations/auth.validation.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Lấy thông tin người dùng 
router.get('/', verifyToken, getAllUsers);
// Đăng ký tài khoản
router.post('/register', validation(registerSchema), upload.single('file'), register);

// Đăng nhập
router.post('/login', validation(loginSchema), login);

// Cập nhật thông tin người dùng
router.put('/:userId', verifyToken, updateUser);

// Xóa người dùng chi admin
router.delete('/:userId', verifyToken, deleteUser);

export default router;
