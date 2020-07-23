const slugify = require('slugify');
const Post = require('../models/Post');

// @desc     Get all posts
// @route    GET /api/v1/posts
// @accsss   Public
exports.getPosts = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = Post.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const posts = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res
      .status(200)
      .json({ success: true, count: posts.length, pagination, data: posts });
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
