const { Schema, SchemaTypes, model } = require('mongoose');
const bcrypt = require('bcrypt');
require('mongoose-type-url');

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  profilePhoto: {
    type: SchemaTypes.Url,
  },
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friendRequests: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.password = await bcrypt.hash(this.password, 13);
      this.profilePhoto = `https://api.multiavatar.com/${this.username}.png`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.method('isPasswordValid', async function (password) {
  return bcrypt.compare(password, this.password);
});

module.exports = model('User', UserSchema);
