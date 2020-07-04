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

router.route('/').get(getPosts).post(postValidator, createPost);
router
  .route('/:id')
  .get(getPostById)
  .put(postValidator, updatePostById)
  .delete(deletePostById);

module.exports = router;
