const mongoose = require('mongoose');

const EnquirySchema = mongoose.Schema({
	design: {
		type: Object,
		default: ''
	},
	client: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		default: ''
	},
	country: {
		type: Object
	},
	phone: {
		type: Number,
		default: ''
	},
	gender: {
		type: String,
		default: ''
	},
	size: {
		type: String,
		default: ''
	},
	address: {
		type: String,
		default: ''
	},
	message: {
		type: String,
		default: ''
	},
	created: { type: Date, default: Date.now() },
	completed: { type: Date },
	closed: {
		type: Boolean,
		default: false
	}
});
module.exports = mongoose.model('Enquiry', EnquirySchema);
