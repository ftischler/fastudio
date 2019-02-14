const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user.model');

const E_SECRET = process.env.MAIL_TOKEN_SECRET;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

module.exports = {
	//find email and send password rest link
	forgetPassword(req, res) {
		User.findOne({ email: req.body.email })
			.then(async user => {
				if (!user) {
					return res
						.status(HttpStatus.NOT_FOUND)
						.json({ msg: 'Email not found' });
				}
				try {
					// configuring jwt
					const payload = { data: user._id };
					const token = jwt.sign(payload, E_SECRET, { expiresIn: '1d' });
					const url = `http://www.fastudio.com.ng/passwordReset/${user.firstname + '%20' +	user.lastname}/${token}`;
					// using SendGrid's v3 Node.js Library
					sgMail.setApiKey(SENDGRID_API_KEY);
					await sgMail.send({
						to: user.email,
						from: {
							name: 'Fastudio.com.ng',
							email: 'hello@fastudio.com.ng'
						},
						subject: 'Fastudio Password Reset',
						html: `
						<div>
							<h2>Hi ${user.firstname},</h2><br>
							<p>Looks like you'd like to Reset your Fastudio password. Please click the following link or copy the link and paste in your web browser.<br><p>Please disregard this e-mail if you did not request a password reset</p></p><br>
							Password-Reset Link: <a href="${url}">${url}</a>
						</div>
					`
					});
				} catch (err) {
					console.log(err);
					return res
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json({ msg: 'request failed due to poor network connection, please try again', err });
				}
				return res
					.status(HttpStatus.OK)
					.json({ msg: 'Password Reset link sent' });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ msg: 'failed to process request', err });
			});
	},

	// update password
	async updatePassword(req, res) {
		const schema = Joi.object().keys({
			currentPassword: Joi.string()
				.min(8)
				.required(),
			newPassword: Joi.string()
				.min(8)
				.required(),
			confirmPassword: Joi.string()
				.valid(Joi.ref('newPassword'))
				.required()
				.options({
					language: { any: { allowOnly: 'must match new password' } }
				})
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: error.details });
		}
		// check for existing user where current password equal
		const userData = await User.findOne({ _id: req.params.id });
		if (!userData) {
			return res
				.status(HttpStatus.NOT_FOUND)
				.json({ msg: 'user does not exist!' });
		}
		// confirm current password
		return bcrypt
			.compare(value.currentPassword, userData.password)
			.then(result => {
				if (!result) {
					return res
						.status(HttpStatus.NOT_FOUND)
						.json({ msg: 'current password is wrong' });
				}
				// encrypt new password
				return bcrypt.hash(value.newPassword, 10, (err, hashedPassword) => {
					if (err) {
						return res
							.status(HttpStatus.BAD_REQUEST)
							.json({ message: 'error hashing password', err });
					}
					User.updateOne(
						{ _id: userData._id },
						{ $set: { password: hashedPassword } }
					)
						.then(updated => {
							res
								.status(HttpStatus.OK)
								.json({ message: 'password updated successfully' });
						})
						.catch(err => {
							res
								.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.json({ msg: 'failed to reset password', err });
						});
				});
			});
	}
};
