// eslint-disable-next-line no-unused-vars
const bcrypt = require('bcrypt');

// eslint-disable-next-line no-unused-vars
const User = require('../models/User');

// @desc  Create user's account
// @route POST /api/v1/auth/signup
// @access Public
// eslint-disable-next-line no-unused-vars
exports.handleSignUp = (req, res) => {
  res.json(req.body);
};

// @desc  Log the user in
// @route POST /api/v1/auth/login
// @access Public
// eslint-disable-next-line no-unused-vars
exports.handleLogIn = (req, res) => {};
