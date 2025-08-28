const { getData, addCard, getCard } = require("../Controllers/PaymentCardController");
const express = require('express');
const router = express.Router();

router.get("/", getData);
router.post("/add", addCard);
router.post("/getCard", getCard);

module.exports = router;