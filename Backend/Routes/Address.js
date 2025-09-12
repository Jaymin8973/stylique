const express = require('express');
const { addAddress, getAddressesbyEmail, UpdateSelected } = require('../Controllers/AddressController');
const router = express.Router();


router.post('/add', addAddress);
router.post('/get', getAddressesbyEmail);
router.put('/updateSelected', UpdateSelected);

module.exports = router;