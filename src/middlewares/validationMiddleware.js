import Joi from 'joi';
import _ from 'lodash';

const validation = (schema) => {
    return async (req, res, next) => {
        try {
            const _schema = Joi.object(schema);

            // Tạo một đối tượng mới để chứa dữ liệu từ form data
            const formData = _.merge({}, req.body, req.files);

            const valid = _schema.validate(_.pick(formData, Object.keys(schema)));

            console.log('------validation', valid, schema)
            const { error } = valid;

            if (error) {
                return res.status(400).json({
                    msg: 'Validation fail!',
                    error: error
                })
            } else {
                next()
            }

        } catch (e) {
            return res.status(400).json({
                msg: 'Validation fail!',
                error: e
            })
        }
    }
}

export default validation;
