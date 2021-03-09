const { Schema, SchemaTypes, model } = require('mongoose');
const bcrypt = require('bcrypt');
const getRandomAvatar = require('seedable-random-avatar-generator');
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
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.password = await bcrypt.hash(this.password, 13);
      this.profilePhoto = getRandomAvatar(this.username);
    }

    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.isPasswordValid = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = model('User', UserSchema);
