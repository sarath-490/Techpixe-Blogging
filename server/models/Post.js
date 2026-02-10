const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  author: {
    type: String, // Ideally a ref to User, but keeping simple for MVP or "Admin"
    default: "AI Editorial Team"
  },
  category: {
    type: String,
    required: true,
    enum: ['AI News', 'AI Tools', 'AI Employees', 'Machine Learning', 'Ethics', 'Tutorials', 'Opinion']
  },
  tags: {
    type: [String],
    index: true
  },
  featuredImage: {
    type: String, // URL or path
    default: 'https://via.placeholder.com/800x400?text=AI+Blog'
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to create slug from title
// Middleware to create slug from title
PostSchema.pre('save', async function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  let candidateSlug = slugify(this.title, { lower: true, strict: true });
  let newSlug = candidateSlug;
  let counter = 1;
  
  // Check for uniqueness
  while (await this.constructor.findOne({ slug: newSlug })) {
    newSlug = `${candidateSlug}-${counter}`;
    counter++;
  }
  
  this.slug = newSlug;
  next();
});

module.exports = mongoose.model('Post', PostSchema);
