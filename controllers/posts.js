const Post = require('../models/Post');

// @desc     Get all posts
// @route    GET /api/v1/posts
// @accsss   Public
exports.getPosts = (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all posts' });
};

// @desc     Get single post by Id
// @route    GET /api/v1/posts/:id
// @accsss   Public
exports.getPostById = (req, res) => {
  res.status(200).json({ success: true, msg: 'Show single post by ID' });
};

// @desc     Create new post
// @route    POST /api/v1/posts
// @accsss   Private
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({ success: true, data: req.body });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Update post by Id
// @route    PUT /api/v1/posts/:id
// @accsss   Private
exports.updatePostById = (req, res) => {
  res.status(200).json({ success: true, msg: 'Update a post by ID' });
};

// @desc     Delete post by Id
// @route    GET /api/v1/posts
// @accsss   Private
exports.deletePostById = (req, res) => {
  res.status(200).json({ success: true, msg: 'Delete a post by ID' });
};
