/* eslint-disable eqeqeq */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
const path = require('path');
const fs = require('fs');
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

    // eslint-disable-next-line consistent-return
    req.logIn(user, async (err) => {
      if (err) {
        return res.status(422).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // eslint-disable-next-line object-curly-newline
      const { username, profilePhoto, bio, friends, friendRequests } = user;

      let usersFriends = friends;

      try {
        if (friends.length > 0) {
          usersFriends = await User.find(
            { _id: friends },
            {
              _id: 0,
              username: 1,
              profilePhoto: 1,
              bio: 1,
            }
          );
        }

        return res.status(201).json({
          success: true,
          message: 'Welcome back',
          user: {
            username,
            profilePhoto,
            bio,
            friends: usersFriends,
            friendRequests,
          },
        });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: 'Something went wrong',
        });
      }
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
exports.handleUserInfo = async (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { username, profilePhoto, bio, friends, friendRequests } = req.user;

  try {
    let usersFriends = friends;

    if (friends.length > 0) {
      usersFriends = await User.find(
        { _id: friends },
        {
          _id: 0,
          username: 1,
          profilePhoto: 1,
          bio: 1,
        }
      );
    }

    return res.status(200).json({
      success: true,
      user: {
        username,
        profilePhoto,
        bio,
        friends: usersFriends,
        friendRequests,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
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
      message: 'There was an error',
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
      const user = await User.findById({ _id: id });

      const filenameArray = user.profilePhoto.split('/');
      const filename = filenameArray[filenameArray.length - 1];

      fs.unlink(
        path.join(__dirname, '..', 'public', 'uploads', `${filename}`),
        () => {}
      );

      user.profilePhoto = url;

      await user.save();

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

// @desc  Send friend request
// @route POST /api/v1/user/friends
// @access Private
// eslint-disable-next-line consistent-return
exports.handleAddFriend = async (req, res) => {
  const { id } = req.user;
  const { searchValue } = req.body;

  try {
    const friend = await User.findOne({ username: searchValue });
    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "User with that username doesn't exist",
      });
    }

    const user = await User.findById({ _id: id });
    if (
      // eslint-disable-next-line no-underscore-dangle
      user.friends.some((f) => f._id == friend._id) ||
      // eslint-disable-next-line no-underscore-dangle
      friend.friends.some((f) => f._id == id)
    ) {
      return res.status(422).json({
        success: false,
        message: 'You are friends already',
      });
    }

    // eslint-disable-next-line no-underscore-dangle
    // eslint-disable-next-line eqeqeq
    if (user.friendRequests.some((request) => request._id == friend._id)) {
      return res.status(422).json({
        success: false,
        message: 'This user has already sent you a friend request',
      });
    }

    // eslint-disable-next-line no-underscore-dangle
    if (friend.friendRequests.some((request) => request._id == id)) {
      return res.status(422).json({
        success: false,
        message: 'You have sent friend request to this user already',
      });
    }

    // eslint-disable-next-line no-underscore-dangle
    friend.friendRequests.push({ _id: user._id, username: user.username });

    await friend.save();

    res.status(201).json({
      success: true,
      message: 'Friend request sent',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'There was an error',
    });
  }
};

// @desc  Accept friend request
// @route POST /api/v1/user/friends/accept
// @access Private
exports.handleAcceptFriendRequest = async (req, res) => {
  const { id } = req.user;
  const { _id } = req.body;

  try {
    const user = await User.findById({ _id: id });
    user.friendRequests = user.friendRequests.filter(
      // eslint-disable-next-line no-underscore-dangle
      (request) => request._id != _id
    );
    user.friends.push({ _id });

    const friend = await User.findById({ _id });
    friend.friends.push({ _id: id });

    await user.save();
    await friend.save();

    res.status(201).json({
      success: true,
      message: 'Friend request accepted',
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: 'There was an error',
    });
  }
};

// @desc  Decline friend request
// @route POST /api/v1/user/friends/decline
// @access Private
exports.handleDeclineFriendRequest = async (req, res) => {
  const { id } = req.user;
  const { _id } = req.body;

  try {
    const user = await User.findById({ _id: id });
    user.friendRequests = user.friendRequests.filter(
      (request) => request._id != _id
    );

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Friend request declined',
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: 'There was an error',
    });
  }
};
