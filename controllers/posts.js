const { formatRes } = require('../utils/response');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

/** @type {import("express").RequestHandler}*/
module.exports.getPosts = async function (req, res, next) {
  try {
    const posts = await Post.find().populate('nLikes nComments');
    res.json(formatRes({ posts }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.createPost = async function (req, res, next) {
  try {
    const { caption } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json(formatRes({ image: 'image is required' }, 'fail'));
    }
    if (!caption) {
      return res
        .status(400)
        .json(formatRes({ caption: 'caption is required' }, 'fail'));
    }

    const post = await Post.create({
      author: req.user.id,
      image: req.file.location,
      caption,
    });

    res.json(formatRes({ post }));
  } catch (error) {
    next(error);
  }
};
