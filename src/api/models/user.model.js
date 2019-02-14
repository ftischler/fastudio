const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	imgId: {
		type: String,
		default: ''
	},
	imgVersion: {
		type: String,
		default: ''
	},
	imgUrl: {
		type: String,
		default: ''
	},
	firstname: {
		type: String,
		required: true,
		trim: true
	},
	lastname: {
		type: String,
		required: true,
		trim: true
	},
	businessname: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		trim: true
	},
	phone: {
		type: Number,
		required: true
	},
	sex: {
		type: String,
		required: true
	},
	dob: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	oath: {
		type: Boolean,
		required: true
	},
	designs: [
		{
			designId: { type: mongoose.Schema.Types.ObjectId, ref: 'Design' },
			imgId: { type: String },
			imgVersion: { type: String },
			imgUrl: { type: String },
			description: { type: String },
			category: { type: String },
			subCategory: { type: String },
			gender: { type: String },
			priceWorth: { type: Number },
			created: { type: Date, default: Date.now() }
		}
	],
	enquiries: [
		{
			enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
			client: { type: String },
			email: { type: String },
			country: { type: Object },
			phone: { type: String },
			gender: { type: String },
			size: { type: Number },
			address: { type: String },
			message: { type: String },
			design: { type: Object },
			created: { type: Date, default: Date.now() },
			completed: { type: Date },
			closed: { type: Boolean, default: false }
		}
	],
	subscriptions: [
		{
			start: { type: Date },
			end: { type: Date }
		}
	],
	country: {
		type: Object
	},
	notice: {
		type: String,
		default: 'Welcome to Fastudio, feel free to contact the team regarding any issues. Thanks'
	},
	portfolioUrl: {
		type: String,
		default: ''
	},
	registered: {
		type: Date,
		default: Date.now()
	},
	lastLogin: {
		type: Date
	},
	isVerify: {
		type: Boolean,
		default: false
	}
});
module.exports = mongoose.model('User', UserSchema);
