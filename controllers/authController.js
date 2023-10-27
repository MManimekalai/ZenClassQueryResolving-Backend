const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { sendPasswordResetEmail } = require('../utils/emailUtils');
const mongoose = require('mongoose');
const {connectDB} = require('../config/database')



require('dotenv').config();


// Import necessary modules, such as User model for authentication
const User = require('../models/User');
const authenticationUtils = require('../utils/authenticationUtils');

// Controller functions for authentication
exports.register = async (req, res) => {
  try {
    await connectDB();
    const { userName, password, role } = req.body;
    // Check if a user with the same userName already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this userName already exists.' });
    }

    // Create a new user
    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      role: req.body.role,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      batch: req.body.batch,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'User registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { userName, password } = req.body;
  //console.log(process.env.MONGODB_URI)

  try {
    await connectDB();
    // Find the user by userName  

    //console.log('Searching for user with userName:', userName);
    const user = await User.findOne({ userName: req.body.userName }); // Replace 'admin1' with the actual userName you are searching for
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await authenticationUtils.comparePasswords(password, user.password);

    //console.log("isPasswordValid", isPasswordValid)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

  
    // Create and send a token for authentication (JWT or any other method)
    const token = authenticationUtils.generateToken(user);
    const role = user.role;
    const userName = user.userName  
    const uID = user._id 

    res.status(200).json({ message: 'Login successful', token, userName, role, uID});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const  email  = req.body.email; // Assuming email is sent in the request body
  try {
    await connectDB();
    // Look up the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the email utility function to send a password reset email
    sendPasswordResetEmail(user);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Password reset request failed', error: error.message });
  }
};


exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

  try {
    await connectDB();

    // Verify and decode the reset token
    const decodedToken = jwt.verify(token, process.env.secretKey);
    
    // Find the user based on the email in the token
    const user = await User.findOne({ email: decodedToken.user.email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid reset token' });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user with the new password
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
};
