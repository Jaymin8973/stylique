const express = require('express');
const router = express.Router();
const { register, login} = require('../Controllers/UserController');
const authenticate = require('../Middleware/auth');

router.post('/register', register);
router.post('/login', login);


module.exports = router;
