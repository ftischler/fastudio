const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const User = require('../models/user.model');
const Enquiry = require('../models/enquiry.model');

module.exports = {
	create(req, res) {
		const schema = Joi.object().keys({
			name: Joi.string().required().trim(),
			email: Joi.any().allow(''),
			country: Joi.any().required(),
			phone: Joi.number().required(),
			gender: Joi.string().required(),
			size: Joi.number().required(),
			address: Joi.string().required().trim(),
			message: Joi.string().required().trim()
		});
		const { error, value } = Joi.validate(req.body.enquiry, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}
		const body = {
			design: req.body.design,
			client: value.name,
			email: value.email,
			country: value.country,
			phone: value.phone,
			gender: value.gender,
			size: value.size,
			address: value.address,
			message: value.message,
			created: Date.now()
		};
		Enquiry.create(body)
			.then(async enquiry => {
				// update users design array
				await User.updateOne(
					{ _id: req.body.design.designerId },
					{
						$push: {
							enquiries: {
								enquiryId: enquiry._id,
								client: enquiry.client,
								design: {
									designId: enquiry.design.designId,
									imgUrl: enquiry.design.imgUrl,
									description: enquiry.design.description,
									category: enquiry.design.category,
									priceWorth: enquiry.design.priceWorth
								},
								email: enquiry.email,
								country: enquiry.country,
								phone: enquiry.phone,
								gender: enquiry.gender,
								size: enquiry.size,
								address: enquiry.address,
								message: enquiry.message,
								created: enquiry.created
							}
						}
					}
				);
				res
					.status(HttpStatus.OK)
					.json({ message: 'enquiry submitted', enquiry });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ msg: 'Failed to process enquiry request', err });
			});
	},
	// close enquiry
	update(req, res) {
		const schema = Joi.object().keys({
			closed: Joi.boolean().required()
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}
		Enquiry.findOneAndUpdate({ _id: req.params.id }, 
			{ '$set': { 
				'closed': value.closed,
				'completed': Date.now()
			} }, 
			{ new: true })
			.then(async updated => {
				await User.updateOne(
					{ _id: req.user._id, 'enquiries.enquiryId': req.params.id },
					{ '$set': { 
						'enquiries.$.closed': value.closed,
						'enquiries.$.completed': updated.completed
					} }
				);
				res.status(HttpStatus.OK).json({ message: 'enquiry closed successfully', updated });
			})
			.catch(err => {
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'failed to close enquiry', err });
			});
	},
	// delete design
  async delete(req, res) {
    try {
      const result = await Enquiry.findOneAndDelete({ _id: req.params.id });
      if(!result) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'could not delete enquiry' });
      } else {
        await User.updateOne(
          { _id: req.user._id },
          { $pull: { enquiries: { enquiryId: result._id } } }
        );
        return res.status(HttpStatus.OK).json({ message: 'enquiry deleted successfully' });
      }
    } catch(err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
    }
  },
};
