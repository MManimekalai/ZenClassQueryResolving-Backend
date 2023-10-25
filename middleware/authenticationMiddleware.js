const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify the token
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split('  ')[1];
  //console.log(authHeader)
  //console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    req.user = decoded.user;
    //console.log(decoded.user); // Log the decoded user
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
