require('dotenv').config();
const jwt = require('jsonwebtoken');
const { formatRes } = require('../utils/response');

const User = require('../models/User');

/** @type {import('express').RequestHandler} */
module.exports = async function (req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json(formatRes(null, 'error', 'Unauthorized'));
  }

  const token = authHeader.split(' ')[1];

  try {
    let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({
      _id: decodedToken.id,
      tokens: token,
    })
      .select('+tokens')
      .exec();
    console.log(user);
    if (!user) {
      return res.status(401).json(formatRes(null, 'error', 'Unauthorized'));
    }

    req.user = decodedToken;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json(formatRes(null, 'error', 'JWT invalid'));
    }
    return res.status(403).json(formatRes(null, 'error', 'Forbidden'));
  }
};
