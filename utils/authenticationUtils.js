// Sample authentication utility functions
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to check if a user is authenticated
const isAuthenticated = (req) => {
  console.log(req.user.role)
    // Implement your authentication logic here
    // For example, you might check for a valid session or token
    return req.user !== undefined; // Replace with your actual check
  };
  
  // Function to verify user roles (e.g., admin, mentor, student)
  const hasRole = (req, role) => {
    // Implement your role verification logic here
    // Check if the user's role matches the required role
    return req.user && req.user.role === role;
  };

  async function comparePasswords(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
// Function to generate a JSON Web Token (JWT)
const generateToken = (user) => {
  // Define your secret key (it should be kept secret and not hard-coded)
  const secretKey = process.env.secretKey;
  const payload = {
    user, // Include the user object in the payload
  };

  // Generate the token with user data and the secret key
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Adjust the expiration as needed
  return token;
 
};



  
  module.exports = {
    isAuthenticated,
    hasRole,
    comparePasswords,
    generateToken
  };
  