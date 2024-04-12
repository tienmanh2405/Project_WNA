import Joi from 'joi';

// Validation schema cho tạo mới một công việc
export const createTaskSchema = {
    body: Joi.object({
        user: Joi.string().required(),
        project: Joi.string().required(),
        description: Joi.string(),
        dueDate: Joi.date(),
        priority: Joi.string().valid('Low', 'Medium', 'High').required(),
        taskProcess: Joi.string().valid('Not Started', 'In Progress', 'Waiting', 'Deferred', 'Done').required()
    })
};

// Validation schema cho cập nhật thông tin của một công việc
export const updateTaskSchema = {
    body: Joi.object({
        project: Joi.string(),
        description: Joi.string(),
        dueDate: Joi.date(),
        priority: Joi.string().valid('Low', 'Medium', 'High'),
        taskProcess: Joi.string().valid('Not Started', 'In Progress', 'Waiting', 'Deferred', 'Done')
    })
};
