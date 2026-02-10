const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unsubscribeToken: {
    type: String,
    unique: true
  }
});

// Generate token before saving if not present
const { v4: uuidv4 } = require('uuid');
SubscriberSchema.pre('save', function(next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = uuidv4();
  }
  next();
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
