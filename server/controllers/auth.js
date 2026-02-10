const User = require('../models/User');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'admin' // Default to admin for this blog app usage
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide an email and password' });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
};

// @desc    Get current logged in user
// @route   POST /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
      res.status(400).json({ success: false, error: err.message });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
      }
    });
};
// @desc    Request password reset (Terminal based)
// @route   POST /api/auth/reset-request
// @access  Public
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`[RESET] Request received for email: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`[RESET] User not found for email: ${email}`);
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Generate 6 digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash code and save to DB
        user.resetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        user.resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        console.log('\n=================================================================');
        console.log(`[PASSWORD RESET] Secret Code for ${email}: ${resetCode}`);
        console.log('=================================================================\n');

        res.status(200).json({ success: true, message: 'Secret code logged to server terminal' });
    } catch (err) {
        console.error(`[RESET] Error:`, err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Reset password with code
// @route   POST /api/auth/reset-verify
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        // Hash code to compare
        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

        const user = await User.findOne({
            email,
            resetCode: hashedCode,
            resetCodeExpire: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired code' });
        }

        user.password = newPassword;
        user.resetCode = undefined;
        user.resetCodeExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
