const mongoose = require('mongoose');
require('dotenv').config();

// Replace the connection string with your actual database connection URI from the environment variables
const dbURI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, // To prevent deprecation warnings
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

const db = mongoose.connection

// Event handlers for database connection
db.on('connected', () => {
  console.log(`Connected to the database: ${dbURI}`);
});

db.on('error', (err) => {
  console.error(`Database connection error: ${err}`);
  // In a production environment, you may consider more advanced error handling and application shutdown.
});

db.on('disconnected', () => {
  console.log('Database connection disconnected');
  // In a production environment, you might want to implement automatic reconnection logic here.
});

// Graceful termination on SIGINT
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Database connection terminated');
    process.exit(0);
  });
});

// Graceful termination on application exit
process.on('exit', () => {
  db.close(() => {
    console.log('Database connection closed on application exit');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}\nReason: ${reason}`);
  // In a production environment, you may want to take more appropriate actions.
});

module.exports = {db, connectDB};
