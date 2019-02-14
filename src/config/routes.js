const express = require('express');
const router = express.Router();

const authController = require('../api/controllers/auth.controller');
const userController = require('../api/controllers/user.controller');
const designController = require('../api/controllers/design.controller');
const enquiryController = require('../api/controllers/enquiry.controller');
const feedbackController = require('../api/controllers/feedback.controller');
const passwordController = require('../api/controllers/password.controller');

// Auths
router.post('/registerUser', authController.createUser); //authorization token needed
router.post('/login', authController.login); //authorization token needed

// Designs
router.post('/designs', authController.verifyToken, designController.create);
router.get('/designs/skip=:len', designController.findAll); //authorization token needed
router.get('/designs/:id', designController.findOne); //authorization token needed
router.delete(
	'/designs/:id',
	authController.verifyToken,
	designController.delete
);
router.put('/designs/:id', authController.verifyToken, designController.update);
router.get(
	'/designs/designersId=:id/skip=:len',
	designController.findUsersDesign
); //authorization token needed

// Enquires
router.post('/enquiry', enquiryController.create); //authorization token needed
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
router.get('/users/all/designers', userController.findAll); //authorization token needed
router.get('/users/email/:email', userController.findUserByEmail); //authorization token needed
router.put('/users/:id', authController.verifyToken, userController.update);
router.put(
	'/users/:token',
	authController.validateToken,
	userController.resetPassword
);
router.post('/verifyMe/user/:email', userController.verifyMe); //authorization token needed

// Password
router.post('/forgetPassword', passwordController.forgetPassword); //authorization token needed
router.post(
	'/updatePassword/userId/:id',
	authController.verifyToken,
	passwordController.updatePassword
);

// Feedback
router.post('/feedback', feedbackController.create); //authorization token needed

module.exports = router;
