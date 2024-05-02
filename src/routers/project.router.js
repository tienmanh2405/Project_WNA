import express from 'express';
import { createProject, getProjectById, getAllProjects, updateProject, deleteProject } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import validation from '../middlewares/validationMiddleware.js';
import { createProjectSchema, updateProjectSchema } from '../validations/project.validation.js';

const router = express.Router();

// Lấy tất cả dự án
router.get('/', verifyToken, getAllProjects);

// Lấy thông tin dự án bằng ID
router.get('/:productId', verifyToken, getProjectById);

// Tạo dự án mới
router.post('/', verifyToken, validation(createProjectSchema), createProject);

// Cập nhật thông tin dự án
router.put('/:productId', verifyToken, validation(updateProjectSchema), updateProject);

// Xóa dự án
router.delete('/:productId', verifyToken, deleteProject);

export default router;
