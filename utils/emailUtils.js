// utils/emailUtils.js
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Create a nodemailer transporter with your email service details
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EmailID,
    pass: process.env.password,
  },
});

// Function to send a password reset email
const sendPasswordResetEmail = (user) => {
  // Generate a unique reset token
  const resetToken = jwt.sign({ email: user.email }, process.env.secretKey, { expiresIn: '1h' });

  // Compose the reset email with the token link
  const resetLink = `http://your-frontend-app/reset-password?token=${resetToken}`;

  // Send the reset email
  transporter.sendMail({
    from: process.env.EmailID,
    to: user.email,
    subject: 'Password Reset Request',
    html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
  });
};

module.exports = { sendPasswordResetEmail };
