const mongoose = require('mongoose');

const DesignSchema = mongoose.Schema({
	designerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	designer: {
		type: String,
		default: ''
	},
	designerEmail: {
		type: String,
		default: ''
	},
	designerPhone: {
		type: String,
		default: ''
	},
	designerAddress: {
		type: String,
		default: ''
	},
	designerCity: {
		type: String,
		default: ''
	},
	designerState: {
		type: String,
		default: ''
	},
	designerCountry: {
		type: Object
	},
	imgVersion: {
		type: String,
		default: ''
	},
	imgId: {
		type: String,
		default: ''
	},
	imgUrl: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: String,
		reqired: true
	},
	subCategory: {
		type: String,
		reqired: true
	},
	gender: {
		type: String,
		reqired: true
	},
	priceWorth: {
		type: Number,
		required: true
	},
	created: { type: Date, default: Date.now() }
});
module.exports = mongoose.model('Design', DesignSchema);
