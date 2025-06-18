const express = require('express');
const router = express.Router();
const { register} = require('../Controllers/UserController');
const authenticate = require('../Middleware/auth');

router.post('/register', register);


module.exports = router;
