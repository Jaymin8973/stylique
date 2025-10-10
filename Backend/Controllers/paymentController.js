const Payment = require('../Models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (payment) res.json(payment);
    else res.status(404).json({ error: 'Payment not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const [updated] = await Payment.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedPayment = await Payment.findByPk(req.params.id);
      res.json(updatedPayment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Payment deleted' });
    else res.status(404).json({ error: 'Payment not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
