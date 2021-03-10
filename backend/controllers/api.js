const passport = require('passport');

const User = require('../models/User');

// @desc  Create user's account
// @route POST /api/v1/auth/signup
// @access Public
exports.handleSignUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Account successfully created',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This user already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'There was an error',
    });
  }
};

// @desc  Log the user in
// @route POST /api/v1/auth/login
// @access Public
exports.handleLogIn = (req, res) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('local', (error, user) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'There was an error',
      });
    }

    if (!user) {
      return res.status(422).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(422).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Welcome back',
        user: user.username,
      });
    });
  })(req, res);
};

// @desc  Logs out the user
// @route DELETE /api/v1/auth/logout
// @access Private
exports.handleLogOut = (req, res) => {
  req.logout();

  return res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
};

// @desc  Retrieves user's info
// @route POST /api/v1/user
// @access Private
exports.handleUserInfo = (req, res) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  res.status(200).json({
    success: true,
    user: req.user.username,
  });
