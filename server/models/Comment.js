const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String, // Optional, not shown publicly
  },
  content: {
    type: String,
    required: [true, 'Please add a comment']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
