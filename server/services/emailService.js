const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, htmlContent) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { 
        name: "TechPixe", 
        email: process.env.BREVO_SENDER_EMAIL || "newsletter@techpixe.com" 
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo] Email sent successfully to ${to}. Dataset:`, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error(`[Brevo] Error sending email to ${to}:`, error);
        throw error;
    }
};

module.exports = { sendEmail };
