const express = require('express');
const { addAddress, getAddressesbyEmail } = require('../Controllers/AddressController');
const router = express.Router();


router.post('/add', addAddress);
router.post('/get', getAddressesbyEmail);

module.exports = router;