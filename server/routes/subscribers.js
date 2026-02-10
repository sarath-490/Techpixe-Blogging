const express = require('express');
const { subscribe, unsubscribe, getSubscribers } = require('../controllers/subscribers');
const { protect, authorize } = require('../middleware/auth');
const Subscriber = require('../models/Subscriber'); // For count route

const router = express.Router();

router.route('/')
  .post(subscribe)
  .get(protect, authorize('admin', 'editor'), getSubscribers);

router.route('/unsubscribe/:token')
    .get(unsubscribe);

router.get('/count', async (req, res) => {
    try {
        const count = await Subscriber.countDocuments({ isActive: true });
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
