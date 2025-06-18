const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const register = async (req, res) => {
  const { firstname , lastname , email , password , gender , phone , image } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
         return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ firstname , lastname , email , password , gender , phone , image});

    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports = { register };
