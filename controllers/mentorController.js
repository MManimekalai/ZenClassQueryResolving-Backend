// Import necessary modules, such as Ticket model for mentor-specific operations
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const {connectDB} = require('../config/database')

// Controller functions for mentor operations
exports.getDashboard = async (req, res) => {
  
  try {
    await connectDB();

    // Fetch all tickets assigned to the mentor
    const mentorName = req.user.userName; // Assuming you store the mentor's ID in the user object

    const tickets = await Ticket.find({ assignedTo: mentorName });

    // Extract the necessary fields for the mentor's dashboard table
    const tableData = tickets.map((ticket) => {
      return {
        Category: ticket.category,
        Subcategory: ticket.subcategory,
        Tags: ticket.tags.join(', '),
        PreferredLanguage: ticket.preferredLanguage,
        QueryTitle: ticket.queryTitle,
        QueryDescription: ticket.queryDescription,
        CreatedAt: ticket.createdAt,
        AvailableTime: ticket.availableTime,
        StudentName: ticket.studentName,
        ContactNumber: ticket.contactNumber,
        Batch: ticket.batch,
        Status: ticket.status,
        Solution: ticket.solution,
      };
    });

    res.status(200).json({ message: 'Mentor dashboard data fetched successfully', tableData });
    //console.log(tableData)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mentor dashboard data', error: error.message });
  }
};

exports.viewTickets = async (req, res) => {
  
  try {
    await connectDB();

    // Fetch all tickets assigned to the mentor
    const mentorId = req.user.id; // Assuming you store the mentor's ID in the user object

    const tickets = await Ticket.find({
      $or: [
        { assignedTo: { $exists: false } },  // Check if assignedTo does not exist
        { assignedTo: '' },                  // Check if assignedTo is an empty string
      ]
    });

    // You can process and return the list of tickets assigned to the mentor
    res.status(200).json({ message: 'Mentor tickets fetched successfully', tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mentor tickets', error: error.message });
  }
};

// Controller method for resolving a ticket
exports.resolveTicket = async (req, res) => {
  try {
    await connectDB();
    const  ticketNumber  = req.params;
    const  solution  = req.body;

    // Find the ticket by its ID
    const ticket = await Ticket.findOne(
      { ticketNumber: ticketNumber })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Ensure that only assigned tickets can be resolved by the assigned mentor
    if (ticket.assignedTo !== req.user.userName) {
      return res.status(403).json({ message: 'You are not authorized to resolve this ticket' });
    }

    // Check if the ticket is already resolved
    if (ticket.isResolved) {
      return res.status(400).json({ message: 'This ticket is already resolved' });
    }

    // Validate the solution
    if (!validateSolution(solution)) {
      return res.status(400).json({ message: 'Invalid solution format or length' });
    }

    // Update the ticket to mark it as resolved and set the solution
    ticket.isResolved = true;
    ticket.solution = solution;

    // Save the updated ticket
    await ticket.save();

    res.status(200).json({ message: 'Ticket resolved successfully', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ticket resolution failed', error: error.message });
  }
};

function validateSolution(solution) {
  connectDB()
  // Check if the solution is a non-empty string
  if (typeof solution !== 'string' || solution.trim() === '') {
    return false; // Solution is empty or not a string
  }

  // Check if the solution meets a minimum length requirement (e.g., at least 10 characters)
  if (solution.length < 10) {
    return false; // Solution is too short
  }

  // If the solution passes all checks, it's considered valid
  return true;
}

// Take and resolve a ticket
exports.takeAndResolveTicket = async (req, res) => {
  
  try {
    await connectDB();

    const  ticketNumber  = req.params.ticketNumber;
    const  solution  = req.body.solution;

    // Update the ticket to mark it as resolved and set the solution
    const ticket = await Ticket.findOneAndUpdate(
      { ticketNumber: ticketNumber },
      {
        isResolved: true,
        solution,
        status: "closed",
        },
      { new: true }
    );

    res.status(200).json({ message: 'Ticket resolved successfully', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ticket resolution failed', error: error.message });
  }
};

// Controller method for viewing the details of a particular ticket
exports.viewTicket = async (req, res) => {
  
  try {
    await connectDB();

    const ticketNumber = req.params.ticketNumber;

    // Fetch the ticket details
    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // You can return the ticket details to the mentor
    res.status(200).json({ message: 'Ticket details fetched successfully', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching ticket details', error: error.message });
  }
};

exports.viewAssignedTickets = async (req, res) => {
  try {
    await connectDB();

    // Fetch all tickets assigned to the mentor
    const mentorName = req.user.userName; // Assuming you store the mentor's username in the user object

    const tickets = await Ticket.find({ assignedTo: mentorName });

    // You can process and return the list of tickets assigned to the mentor
    res.status(200).json({ message: 'Mentor tickets fetched successfully', tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mentor tickets', error: error.message });
  }
};
