import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getAllTasksByProduct, getTasks } from '../controllers/task.controller.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/:userId', verifyToken, getTasks);
router.get('/:taskId', verifyToken, getTaskById);
router.get('/productId/:productId', verifyToken, getAllTasksByProduct);
router.get('/', getAllTasks);
router.post('/', verifyToken, createTask);
router.put('/:taskId', verifyToken, updateTask);
router.delete('/:taskId', verifyToken, deleteTask);


export default router;
