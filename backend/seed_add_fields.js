// run with: node seed_add_fields.js
const mongoose = require('mongoose');
const Post = require('./src/models/post');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to mongo');

  // update posts
  await Post.updateMany(
    { likes: { $exists: false } },
    { $set: { likes: [], commentsCount: 0 } }
  );

  // update users
  await User.updateMany(
    { followers: { $exists: false } },
    { $set: { followers: [], following: [], profilePicture: '', bio: '' } }
  );

  console.log('Migration done');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
