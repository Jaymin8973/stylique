const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const generateOTP = require('../utils/otpGenerator');
const nodemailer = require('nodemailer');

const otpStore = {};

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

 const getUser = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

     const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore[email] = { otp, expiresAt };

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <p>Your OTP for password reset is:</p>
                <h2>${otp}</h2>
                <p>This OTP is valid for 5 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: 'OTP not found or expired' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (record.otp != otp) {
    console.log(`OTP mismatch: expected ${record.otp}, received ${otp}`);
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  return res.status(200).json({ message: 'OTP verified successfully' });
}

const forgotpassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required' });
    }

     try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(newPassword, user.password);
            if (isPasswordValid) {
                return res.status(400).json({ message: 'New password cannot be the same as the old password' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            user.password = hashedPassword;
            await user.save();

            delete otpStore[email];

            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    
};

module.exports = { register, login , sendOtp , forgotpassword , verifyOtp , getUser};
