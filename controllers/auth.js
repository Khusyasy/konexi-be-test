require('dotenv').config();
const jwt = require('jsonwebtoken');

const { formatRes } = require('../utils/response');
const User = require('../models/User');

/** @type {import("express").RequestHandler} */
module.exports.login = async function (req, res, next) {
  try {
    const { username, password } = req.body;
    let errors = null;
    if (!username) {
      errors = { ...errors, username: 'username is required' };
    }
    if (!password) {
      errors = { ...errors, password: 'password is required' };
    }
    if (errors) {
      return res.status(400).json(formatRes(errors, 'fail'));
    }

    const user = await User.findOne({ username })
      .select('+password +tokens')
      .exec();
    if (!user) {
      return res.status(400).json(
        formatRes(
          {
            username: 'username or password is incorrect',
            password: 'username or password is incorrect',
          },
          'fail'
        )
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(
        formatRes(
          {
            username: 'username or password is incorrect',
            password: 'username or password is incorrect',
          },
          'fail'
        )
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const oldTokens = user.tokens || [];
    const newTokens = [...oldTokens, token];

    user.tokens = newTokens;
    await user.save();

    res.status(200).json(formatRes({ token }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.logout = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('+tokens').exec();

    const oldTokens = user.tokens || [];
    const newTokens = oldTokens.filter((t) => t !== req.token);
    user.tokens = newTokens;
    await user.save();

    res.status(200).json(formatRes(null));
  } catch (error) {
    next(error);
  }
};
