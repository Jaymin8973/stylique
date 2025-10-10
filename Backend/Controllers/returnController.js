const Return = require('../Models/Return');

exports.createReturn = async (req, res) => {
  try {
    const returnRequest = await Return.create(req.body);
    res.status(201).json(returnRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReturns = async (req, res) => {
  try {
    const returns = await Return.findAll();
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReturnById = async (req, res) => {
  try {
    const ret = await Return.findByPk(req.params.id);
    if (ret) res.json(ret);
    else res.status(404).json({ error: 'Return request not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReturn = async (req, res) => {
  try {
    const [updated] = await Return.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedReturn = await Return.findByPk(req.params.id);
      res.json(updatedReturn);
    } else {
      res.status(404).json({ error: 'Return request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReturn = async (req, res) => {
  try {
    const deleted = await Return.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Return request deleted' });
    else res.status(404).json({ error: 'Return request not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
