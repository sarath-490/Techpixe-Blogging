const cron = require('node-cron');
const Post = require('../models/Post');
const Subscriber = require('../models/Subscriber');
const { sendEmail } = require('../services/emailService');
const weeklyTemplate = require('../templates/weeklyTemplate');

// Schedule: Every Monday at 9:00 AM
// Cron Expression: 0 9 * * 1
const startNewsletterJob = () => {
    cron.schedule('0 9 * * 1', async () => {
        console.log('[Cron] Starting weekly newsletter job...');
        
        try {
            // 1. Fetch posts from last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const recentPosts = await Post.find({
                createdAt: { $gte: sevenDaysAgo }
            }).sort({ createdAt: -1 }).limit(5);

            if (recentPosts.length === 0) {
                console.log('[Cron] No new posts this week. Skipping newsletter.');
                return;
            }

            // 2. Fetch active subscribers
            const subscribers = await Subscriber.find({ isActive: true });
            console.log(`[Cron] Found ${subscribers.length} active subscribers.`);

            // 3. Send emails in batches
            const BATCH_SIZE = 50; 
            for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
                const batch = subscribers.slice(i, i + BATCH_SIZE);
                
                await Promise.all(batch.map(async (sub) => {
                    try {
                        const unsubscribeUrl = `${process.env.CLIENT_URL}/unsubscribe/${sub.unsubscribeToken}`;
                        const emailContent = weeklyTemplate(recentPosts, unsubscribeUrl);
                        
                        await sendEmail(sub.email, "TechPixe Weekly: Top Stories", emailContent);
                    } catch (err) {
                        console.error(`[Cron] Failed to send to ${sub.email}:`, err.message);
                    }
                }));
                
                // Optional: active wait to respect rate limits if huge list
                // await new Promise(resolve => setTimeout(resolve, 1000));
            }

            console.log('[Cron] Weekly newsletter job completed.');

        } catch (err) {
            console.error('[Cron] Error in newsletter job:', err);
        }
    });

    console.log('[System] Newsletter cron job scheduled (Mon 9:00 AM).');
};

module.exports = startNewsletterJob;
