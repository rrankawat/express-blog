const mongoose = require('mongoose');

const Post = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'no-image.jpg',
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete comments when a bootcamp is deleted
Post.pre('remove', async function (next) {
  await this.model('Comment').deleteMany({ postId: this._id });
  next();
});

// Reverse populate with virtuals
Post.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

module.exports = mongoose.model('Post', Post);
