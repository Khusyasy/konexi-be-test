const { formatRes } = require('../utils/response');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

/** @type {import("express").RequestHandler}*/
module.exports.getPosts = async function (req, res, next) {
  try {
    const { feeds, q } = req.query;

    let findQuery = {};

    if (feeds) {
      const user = await User.findById(req.user.id).populate({
        path: 'following',
        select: 'target',
        populate: {
          path: 'target',
          select: '_id',
        },
      });
      const following = user.following.map((follow) => follow.target.id);

      findQuery = { ...findQuery, author: { $in: following } };
    }

    if (q) {
      findQuery = {
        ...findQuery,
        caption: { $regex: q, $options: 'i' },
      };
    }

    const posts = await Post.find(findQuery).populate(
      'author nLikes nComments'
    );
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

/** @type {import("express").RequestHandler}*/
module.exports.getPost = async function (req, res, next) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate(
      'author nLikes likes nComments comments'
    );
    if (!post) {
      return res.status(404).json(formatRes({ id: 'post not found' }, 'fail'));
    }

    res.json(formatRes({ post }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.updatePost = async function (req, res, next) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate(
      'author nLikes likes nComments comments'
    );
    if (!post) {
      return res.status(404).json(formatRes({ id: 'post not found' }, 'fail'));
    }

    if (post.author.id.toString() !== req.user.id) {
      return res.status(403).json(formatRes({}, 'error', 'Forbidden'));
    }

    const { caption } = req.body;
    if (!caption) {
      return res
        .status(400)
        .json(formatRes({ caption: 'caption is required' }, 'fail'));
    }

    post.caption = caption;
    await post.save();

    res.json(formatRes({ post }));
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler}*/
module.exports.deletePost = async function (req, res, next) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate(
      'author nLikes likes nComments comments'
    );
    if (!post) {
      return res.status(404).json(formatRes({ id: 'post not found' }, 'fail'));
    }

    if (post.author.id.toString() !== req.user.id) {
      return res.status(403).json(formatRes({}, 'error', 'Forbidden'));
    }

    await Post.deleteOne({ _id: id });

    res.json(formatRes(null));
  } catch (error) {
    next(error);
  }
};

module.exports.likePost = async function (req, res, next) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json(formatRes({ id: 'post not found' }, 'fail'));
    }

    const like = await Like.findOne({ user: req.user.id, target: id });
    if (like) {
      return res
        .status(400)
        .json(formatRes({ id: 'post already liked' }, 'fail'));
    }

    await Like.create({ user: req.user.id, target: id });

    res.json(formatRes(null));
  } catch (error) {
    next(error);
  }
};

module.exports.unlikePost = async function (req, res, next) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json(formatRes({ id: 'post not found' }, 'fail'));
    }

    const like = await Like.findOneAndDelete({ user: req.user.id, target: id });
    if (!like) {
      return res.status(400).json(formatRes({ id: 'post not liked' }, 'fail'));
    }

    res.json(formatRes(null));
  } catch (error) {
    next(error);
  }
};
