const User = require('../models/User');
const { formatRes } = require('../utils/response');

/** @type {import("express").RequestHandler} */
module.exports.getUsers = async function (req, res, next) {
  try {
    const users = await User.find();
    res.json(formatRes({ users }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.createUser = async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res
        .status(400)
        .json(formatRes({ username: 'username is required' }, 'fail'));
    }
    if (!password) {
      return res
        .status(400)
        .json(formatRes({ password: 'password is required' }, 'fail'));
    }

    const user = await User.create({ username, password });

    res.json(formatRes({ user: user.noPass() }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.getUser = async function (req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(formatRes({ id: 'user not found' }, 'fail'));
    }

    res.json(formatRes({ user }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.updateUser = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ id: 'user not found' });
    }

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();

    res.json(formatRes({ user: user.noPass() }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.deleteUser = async function (req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ id: 'user not found' });
    }

    res.json(formatRes(null));
  } catch (error) {
    next(error);
  }
};
