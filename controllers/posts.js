const slugify = require('slugify');
const Post = require('../models/Post');
const path = require('path');

// @desc     Get all posts
// @route    GET /api/v1/posts
// @accsss   Public
exports.getPosts = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedFilters);
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

    // await Post.findByIdAndRemove(req.params.id);
    post.remove();

    res.json({ success: true, msg: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};

// @desc     Upload photo for post
// @route    PUT /api/v1/posts/:id/photo
// @accsss   Private
exports.postPhotoUpload = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, msg: 'Post not found' });
    }

    if (!req.files) {
      return res
        .status(400)
        .json({ success: false, msg: 'Please upload a photo' });
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return res
        .status(400)
        .json({ success: false, msg: 'Please upload an image file' });
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(400).json({
        success: false,
        msg: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
      });
    }

    // Create custom filename
    file.name = `photo_${post._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          msg: `Something went wrong`,
        });
      }

      await Post.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({ success: true, data: file.name });
    });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
};
