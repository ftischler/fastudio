const express = require('express');
const router = express.Router();

const authController = require('../api/controllers/auth.controller');
const userController = require('../api/controllers/user.controller');
const designController = require('../api/controllers/design.controller');
const enquiryController = require('../api/controllers/enquiry.controller');
const feedbackController = require('../api/controllers/feedback.controller');
const passwordController = require('../api/controllers/password.controller');

// Auths
router.post('/giveMeAccess', authController.genToken);
router.post('/registerUser', authController.verifyToken, authController.createUser); //public endpoints
router.post('/login', authController.verifyToken, authController.login); //public endpoints

// Designs
router.post('/designs', authController.verifyToken, designController.create);
router.get('/designs/skip=:len', authController.verifyToken, designController.findAll); //public endpoints
router.get('/designs/:id', authController.verifyToken, designController.findOne); //public endpoints
router.delete(
	'/designs/:id',
	authController.verifyToken,
	designController.delete
);
router.put('/designs/:id', authController.verifyToken, designController.update);
router.get(
	'/designs/designersId=:id/skip=:len', authController.verifyToken,
	designController.findUsersDesign
); //public endpoints

// Enquires
router.post('/enquiry', authController.verifyToken, enquiryController.create); //public endpoints
router.put(
	'/enquiry/:id',
	authController.verifyToken,
	enquiryController.update
);
router.delete(
	'/enquiry/:id',
	authController.verifyToken,
	enquiryController.delete
);

// Users
router.get('/users/:id', authController.verifyToken, userController.findUser);
router.get('/users/all/designers', authController.verifyToken, userController.findAll); //public endpoints
router.get('/users/email/:email', authController.verifyToken, userController.findUserByEmail); //public endpoints
router.put('/users/:id', authController.verifyToken, userController.update);
router.put(
	'/users/passwordReset/:token',
	authController.validateToken,
	userController.resetPassword
);
router.post('/verifyMe/user/:email', authController.verifyToken, userController.verifyMe); //public endpoints

// Password
router.post('/forgetPassword', authController.verifyToken, passwordController.forgetPassword); //public endpoints
router.post(
	'/updatePassword/userId/:id',
	authController.verifyToken,
	passwordController.updatePassword
);

// Feedback
router.post('/feedback', authController.verifyToken, feedbackController.create); //public endpoints

module.exports = router;
