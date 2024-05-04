import Joi from "joi";
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
