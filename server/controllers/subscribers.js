const Subscriber = require('../models/Subscriber');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../services/emailService');
const welcomeTemplate = require('../templates/welcomeTemplate');

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if exists
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            if (!subscriber.isActive) {
                subscriber.isActive = true;
                await subscriber.save();
                
                // Resending welcome email for returning users is optional, but good for UX
                try {
                    const unsubscribeUrl = `${process.env.CLIENT_URL}/unsubscribe/${subscriber.unsubscribeToken}`;
                    await sendEmail(email, "Welcome back to TechPixe!", welcomeTemplate(unsubscribeUrl));
                } catch (emailErr) {
                    console.error('Failed to send welcome email:', emailErr);
                }

                return res.status(200).json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
            }
            return res.status(400).json({ success: false, error: 'Email already subscribed' });
        }

        subscriber = await Subscriber.create({ email });

        // Send Welcome Email
        try {
            const unsubscribeUrl = `${process.env.CLIENT_URL}/unsubscribe/${subscriber.unsubscribeToken}`;
            await sendEmail(email, "Welcome to the TechPixe Inner Circle", welcomeTemplate(unsubscribeUrl));
        } catch (emailErr) {
            console.error('Failed to send welcome email:', emailErr);
            // Don't fail the request if email fails, just log it
        }

        res.status(201).json({ success: true, data: subscriber });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Unsubscribe from newsletter
// @route   GET /api/subscribers/unsubscribe/:token
// @access  Public
exports.unsubscribe = async (req, res) => {
    try {
        const { token } = req.params;
        
        const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

        if (!subscriber) {
            return res.status(404).json({ success: false, error: 'Invalid unsubscribe token' });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all subscribers (Admin)
// @route   GET /api/subscribers
// @access  Private
exports.getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
