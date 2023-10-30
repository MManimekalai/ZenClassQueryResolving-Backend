const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: Number,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: String,
  tags: [String],
  preferredLanguage: String,
  queryTitle: {
    type: String,
    required: true,
  },
  queryDescription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  availableTime: String,
  attachments: [
    {
      url: String, // Store the URL or path to the attachment
      size: {
        type: Number,
        validate: {
          validator: function (value) {
            return value <= 5 * 1024 * 1024; // 5MB in bytes
          },
          message: 'Attachment size should be less than 5MB',
        },
      },
      type: {
        type: String,
        validate: {
          validator: function (value) {
            // Ensure that the file type is one of the allowed types
            return /^image\/(jpeg|jpg|png)$/.test(value);
          },
          message: 'Attachment type should be .jpg, .jpeg, or .png',
        },
      },
    },
   ],
  studentName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  batch: String,// This field may contain the username or ID of the assigned mentor
  assignedTo: { type: String, default: 'unassigned' },
  isAssigned: {
    type: Boolean,
    default: false,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  solution: String,
  status: { type: String, default: 'Open' },
  closedAt: {
    type: Date,
    default: Date.now,
  },

});

// Apply the auto-increment plugin to the schema
autoIncrement.initialize(mongoose.connection);
ticketSchema.plugin(autoIncrement.plugin, {
  model: 'Ticket',
  field: 'ticketNumber',
  startAt: 1, // The initial ticket number
  incrementBy: 1, // Increment by 1 for each new ticket
})


const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

