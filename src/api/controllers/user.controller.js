const Joi = require('joi');
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const phoneReg = require('../../config/phone_verification')(process.env.TWILIO_VERIFY_API_KEY);
const User = require('../models/user.model');
const Design = require('../models/design.model');

module.exports = {
	// get all designers
	async findAll(req, res) {
    try {
			const designers = await User.find({}, {password: 0, dob: 0, enquiries: 0,})
      .sort({ registered: -1 });

      return res.status(HttpStatus.OK).json({ message: 'All Designers found', designers});
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'failed to get designers', err });
    }
  },
	//get a particular user
	async findUser(req, res) {
		await User.findOne({ _id: req.params.id })
			.then(user => {
				res.status(HttpStatus.OK).json({ message: 'User found', user });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ msg: 'failed to get user', err });
			});
	},
	//get a user by email
	async findUserByEmail(req, res) {
		await User.findOne({ email: req.params.email }, {password: 0, dob: 0, enquiries: 0,})
			.then(user => {
				res.status(HttpStatus.OK).json({ message: 'User found', user });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ msg: 'failed to get user', err });
			});
	},

	// reset password
	async resetPassword(req, res) {
		const schema = Joi.object().keys({
			newPassword: Joi.string()
				.min(8)
				.required().trim(),
			confirmPassword: Joi.string()
				.valid(Joi.ref('newPassword'))
				.required()
				.options({
					language: { any: { allowOnly: 'must match new password' } }
				}).trim()
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: error.details });
		}
		// check for existing user
		const userData = await User.findOne({ _id: req.payloadData });
		if (!userData) {
			return res
				.status(HttpStatus.NOT_FOUND)
				.json({ msg: 'user does not exist!' });
		}
		// encrypt password
		return bcrypt.hash(value.newPassword, 10, (err, hashedPassword) => {
			if (err) {
				return res
					.status(HttpStatus.BAD_REQUEST)
					.json({ message: 'error hashing password', err });
			}
			User.findOneAndUpdate(
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
	},

	// verify user
	async verifyMe(req, res) {
		const schema = Joi.object().keys({
			token: Joi.number().required(),
			phone: Joi.number().required(),
			country: Joi.any().required(),
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ message: error.details });
		}
		const country_code = `${'+' + value.country.callingCodes[0]}`;
		await phoneReg.verifyPhoneToken(value.phone, country_code, value.token, function (err, response) {
			if (err) {
				console.log('error creating phone reg request', err);
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'An error occur, please try again', err });
			} else {
				console.log('Confirm phone success confirming code: ', response);
				if (response.success) {
					return User.findOneAndUpdate({ phone: value.phone }, 
						{ '$set': { 
							'isVerify': true
						} }, 
						{ new: true })
						.then( user => {
							res.status(HttpStatus.OK).json({ msg: 'Account verified successfully', user });
						})
						.catch(err => {
							res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'verification failed', err });
						});
				}
				res.status(200).json(err);
			}
		});	
	},

	// update profile
  update(req, res) {
    const schema = Joi.object().keys({
			state: Joi.string().required(),
			city: Joi.string().required(),
			phone: Joi.number().required(),
			address: Joi.string().required(),
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}
		User.findOneAndUpdate({ _id: req.params.id },
			{ '$set': { 
				'state': value.state,
				'city': value.city,
				'phone': value.phone,
				'address': value.address,
			} }
			)
    .then(async updated => {
      await Design.updateMany(
        { designerId: updated._id },
        { '$set': { 
          'designerState': updated.state,
          'designerCity': updated.city,
          'designerPhone': updated.phone,
          'designerAddress': updated.address
        } }
      );
      res.status(HttpStatus.OK).json({ message: 'profile updated successfully', updated });
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'failed to update profile', err });
    });
  }
};
