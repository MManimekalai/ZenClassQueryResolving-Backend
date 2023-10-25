// Import necessary modules, such as Ticket and User models for admin-specific operations
const Ticket = require('../models/Ticket');
const User = require('../models/User');
require('dotenv').config();
const {connectDB} = require('../config/database')


// Controller function for getting the admin dashboard data
exports.getDashboard = async (req, res) => {
  try {
    await connectDB();

    // Fetch all tickets from the database
    const tickets = await Ticket.find();

    // Extract the necessary fields for the admin dashboard table
    const tableData = tickets.map((ticket) => {
      return {
        Category: ticket.category,
        Subcategory: ticket.subcategory,
        Tags: ticket.tags.join(', '),
        PreferredLanguage: ticket.preferredLanguage,
        QueryTitle: ticket.queryTitle,
        QueryDescription: ticket.queryDescription,
        CreatedAt: ticket.createdAt,
        AvailableTime: {
          From: ticket.availableTime.from,
          Till: ticket.availableTime.till,
        },
        StudentName: ticket.studentName,
        ContactNumber: ticket.contactNumber,
        Batch: ticket.batch,
        AssignedTo: {
          MentorId: ticket.assignedTo,
          MentorName: ticket.assignedMentorName,
        },
        Status: ticket.status,
        Solution: {
          Medium: ticket.solution,
          Description: ticket.solutionDescription,
        },
      };
    });

    res.status(200).json({ message: 'Admin dashboard data fetched successfully', tableData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admin dashboard data', error: error.message });
  }
};

// Controller method for viewing all tickets
exports.viewTickets = async (req, res) => {
  try {
    await connectDB();

    // Fetch all tickets from the database
    const tickets = await Ticket.find();
    res.status(200).json({ message: 'Tickets fetched successfully', tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

// Controller method for creating a new user
exports.createUser = async (req, res) => {
  await connectDB();
  // Check if the requesting user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permission denied.' });
  }

  // Create a new user
  const newUser = new User({
    userName: req.body.userName,
    password: req.body.password,
    role: req.body.role,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    batch: req.body.batch,
    // Add other user properties as needed
  });

  try {
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'User creation failed', error: error.message });
  }
};

// Controller method for assigning a ticket to a mentor
exports.assignTicket = async (req, res) => {

  try {
    await connectDB();;
    const ticketNumber = req.params.ticketNumber;
    const mentorName = req.body.userName; // Assuming it's directly in the request body
    // console.log("mentor", mentorName)
    // Check if the mentor ID is valid
    const mentor = await User.findOne({ userName: mentorName });
  
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(400).json({ message: 'Invalid mentor ID.' });
    }

    // Update the ticket to mark it as assigned and set the assigned mentor
    const ticket = await Ticket.findOneAndUpdate(
      { ticketNumber: ticketNumber }, // Query based on ticket number
      {
        assignedTo: mentorName,
        status: 'Assigned',
        assignedMentorName: mentor.userName,
        isAssigned: true,
      },
      { new: true }
    );
    

    res.status(200).json({ message: 'Ticket assigned successfully', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ticket assignment failed', error: error.message });
  }
};


// Controller method for viewing all users
exports.viewUser = async (req, res) => {
  await connectDB();
  try {
    // Fetch all tickets from the database
    const users = await User.find();
    res.status(200).json({ message: 'User data fetched successfully', users });
    // console.log(users)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};