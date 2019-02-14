const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const Feedback = require('../models/feedback.model');

module.exports = {
  create(req, res) {
		const schema = Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().email({ minDomainAtoms: 2 }),
			tel: Joi.number().required(),
			message: Joi.string().required()
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}
		const body = {
			name: value.name,
			email: value.email,
			tel: value.tel,
			message: value.message,
			created: Date.now()
		};
    Feedback.create(body)
			.then(feedback => {
				res
					.status(HttpStatus.OK)
					.json({ message: 'feedback sent', feedback });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ msg: 'Failed to process request', err });
			});
	},
};