const assert = require('assert');
const mongoose = require('mongoose');

const { mongooseOptions } = require('.');

const { MONGODB_URI } = process.env;

assert(MONGODB_URI, 'MONGODB_URI is required!');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);

    console.log('✨ Successfully connect to MongoDB'.bold.yellow);
  } catch (err) {
    console.error(
      `❌ There was an error connecting to MongoDB: ${err.message}`.bold.red
    );

    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    console.log('✅ Successfully connected to the database'.bold.green);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ There was a database error: ${err.message}`.bold.red);

    mongoose.connection.close(() => {
      console.log('ℹ️ Database connection closed'.bold.blue);

      process.exit(1);
    });
  });

  mongoose.connection.on('disconnected', () => {
    console.log('ℹ️ Database connection closed'.bold.blue);

    process.exit(0);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('ℹ️ Database connection closed'.bold.blue);

      process.exit(0);
    });
  });
};

module.exports = {
  connectToDatabase,
};
