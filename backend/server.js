const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet');
const volleyball = require('volleyball');
require('colors');
require('dotenv').config({
  path: path.join(__dirname, 'config', 'config.env'),
});

const {
  production,
  corsOptions,
  sessionOptions,
  mongoStoreSecret,
} = require('./config');
const { connectToDatabase } = require('./config/database');

const app = express();

require('./config/passport')(passport);

app.use(helmet());

app.use(cors(corsOptions));

app.use(volleyball);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

if (production) {
  app.set('trust proxy', 1);
}

sessionOptions.store = new MongoStore({
  mongooseConnection: mongoose.connection,
  secret: mongoStoreSecret,
});

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', require('./routes/api'));

const notFound = (req, res, next) => {
  res.status(404);

  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res) => {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: production ? 'There was an error' : err.stack,
  });
};

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bold
          .magenta
      );
    });
  } catch (err) {
    console.error(`❌ There was an err error: ${err.message}`.bold.red);

    process.exit(1);
  }
};

startServer();
