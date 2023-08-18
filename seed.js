require('./configs/database');

const User = require('./models/User');
const Follow = require('./models/Follow');
const Post = require('./models/Post');
const Like = require('./models/Like');
const Comment = require('./models/Comment');

main().catch((err) => console.log(err));

async function main() {
  await User.deleteMany();
  await Follow.deleteMany();

  const alice = await User.create({
    username: 'alice',
    password: 'alice',
  });

  const bob = await User.create({
    username: 'bob',
    password: 'bob',
  });

  const charlie = await User.create({
    username: 'charlie',
    password: 'charlie',
  });

  const follow1 = await Follow.create({
    user: alice._id,
    target: bob._id,
  });

  const follow2 = await Follow.create({
    user: bob._id,
    target: alice._id,
  });

  const follow3 = await Follow.create({
    user: alice._id,
    target: charlie._id,
  });

  const follow4 = await Follow.create({
    user: bob._id,
    target: charlie._id,
  });

  // const users = await User.find().populate('nFollowing nFollowers');
  const users = await User.find();

  // console.log(JSON.stringify(users, null, 2));

  // test password validation
  const testUser = await User.findOne({ username: 'charlie' })
    .select('+password')
    .exec();
  // console.log('password is valid:', await testUser.comparePassword('alice'));
  // console.log('password is valid:', await testUser.comparePassword('bob'));
  // console.log('password is valid:', await testUser.comparePassword('charlie'));

  await Post.deleteMany();
  await Like.deleteMany();
  await Comment.deleteMany();

  const post1 = await Post.create({
    author: alice._id,
    image:
      'https://mlk-konexi-be.s3.ap-southeast-1.amazonaws.com/1692375980942.jpg',
    caption: 'Alice post 1',
  });

  const post2 = await Post.create({
    author: alice._id,
    image:
      'https://mlk-konexi-be.s3.ap-southeast-1.amazonaws.com/1692376173903.jpg',
    caption: 'Alice post 2',
  });

  const like1 = await Like.create({
    user: bob._id,
    target: post1._id,
  });

  const like2 = await Like.create({
    user: charlie._id,
    target: post1._id,
  });

  const like3 = await Like.create({
    user: bob._id,
    target: post2._id,
  });

  // const posts = await Post.find().populate('nLikes likes');
  // console.log(JSON.stringify(posts, null, 2));

  const comment1 = await Comment.create({
    user: bob._id,
    post: post1._id,
    content: 'Bob comment 1',
  });

  const comment2 = await Comment.create({
    user: charlie._id,
    post: comment1._id,
    content: 'Charlie comment 1',
  });

  const likeComment1 = await Like.create({
    user: alice._id,
    target: comment1._id,
  });

  const posts = await Post.find().populate('author nComments nLikes');
  console.log(JSON.stringify(posts, null, 2));

  process.exit(0);
}
