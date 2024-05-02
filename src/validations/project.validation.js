import Joi from "joi";

export const createProjectSchema = {
    body: Joi.object({
        user: Joi.string()
            .alphanum()
            .required(),
        nameProject: Joi.string()
            .required()
            .min(5)
            .max(50)
    })
};

export const updateProjectSchema = {
    body: Joi.object({
        user: Joi.string()
            .alphanum(),
        template: Joi.string()
            .alphanum(),
        nameProject: Joi.string()
            .min(5)
            .max(50)
    }).or('user', 'template', 'nameProject') // Tối thiểu một trong các trường phải được cung cấp để cập nhật
};
