const app = require('./app');
const dotenv = require('dotenv');
const connectToDb = require('./config/database');
dotenv.config({ path: '../backend/config/config.env' });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: ', err.message);
  console.log('Closing server...');
  server.close(() => {
    process.on('exit', function (code) {
      console.log('Server closed with code:', code);
    });
    process.exit(1);
  });
});

// Connect to MongoDB
connectToDb();

const server = app.listen(process.env.PORT, () => {
  console.log('Server started at port ' + process.env.PORT);
});

// Unhandled promise rejection error handling
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED PROMISE REJECTION ERROR: ', err.message);
  console.log('Closing server...');

  server.close(() => {
    process.on('exit', function (code) {
      console.log('Server closed with code:', code);
    });
    process.exit(1);
  });
});
