const PaymentCard = require("../Models/PaymentCard");
const User = require("../Models/User");


exports.getData = async (req, res) => {
  try {
    const paymentCards = await PaymentCard.findAll();
    res.json(paymentCards);
  } catch (error) {
    console.error('Error fetching payment cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCard = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const paymentCard = await PaymentCard.findAll({ where: { user_id: user.user_id } });
    console.log(paymentCard);
    res.json(paymentCard);
  } catch (error) {
    console.error('Error fetching payment cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.addCard = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { cardNumber, cardHolderName, expirationDate, cvv } = req.body;
    const newCard = await PaymentCard.create({
      user_id: user.user_id,
      cardNumber,
      cardHolderName,
      expirationDate,
      cvv
    });
    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error adding payment card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
