const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const register = async (req, res) => {
  const { firstname, lastname, email, password, gender, phone, image } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword, gender, phone, image });

    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    try {
      if (userExists) {
        try {
          const isPasswordValid = await bcrypt.compare(password, userExists.password);
          if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }
        } catch (error) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        }
        jwt.sign(
          { userId: userExists.id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
            if (err) {
              return res.status(500).json({ error: 'Error generating token' });
            }
            return res.status(200).json({ message: 'Login successful', token });
          }
        );

      }
      else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.log(error);
    }




  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports = { register, login };
