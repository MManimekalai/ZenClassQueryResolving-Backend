const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// Student-specific routes
router.use(authenticationMiddleware); // Apply authentication middleware to all routes below

router.get('/dashboard', authorizationMiddleware('student'), studentController.getDashboard);
router.post('/create-ticket', authorizationMiddleware('student'), studentController.createTicket);
router.get('/tickets/:ticketNumber', authorizationMiddleware('student'), studentController.viewTicket);


module.exports = router;
