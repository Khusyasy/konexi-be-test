require('./configs/database');

const User = require('./models/User');
const Follow = require('./models/Follow');

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

  console.log(JSON.stringify(users, null, 2));

  // test password validation
  const testUser = await User.findOne({ username: 'charlie' })
    .select('+password')
    .exec();
  console.log('password is valid:', await testUser.comparePassword('alice'));
  console.log('password is valid:', await testUser.comparePassword('bob'));
  console.log('password is valid:', await testUser.comparePassword('charlie'));

  process.exit(0);
}
