// @desc     Get all posts
// @route    GET /api/v1/posts
// @accsss   Public
exports.getPosts = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all posts' });
};

// @desc     Get single post by Id
// @route    GET /api/v1/posts/:id
// @accsss   Public
exports.getPostById = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show single post by ID' });
};

// @desc     Create new post
// @route    POST /api/v1/posts
// @accsss   Private
exports.createPost = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new post' });
};

// @desc     Update post by Id
// @route    PUT /api/v1/posts/:id
// @accsss   Private
exports.updatePostById = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Update a post by ID' });
};

// @desc     Delete post by Id
// @route    GET /api/v1/posts
// @accsss   Private
exports.deletePostById = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Delete a post by ID' });
};
