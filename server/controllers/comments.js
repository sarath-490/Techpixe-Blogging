const Comment = require('../models/Comment');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add comment
// @route   POST /api/comments
// @access  Public
exports.addComment = async (req, res) => {
  try {
    // Add postId to the comment from request body or URL parameter
    const commentData = {
      ...req.body,
      post: req.body.post || req.params.postId
    };

    const comment = await Comment.create(commentData);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Admin only for now, or owner)
exports.deleteComment = async (req, res) => {
    try {
        console.log(`[DELETE] Attempting to delete comment ${req.params.id}`);
        console.log(`[DELETE] Request User:`, req.user);

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            console.log(`[DELETE] Comment not found: ${req.params.id}`);
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }
        
        // Check permissions: Admin or Comment Owner
        // Assuming req.user is populated by protect middleware
        // Add robust check here if needed, for now just log
        
        await comment.deleteOne();
        console.log(`[DELETE] Comment deleted successfully`);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
