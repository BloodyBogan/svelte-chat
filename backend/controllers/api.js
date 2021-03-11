const passport = require('passport');
const multer = require('multer');

const upload = require('../config/multer');

const { host } = require('../config');

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

      const { username, profilePhoto, bio } = user;

      return res.status(201).json({
        success: true,
        message: 'Welcome back',
        user: {
          username,
          profilePhoto,
          bio,
        },
      });
    });
  })(req, res);
};

// @desc  Log out the user
// @route DELETE /api/v1/auth/logout
// @access Private
exports.handleLogOut = (req, res) => {
  req.logout();

  return res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
};

// @desc  Retrieve user's info
// @route POST /api/v1/user
// @access Private
exports.handleUserInfo = (req, res) => {
  const { username, profilePhoto, bio } = req.user;

  return res.status(200).json({
    success: true,
    user: {
      username,
      profilePhoto,
      bio,
    },
  });
};

// @desc  Edit user's bio
// @route PATCH /api/v1/user/bio
// @access Private
exports.handleUserBioEdit = async (req, res) => {
  const { id } = req.user;
  const { bio } = req.body;

  try {
    await User.findByIdAndUpdate({ _id: id }, { bio });

    return res.status(200).json({
      success: true,
      message: 'Bio successfully edited',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'There was an error editing your bio',
    });
  }
};

// @desc  Change user's profile photo
// @route POST /api/v1/user/photo
// @access Private
exports.handleUserPhotoChange = (req, res) => {
  upload(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(422).json({
        success: false,
        message: 'Photo must not be larger than 1MB',
      });
    }

    if (error) {
      return res.status(422).json({
        success: false,
        message: 'You can only upload an image',
      });
    }

    if (!req.file) {
      return res.status(422).json({
        success: false,
        message: 'Please choose an image',
      });
    }

    const { id } = req.user;
    const url = `${host}/uploads/${req.file.filename}`;

    try {
      await User.findByIdAndUpdate({ _id: id }, { profilePhoto: url });

      return res.status(201).json({
        success: true,
        url,
        message: 'Photo successfully changed',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'There was an error',
      });
    }
  });
};
