const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// Mentor-specific routes
router.use(authenticationMiddleware); // Apply authentication middleware to all routes below

router.get('/dashboard', authorizationMiddleware('mentor'), mentorController.getDashboard);
router.get('/view-tickets', authorizationMiddleware('mentor'), mentorController.viewTickets);
router.put('/resolve-ticket/:ticketNumber',  authorizationMiddleware('mentor'), mentorController.resolveTicket);
router.post('/take-and-resolve-ticket/:ticketNumber', authorizationMiddleware('mentor'), mentorController.takeAndResolveTicket);
router.get('/view-ticket/:ticketNumber', authorizationMiddleware('mentor'), mentorController.viewTicket);
router.get('/assigned-tickets', authorizationMiddleware('mentor'), mentorController.viewAssignedTickets);


module.exports = router;
