import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getAllTasksByProduct } from '../controllers/task.controller.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import validation from '../middlewares/validationMiddleware.js';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation.js';

const router = express.Router();

// Lấy tất cả các công việc
router.get('/task/:userId', verifyToken, getAllTasks);

// Lấy thông tin của một công việc dựa trên ID
router.get('/task/:taskId', verifyToken, getTaskById);

// Lấy thông tin của một công việc dựa trên product Id
router.get('/task/:productId', verifyToken, getAllTasksByProduct);

// Tạo một công việc mới
router.post('/task/', verifyToken, validation(createTaskSchema), createTask);

// Cập nhật thông tin của một công việc
router.put('/task/:taskId', verifyToken, validation(updateTaskSchema), updateTask);

// Xóa một công việc
router.delete('/:taskId', verifyToken, deleteTask);

export default router;
