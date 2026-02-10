const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:slug
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    // Increment views
    post.views += 1;
    await post.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Admin)
exports.createPost = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id; // If we were tracking author by ID

    // Truncate excerpt if too long to prevent validation error
    if (req.body.excerpt && req.body.excerpt.length > 500) {
      req.body.excerpt = req.body.excerpt.substring(0, 497) + '...';
    }
    
    console.log('Creating post with data:', req.body); // Debug log
    
    const post = await Post.create(req.body);
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Post creation error:', err); // Enhanced error logging
    res.status(400).json({ 
      success: false, 
      error: err.message || 'Failed to create post' 
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Admin)
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
