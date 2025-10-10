const Notification = require('../Models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) res.json(notification);
    else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const [updated] = await Notification.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedNotification = await Notification.findByPk(req.params.id);
      res.json(updatedNotification);
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Notification deleted' });
    else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
