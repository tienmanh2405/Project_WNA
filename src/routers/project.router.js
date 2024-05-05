import express from 'express';
import { createProject, getProjectById, searchProjects, getAllProjects, updateProject, deleteProject } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import validation from '../middlewares/validationMiddleware.js';
import { updateProjectSchema } from '../validations/project.validation.js';

const router = express.Router();

router.get('/search/searchQuery', verifyToken, searchProjects);
// Lấy thông tin dự án bằng ID
router.get('/:projectId', verifyToken, getProjectById);

// Lấy tất cả dự án
router.get('/', verifyToken, getAllProjects);

// Tạo dự án mới
router.post('/', verifyToken, createProject);

// Cập nhật thông tin dự án
router.put('/:projectId', verifyToken, validation(updateProjectSchema), updateProject);

// Xóa dự án
router.delete('/:projectId', verifyToken, deleteProject);

export default router;
