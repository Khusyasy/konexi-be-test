const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'target',
});

CommentSchema.virtual('nLikes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'target',
  count: true,
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
