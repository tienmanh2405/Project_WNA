import express from 'express';
import { getAllUsers, updateUser, deleteUser, register, login } from '../controllers/user.controller.js';
// import {verifyToken} from '../middlewares/authMiddlewares.js';
const router = express.Router();

// Đăng ký tài khoản
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Lấy thông tin người dùng
router.get('/', getAllUsers);

// Cập nhật thông tin người dùng
router.put('/:userId', verifyToken, updateUser);

// Xóa người dùng
router.delete('/:userId', verifyToken, deleteUser);

export default router;
