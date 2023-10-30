const { isAuthenticated, hasRole } = require('../utils/authenticationUtils'); // Import your utility functions

module.exports = (role) => {
  return (req, res, next) => {
    console.log('Inside authentication middleware');
    
    // Check if the user is authenticated
    if (!isAuthenticated(req)) {
      console.log('User is not authenticated');
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if the user has the required role
    if (!hasRole(req, role)) {
      console.log('User role does not match expected role');
      return res.status(403).json({ message: 'Forbidden' });
      }
    
    // If the user is authenticated and has the required role, proceed to the next middleware or route handler
    next();
  };
};
