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
// eslint-disable-next-line no-unused-vars
exports.handleLogIn = (req, res) => {};
