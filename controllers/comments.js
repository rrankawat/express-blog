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
      query = Comment.find({ post: req.params.postId });
    } else {
      query = Comment.find().populate({
        path: 'post',
        select: 'title body',
      });
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

// @desc     Get single comment by Id
// @route    GET /api/v1/comments/:id
// @accsss   Public
exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate({
      path: 'post',
      select: 'title body',
    });

    if (!comment) {
      return res.status(404).json({ success: false, msg: 'Comment not found' });
    }

    res.status(200).json({
      success: true,
      data: comment,
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
    req.body.post = req.params.postId;

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

// @desc     Update comment
// @route    PUT /api/v1/comments/:id
// @accsss   Private
exports.updateComment = async (req, res, next) => {
  try {
    let course = await Comment.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, msg: 'Comment not found' });
    }

    course = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Delete comment
// @route    DELETE /api/v1/comments/:id
// @accsss   Private
exports.deleteComment = async (req, res, next) => {
  try {
    const course = await Comment.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, msg: 'Comment not found' });
    }

    await course.remove();

    res.status(200).json({
      success: true,
      msg: 'Comment has been deleted',
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};
