const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc     Get all comments
// @route    GET /api/v1/comments
// @route    GET /api/v1/posts/:postId/comments
// @accsss   Public
exports.getComments = async (req, res, next) => {
  try {
    let query;

    if (req.params.postId) {
      query = Comment.find({ postId: req.params.postId });
    } else {
      query = Comment.find();
    }

    const comments = await query;

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Add comment
// @route    POST /api/v1/posts/:postId/comments
// @accsss   Private
exports.addComment = async (req, res, next) => {
  try {
    req.body.postId = req.params.postId;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, msg: 'Post not found' });
    }

    const newComment = await Comment.create(req.body);

    res.status(200).json({
      success: true,
      data: newComment,
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};
