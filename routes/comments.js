const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments');

router.route('/').get(getComments).post(addComment);
router.route('/:id').get(getComment).put(updateComment).delete(deleteComment);

module.exports = router;
