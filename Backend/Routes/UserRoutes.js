const express = require('express');
const router = express.Router();
const { register, login,  forgotpassword, sendOtp, verifyOtp, getUser} = require('../Controllers/UserController');
const authenticate = require('../Middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/otp' , sendOtp );
router.post('/verify-otp', verifyOtp);
router.post('/forgotpassword', forgotpassword);
router.post('/user', getUser);

module.exports = router;
