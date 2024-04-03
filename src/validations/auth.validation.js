import Joi from "joi"
const register = {
    body: ({
        userName: Joi.string()
            .alphanum
            .min(5)
            .max(30)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
        repeat_password: Joi.string()
            .ref(password),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        role: Joi.string()
            .valid('admin', 'user')
            .required(),
        gender: Joi.number()
            .allow(null)
            .valid(1, 0, null),
        dayOfBirth: Joi.date()
            .allow(null),
        phoneNumber: Joi.string()
            .required()
            .pattern(new RegExp('^[0-9]{10}$'))
    }).with('password','repeat_password')
}

const login = {
    body: {
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required()
    }
}
module.exports = {
    register,
    login
}