const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// Admin-specific routes
router.use(authenticationMiddleware); // Apply authentication middleware to all routes below

router.get('/dashboard', authorizationMiddleware('admin'), adminController.getDashboard);
router.get('/view-tickets/:ticketNumber', authorizationMiddleware('admin'), adminController.viewTickets);
router.post('/create-user',authorizationMiddleware('admin'), adminController.createUser);
router.post('/assign-ticket/:ticketNumber', authorizationMiddleware('admin'), adminController.assignTicket);
router.get('/view-user', authorizationMiddleware('admin'), adminController.viewUser);



module.exports = router;
