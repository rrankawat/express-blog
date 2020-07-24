const express = require('express');
const router = express.Router();
const { postValidator } = require('../helpers/validators');
const {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  postPhotoUpload,
} = require('../controllers/posts');
const Post = require('../models/Post');
const advancedFilters = require('../middleware/advancedFilters');

// Include other resource routers
const commentRouter = require('./comments');

// Re-route into other resource router
router.use('/:postId/comments', commentRouter);

router
  .route('/')
  .get(advancedFilters(Post, 'comments'), getPosts)
  .post(postValidator, createPost);
router
  .route('/:id')
  .get(getPostById)
  .put(postValidator, updatePostById)
  .delete(deletePostById);
router.route('/:id/photo').put(postPhotoUpload);

module.exports = router;
