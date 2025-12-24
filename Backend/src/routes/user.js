import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';
import generateOTP from '../utils/otpGenerator.js';
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs';
const router = Router();
const otpStore = {};

// List all users (seller/admin only)
router.get('/', authAny, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const users = await prisma.users.findMany({
      orderBy: { UserID: 'desc' },
      include: { roles: true },
    });

    const mapped = users.map((u) => ({
      id: u.UserID,
      name: u.Username,
      email: u.Email,
      roleName: u.roles?.RoleName || '',
      isActive: Boolean(u.IsActive ?? true),
      createdAt: u.CreatedAt ?? null,
      updatedAt: u.UpdatedAt ?? null,
    }));

    return res.json(mapped);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Toggle user active status (seller/admin only)
router.patch('/:id/toggle-active', authAny, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const UserID = Number(req.params.id);
    const user = await prisma.users.findUnique({ where: { UserID } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updated = await prisma.users.update({
      where: { UserID },
      data: { IsActive: !(user.IsActive ?? true) },
    });

    return res.json({ id: updated.UserID, isActive: Boolean(updated.IsActive ?? true) });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get single user (self or any user if seller/admin)
router.get('/:id', authAny, async (req, res) => {
  try {
    const UserID = Number(req.params.id);

    if (Number(req.user.roleId) !== 2 && Number(req.user.id) !== UserID) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await prisma.users.findFirst({
      where: { UserID },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


router.post('/sendOtp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const userExists = await prisma.users.findFirst({ where: { Email: email } });
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

})



router.post('/verifyOtp', async (req, res) => {
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
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  return res.status(200).json({ message: 'OTP verified successfully' });

})



router.patch('/resetPassword', async (req, res) => {

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const user = await prisma.users.findFirst({ where: { Email: email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(newPassword, user.PasswordHash);
    if (isPasswordValid) {
      return res.status(400).json({ message: 'New password cannot be the same as the old password' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.users.update({
      where: { Email: email },
      data: { PasswordHash: hashedPassword },
    });


    delete otpStore[email];

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }

})
export default router;