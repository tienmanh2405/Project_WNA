import express from 'express';
import { createTemplate, getAllTemplates, getTemplateById, updateTemplate, deleteTemplate } from '../controllers/template.controller.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

//lay tat ca templates
router.get('/templates', getAllTemplates);
//lay template theo id
router.get('/templates/:id', getTemplateById);
//create template
router.post('/templates',verifyToken, createTemplate);
//update template
router.post('/templates',verifyToken, updateTemplate);
//delet template
router.delete('/templates',verifyToken, deleteTemplate);
export default router;
