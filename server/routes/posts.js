const express = require('express');
const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/posts');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, authorize('admin', 'editor'), createPost);

router.route('/:slug')
  .get(getPost);

router.route('/:id')
  .put(protect, authorize('admin', 'editor'), updatePost)
  .delete(protect, authorize('admin'), deletePost);

module.exports = router;
