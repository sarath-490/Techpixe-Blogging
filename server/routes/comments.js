const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/comments');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:postId')
  .get(getComments)
  .post(addComment);

router.route('/:id')
    .delete(protect, deleteComment); // Add delete route with protection

module.exports = router;
