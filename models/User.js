const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'target',
});

UserSchema.virtual('nFollowers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'target',
  count: true,
});

UserSchema.virtual('following', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('nFollowing', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'user',
  count: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
