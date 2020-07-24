const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/posts.json`, 'utf-8')
);
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/comments.json`, 'utf-8')
);

// Import into db
const importData = async () => {
  try {
    await Post.create(posts);
    await Comment.create(comments);

    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Post.deleteMany();
    await Comment.deleteMany();

    console.log('Data destroyed');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
