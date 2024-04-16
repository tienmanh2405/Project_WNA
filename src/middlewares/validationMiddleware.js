import Joi from 'joi';
import _ from 'lodash';

const validation = (schema) => {
    return async (req, res, next) => {
        try {
            // Combine req.body and req.files into one object
            const data = { ...req.body, ...req.files };

            // Validate data using the provided schema
            const { error } = Joi.object(schema).validate(data);

            if (error) {
                return res.status(400).json({
                    msg: 'Validation fail!',
                    error: error.details
                });
            } else {
                next();
            }
        } catch (e) {
            return res.status(400).json({
                msg: 'Validation fail!',
                error: e
            });
        }
    };
};

export default validation;
