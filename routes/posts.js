const express = require('express');
const router = express.Router();
const { postValidator } = require('../helpers/validators');
const {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
} = require('../controllers/posts');

// Include other resource routers
const commentRouter = require('./comments');

// Re-route into other resource router
router.use('/:postId/comments', commentRouter);

router.route('/').get(getPosts).post(postValidator, createPost);
router
  .route('/:id')
  .get(getPostById)
  .put(postValidator, updatePostById)
  .delete(deletePostById);

module.exports = router;
