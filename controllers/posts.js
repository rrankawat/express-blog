const slugify = require('slugify');
const Post = require('../models/Post');

// @desc     Get all posts
// @route    GET /api/v1/posts
// @accsss   Public
exports.getPosts = async (req, res) => {
  try {
    let query;

    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = Post.find(JSON.parse(queryStr));

    const posts = await query;

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Get single post by Id
// @route    GET /api/v1/posts/:id
// @accsss   Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, msg: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Create new post
// @route    POST /api/v1/posts
// @accsss   Private
exports.createPost = async (req, res) => {
  try {
    // Creating slug from title
    let slug = slugify(req.body.title, {
      replacement: '-',
      remove: /[~!@#$%^&*()_=+;:'"<>?|]/g,
      lower: true,
      strict: true,
      locale: 'en',
    });

    // Check for duplicate slugs

    const posts = await Post.find({ slug: { $regex: slug } });

    if (posts.length > 0) {
      let slugs = posts.map((post) => post.slug);

      let longestSlug = slugs.reduce(function (a, b) {
        return a.length > b.length ? a : b;
      });

      slug = longestSlug + '-2';
    }

    req.body.slug = slug;

    const newPost = await Post.create(req.body);
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Update post by Id
// @route    PUT /api/v1/posts/:id
// @accsss   Private
exports.updatePostById = async (req, res) => {
  try {
    // Check if post not exists
    let post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ success: false, msg: 'Post not found' });
    }

    const { title, body, slug, image } = req.body;

    // Check if slug already exists
    post = await Post.find({ slug });
    if (post.length > 0) {
      res.status(400).json({ success: false, msg: 'Slug already exists' });
    }

    // Build post object
    const postFields = {};
    if (title) postFields.title = title;
    if (body) postFields.body = body;
    if (slug) postFields.slug = slug;
    if (image) postFields.image = image;

    post = await Post.findByIdAndUpdate(req.params.id, { $set: postFields });

    res.status(200).json({ success: true, msg: 'Post updated' });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Delete post by Id
// @route    GET /api/v1/posts
// @accsss   Private
exports.deletePostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, msg: 'Post not found' });
    }

    await Post.findByIdAndRemove(req.params.id);
    res.json({ success: true, msg: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};
