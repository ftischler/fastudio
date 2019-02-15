const Joi = require('joi');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const moment = require('moment');
moment.utc().format();
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const User = require('../models/user.model');
const phoneReg = require('../../config/phone_verification')(process.env.TWILIO_VERIFY_API_KEY);

const E_SECRET = process.env.MAIL_TOKEN_SECRET;
const A_SECRET = process.env.API_TOKEN_SECRET;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

module.exports = {
	// verify header token
	verifyToken(req, res, next) {
		const request = req;
		if (!req.headers.authorization) {
			return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized request! Identify yourself');
		}
		const token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized request! Identify yourself');
		}
		const payload = jwt.verify(token, A_SECRET);
		if (!payload) {
			return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized request! Identify yourself');
		}
		// @ts-ignore
		request.user = payload.data;
		next();
	},
	// check token expired
	validateToken(req, res, next) {
		const request = req;
		const token = req.params.token;
		if(!token) {
			return res.status(HttpStatus.FORBIDDEN).json({ msg: 'No token provided' });
		}
		return jwt.verify(token, E_SECRET, (err, decoded) => {
			if(err) {
				if(err.expiredAt < new Date()) {
					return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'URL link has expired, Please try again', err });
				}
				return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Invalid URL link, please try again', err });
			}
			request.payloadData = decoded.data;
			next();
		});
	},
	// generate token for vistors
	genToken(req, res) {
		if(req.body.origin === 'fastudioNG') {
		// configuring jwt
		const payload = { data: req.body };
		const token = jwt.sign(payload, A_SECRET);
		return res
			.status(HttpStatus.OK)
			.json({ message: 'token generated successfully', token});
		} else {
			return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized request! Who are you please?');
		}
	},
	// user registration
	async createUser(req, res, next) {
		const schema = Joi.object().keys({
			firstname: Joi.string().required().trim(),
			lastname: Joi.string().required().trim(),
			businessname: Joi.string().required().trim(),
			email: Joi.string().email({ minDomainAtoms: 2 }).lowercase().required(),
			phone: Joi.number().required(),
			sex: Joi.string().required(),
			dob: Joi.string().required(),
			country: Joi.any().required(),
			state: Joi.string().required().trim(),
			city: Joi.string().required().trim(),
			address: Joi.string().required().trim(),
			password: Joi.string()
				.min(8)
				.required(),
			confirmPassword: Joi.string()
				.valid(Joi.ref('password'))
				.required().options({ language: { any: { allowOnly: 'must match password' } } }),
			oath: Joi.boolean().required()
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ message: error.details });
		}
		// check for existing userEmail
		const userEmail =await User.findOne({ email: value.email });
		if (userEmail) {
			return res
				.status(HttpStatus.CONFLICT)
				.json({ msg: 'Email already exist!' });
		}
		// check for existing businessName
		const businessName =await User.findOne({ businessname: value.businessname });
		if (businessName) {
			return res
				.status(HttpStatus.CONFLICT)
				.json({ msg: 'BusinessName already exist!' });
		}
		// check for existing mobileNumber
		const mobileNumber =await User.findOne({ phone: value.phone });
		if (mobileNumber) {
			return res
				.status(HttpStatus.CONFLICT)
				.json({ msg: 'phone number already exist!' });
		} else {
			//send confirmation mail;
			const recepient = `${'+' + value.country.callingCodes[0] + value.phone}`;
			const country_code = `${'+' + value.country.callingCodes[0]}`;
			const via = 'sms';
			console.log(recepient);

			await phoneReg.requestPhoneVerification(value.phone, country_code, via, function (err, response) {
				if (err) {
					console.log('error creating phone reg request', err);
					return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'An error occur, please check your network and try again', err});
				} else {
					// encrypt password
					return bcrypt.hash(value.password, 10, (err, hash) => {
						if (err) {
							return res
								.status(HttpStatus.BAD_REQUEST)
								.json({ msg: 'error hashing password' });
						}
						const body = {
							firstname: value.firstname,
							lastname: value.lastname,
							businessname: value.businessname,
							email: value.email,
							phone: value.phone,
							sex: value.sex,
							dob: value.dob,
							country: value.country,
							state: value.state,
							city: value.city,
							address: value.address,
							password: hash,
							oath: value.oath,
							subscriptions: {
								start: moment(),
								end: moment().add(360, 'd')
							},
							portfolioUrl: `http://fastudio.com.ng/studio/portfolio/${value.email}/designs`,
							registered: Date.now()
						};
						User.create(body)
						.then( userData => {
							res.json({ message: 'user created successfully', response });
						})
						.catch(err => {
							res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Registeration failed', err});
						});
					});
				}
			});
			// // send verification with twilio
			// await twilio.messages.create({
			// 	to: '+2348139585943',
			// 	from: process.env.TWILIO_NUMBER,
			// 	body:	`Hi ${value.firstname},
			// 	Welcome to Africa's largest online fashion studio. Please click the following link or copy and paste the link into your web browser to verify your account.
			// 	Welcome on board...
			// 	Verification Link: ${url}
			// 	`
			// })
		}
	},
	// user login
	async login(req, res, next) {
		const schema = Joi.object().keys({
			email: Joi.string()
				.lowercase()
				.required()
				.trim(),
			password: Joi.string().required().trim(),
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ message: error.details });
		}
		await User.findOne({ email: value.email })
			.then(userData => {
				if (!userData) {
					return res
						.status(HttpStatus.NOT_FOUND)
						.json({ msg: 'email not found' });
				}
				return bcrypt
					.compare(value.password, userData.password)
					.then(result => {
						if (!result) {
							return res
								.status(HttpStatus.NOT_FOUND)
								.json({ msg: 'wrong password' });
						} else if(userData.isVerify !== true) {
							return res.status(HttpStatus.NOT_FOUND).json({ msg: 'please verify your email address'});
						}
						User.findOneAndUpdate({ email: value.email }, 
							{ '$set': { 
								'lastLogin': Date.now()
							} }, 
							{ new: true });
						// configuring jwt
						const payload = { data: userData };
						const token = jwt.sign(payload, A_SECRET);
						return res
							.status(HttpStatus.OK)
							.json({ message: 'login successful', token, userData });
					});
			})
			.catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'an error occured'}));
	}
};
