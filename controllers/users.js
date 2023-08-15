const User = require('../models/user');

/** @type {import("express").RequestHandler} */
module.exports.getUsers = async function (req, res, next) {
  const users = await User.find();
  res.send(users);
};
