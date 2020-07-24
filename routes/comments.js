const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getComments,
  getComment,
  addComment,
} = require('../controllers/comments');

router.route('/').get(getComments).post(addComment);
router.route('/:id').get(getComment);

module.exports = router;
