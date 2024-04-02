import express from 'express';
import { getAllUsers, updateUser, deleteUser, register, login } from '../controllers/user.controller.js';
import {verifyToken} from '../middlewares/authMiddlewares.js';
const router = express.Router();

// Lấy thông tin người dùng/// chi admin
router.get('/',verifyToken, getAllUsers);
// Đăng ký tài khoản
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Cập nhật thông tin người dùng
router.put('/:userId', verifyToken, updateUser);

// Xóa người dùng chi admin
router.delete('/:userId', verifyToken, deleteUser);

export default router;
