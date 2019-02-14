const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
	name: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		default: ''
	},
	tel: {
		type: Number,
		default: ''
	},
	message: {
		type: String,
		default: ''
	},
	created: { type: Date, default: Date.now() },
});
module.exports = mongoose.model('Feedback', FeedbackSchema);
