import Joi from "joi";

export const register = {
    body: Joi.object({
        userName: Joi.string()
            .min(5)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\[\]{3,30}$'))
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        gender: Joi.string()
            .allow(null)
            .valid("Male", "Female", "Other"),
        dayOfBirth: Joi.date()
            .allow(null),
        phoneNumber: Joi.string()
            .required()
            .pattern(new RegExp('^[0-9]{10}$')),
        image: Joi.string(),
    })
};


export const login = {
    body: {
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\[\]{3,30}$'))
            .required()
    }
};

