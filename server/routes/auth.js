const express = require('express');
const { register, login, getMe, updatePassword, requestPasswordReset, resetPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.post('/reset-request', requestPasswordReset);
router.post('/reset-verify', resetPassword);

module.exports = router;
