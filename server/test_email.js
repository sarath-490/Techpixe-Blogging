require('dotenv').config();
const { sendEmail } = require('./services/emailService');

const testEmail = async () => {
    console.log('Testing Brevo Email...');
    console.log('API Key Present:', !!process.env.BREVO_API_KEY);

    try {
        await sendEmail(
            'newsletter@techpixe.com', 
            'Test Email from TechPixe',
            '<p>This is a test email to verify Brevo integration.</p>'
        );
        console.log('Test email sent successfully!');
    } catch (err) {
        console.error('Test failed:', err);
    }
};

testEmail();
