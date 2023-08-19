const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

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
      select: false,
    },
    tokens: {
      type: [String],
      select: false,
    },
    image: {
      type: String, // url to s3 bucket
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};

UserSchema.methods.noPass = function () {
  const user = this.toObject();
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

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
