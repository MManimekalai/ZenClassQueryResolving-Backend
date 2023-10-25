const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();


const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  batch: {
    type: String,
    required: true,
  },
  qualification: String,
  yearOfPassing: Number,
  yearsOfExperience: Number,
  noticePeriod: String,
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }

}, { collection: 'users' } );

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;

