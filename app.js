// Import Express and other necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

require('dotenv').config();



// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name for the stored file
  },
});

// Initialize multer with the storage settings
const upload = multer({ storage: storage });

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Include your route files
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use the routes in your Express app
app.use('/auth', authRoutes); // Example base URL: '/auth'
app.use('/student', studentRoutes); // Example base URL: '/student'
app.use('/mentor', mentorRoutes); // Example base URL: '/mentor'
app.use('/admin', adminRoutes); // Example base URL: '/admin'
app.use('/uploads', express.static('uploads'));


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
