const express = require('express');
const router = express.Router({ mergeParams: true });
const { getComments } = require('../controllers/comments');

router.route('/').get(getComments);

module.exports = router;
