const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments');
const Comment = require('../models/Comment');
const advancedFilters = require('../middleware/advancedFilters');

router
  .route('/')
  .get(
    advancedFilters(Comment, {
      path: 'post',
      select: 'title body',
    }),
    getComments
  )
  .post(addComment);
router.route('/:id').get(getComment).put(updateComment).delete(deleteComment);

module.exports = router;
