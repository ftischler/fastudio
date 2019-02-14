const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const cloudinary = require('cloudinary');
const Design = require('../models/design.model');
const User = require('../models/user.model');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
	create(req, res) {
		const schema = Joi.object().keys({
			image: Joi.any().required(),
			description: Joi.string().required(),
			category: Joi.string().required(),
			subCategory: Joi.string().required(),
			gender: Joi.string().required(),
			priceWorth: Joi.number().required()
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    cloudinary.v2.uploader.upload(value.image,
      { folder: 'fastudio/designs', use_filename: true },
      async (err, result) => {
        if (err) {
          return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ msg: 'design image upload failed', err });
        }
        const body = {
          designerId: req.user._id,
          designer: req.user.businessname,
          designerEmail: req.user.email,
          designerPhone: req.user.phone,
          designerAddress: req.user.address,
          designerCity: req.user.city,
          designerState: req.user.state,
          designerCountry: req.user.country,
          imgVersion: result.version,
          imgId: result.public_id,
          imgUrl: result.url,
          description: value.description,
          category: value.category,
          subCategory: value.subCategory,
          gender: value.gender,
          priceWorth: value.priceWorth,
          created: Date.now()
        };
        Design.create(body)
        .then(async design => {
          // update users design array
          await User.updateOne(
            { _id: req.user._id },
            { $push: { designs: {
              designId: design._id,
              imgVersion: design.imgVersion,
              imgId: design.imgId,
              imgUrl: design.imgUrl,
              description: design.description,
              category: design.category,
              subCategory: design.subCategory,
              gender: design.gender,
              priceWorth: design.priceWorth,
              created: design.created
              } } }
          );
          res.status(HttpStatus.OK).json({ message: 'Design created', design });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ msg: 'Failed to create design', err });
        });
    });
  },
  // get all designs
  async findAll(req, res) {
    const len = parseInt(req.params.len);
    try {
      const designs = await Design.find({})
      .populate('designerId')
      .sort({ created: -1 })
      .skip(len)
      .limit(20);

      return res.status(HttpStatus.OK).json({ message: 'All Designs found', designs});
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'failed to get designs', err });
    }
  },
  // get all designs for a user
  async findUsersDesign(req, res) {
    const len = parseInt(req.params.len);
    await Design.find({designerId: req.params.id})
    .populate('designerId')
    .sort({ created: -1 })
    .skip(len)
    .limit(20)
    .then(
      designs => res.status(HttpStatus.OK).json({ message: 'Users Designs found', designs})
    )
    .catch(err => {
      res.status(HttpStatus.NOT_FOUND).json({ msg: 'failed to get design', err });
    });
  },
  //get a particular design
  async findOne(req, res) {
    await Design.findOne({ _id: req.params.id })
    .then(design => {
      res.status(HttpStatus.OK).json({ message: 'Design found', design});
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'failed to get design', err });
    });
  },
  // delete design
  async delete(req, res) {
    try {
      const design = await Design.findOneAndDelete({ _id: req.params.id });
      if(!design) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'could not delete design' });
      } else {
        await User.updateOne(
          { _id: req.user._id },
          { $pull: { designs: { designId: design._id } } }
        );
        cloudinary.v2.uploader.destroy(design.imgId,
          (err, result) => {
            console.log(err, result);
          });
        return res.status(HttpStatus.OK).json({ message: 'design deleted successfully' });
      }
    } catch(err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
    }
  },
  // update design
  update(req, res) {
    const schema = Joi.object().keys({
			image: Joi.string().allow(''),
			description: Joi.string().required(),
			category: Joi.string().required(),
			subCategory: Joi.string().required(),
			gender: Joi.string().required(),
			priceWorth: Joi.number().required()
		});
		const { error, value } = Joi.validate(req.body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}
    Design.findOneAndUpdate({ _id: req.params.id }, value, { new: true })
    .then(async updated => {
      await User.updateOne(
        { _id: req.user._id, 'designs.designId': req.params.id },
        { '$set': { 
          'designs.$.description': updated.description,
          'designs.$.category': updated.category,
          'designs.$.subCategory': updated.subCategory,
          'designs.$.gender': updated.gender,
          'designs.$.priceWorth': updated.priceWorth
        } }
      );
      res.status(HttpStatus.OK).json({ message: 'design updated successfully', updated });
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'failed to update design', err });
    });
  }
};
