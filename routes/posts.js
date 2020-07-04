const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
} = require('../controllers/posts');

router.route('/').get(getPosts).post(createPost);
router
  .route('/:id')
  .get(getPostById)
  .put(updatePostById)
  .delete(deletePostById);

module.exports = router;
