// Import necessary modules, such as Ticket model for student-specific operations
const Ticket = require('../models/Ticket');
const autoIncrement = require('mongoose-auto-increment');
const retry = require('retry');
const mongoose = require('mongoose');
const {connectDB} = require('../config/database')

// Controller functions for student operations


exports.getDashboard = async (req, res) => {
  
  try {
    await connectDB();

    const studentName = req.user.userName; // Assuming the student's ID is stored in the user object

    // Fetch the tickets assigned to the current student
    const studentTickets = await Ticket.find({ studentName: studentName });

    

    res.status(200).json({ studentTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching student dashboard', error: error.message });
  }
};
// Create a new ticket
exports.createTicket = async (req, res) => {
  await connectDB();
  const operation = retry.operation({
    retries: 3, // You can adjust the number of retries
    factor: 2,
    minTimeout: 1000, // Minimum timeout between retries in milliseconds
  });
operation.attempt(async (currentAttempt) => {
  try {
    // Retrieve ticket details from the request body
    const { category, subcategory, tags, preferredLanguage, queryTitle, queryDescription, availableTime, studentName, contactNumber, batch } = req.body;

    // Validate request data
    if (!category || !subcategory || !queryTitle || !queryDescription) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    // Create a new ticket and set its properties
    const newTicket = new Ticket({
      category,
      subcategory,
      tags,
      preferredLanguage,
      queryTitle,
      queryDescription,
      createdAt: new Date(), // Set the creation date to the current date and time
      availableTime,
      studentName: req.user.userName,
      contactNumber: req.user.phone,
      batch: req.user.batch,
      assignedTo: '', // Initially unassigned, assign as needed
      solution: '',
      status: 'Open', // You can set the initial status as 'Open'
    });

    // Save the new ticket to the database
    await newTicket.save();

    //console.log(newTicket)

    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ticket creation failed', error: error.message });
  }
});
};
// Retrieve and send the details of a specific ticket
exports.viewTicket = async (req, res) => {
  
  try {
    await connectDB();
    const ticketNumber = req.params.ticketNumber; // This is the only declaration of ticketNumber
    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Extract and send the ticket details to the frontend
    const { queryTitle, queryDescription, assignedTo, status, createdAt } = ticket;

    res.status(200).json({
      ticketNumber, // Include ticketNumber here
      queryTitle,
      queryDescription,
      assignedTo,
      status,
      createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching ticket details', error: error.message });
  }
};


