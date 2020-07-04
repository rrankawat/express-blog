const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all posts' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show single post by ID' });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Create new post' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: 'Update a post by ID' });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: 'Delete a post by ID' });
});

module.exports = router;
