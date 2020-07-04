const { check, validationResult } = require('express-validator');

exports.postValidator = [
  check('title', 'Title is required').not().isEmpty(),
  check('body', 'Body is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
