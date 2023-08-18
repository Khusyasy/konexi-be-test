const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String, // url to s3 bucket
      required: true,
    },
    caption: {
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

PostSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'target',
});

PostSchema.virtual('nLikes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'target',
  count: true,
});

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

PostSchema.virtual('nComments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
