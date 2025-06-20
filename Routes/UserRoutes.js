const express = require('express');
const router = express.Router();
const { register, login,  forgotpassword, sendOtp} = require('../Controllers/UserController');
const authenticate = require('../Middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/otp' , sendOtp );
router.post('/forgotpassword', forgotpassword);

module.exports = router;
