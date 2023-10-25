// Middleware to check user roles and permissions
module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If the user's role matches the expected role, proceed to the next middleware or route handler
    next();
  };
};
