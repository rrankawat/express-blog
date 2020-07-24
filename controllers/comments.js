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
