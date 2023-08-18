const { formatRes } = require('../utils/response');
const User = require('../models/User');
const Follow = require('../models/Follow');

/** @type {import("express").RequestHandler} */
module.exports.getUsers = async function (req, res, next) {
  try {
    const users = await User.find().populate('nFollowers nFollowing');
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
module.exports.getUserByUsername = async function (req, res, next) {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json(formatRes({ username: 'user not found' }, 'fail'));
    }

    res.json(formatRes({ user }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.updateUser = async function (req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await User.findById(req.user.id);

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
    await User.findByIdAndDelete(req.user.id);
    res.json(formatRes(null));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.followUser = async function (req, res, next) {
  const { username } = req.params;
  try {
    const target = await User.findOne({ username });
    if (!target) {
      return res
        .status(404)
        .json(formatRes({ username: 'user not found' }, 'fail'));
    }

    const follow = await Follow.findOne({
      user: req.user.id,
      target: target.id,
    });
    if (follow) {
      return res
        .status(400)
        .json(formatRes({ username: 'user already followed' }, 'fail'));
    }

    await Follow.create({
      user: req.user.id,
      target: target.id,
    });

    res.json(formatRes(null));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.unfollowUser = async function (req, res, next) {
  const { username } = req.params;
  try {
    const target = await User.findOne({ username });
    if (!target) {
      return res
        .status(404)
        .json(formatRes({ username: 'user not found' }, 'fail'));
    }

    const follow = await Follow.findOneAndDelete({
      user: req.user.id,
      target: target.id,
    });
    if (!follow) {
      return res
        .status(400)
        .json(formatRes({ username: 'user not followed' }, 'fail'));
    }

    res.json(formatRes(null));
  } catch (error) {
    next(error);
  }
};
