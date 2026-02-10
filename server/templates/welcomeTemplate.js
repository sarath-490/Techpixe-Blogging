const welcomeTemplate = (unsubscribeUrl) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to TechPixe</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #334155;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.025em;">Welcome to <span style="color: #22d3ee;">TechPixe</span></h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
            <p style="font-size: 16px; margin-bottom: 24px; line-height: 1.6;">Hi there,</p>
            <p style="font-size: 16px; margin-bottom: 24px; line-height: 1.6;">Thank you for joining the <strong>TechPixe Inner Circle</strong>. You are now part of a community of forward-thinking engineers and researchers shaping the future of AI.</p>
            
            <p style="font-size: 16px; margin-bottom: 24px; line-height: 1.6;">You can expect one high-quality, deep-dive article every week. No spam, just signal.</p>
            
            <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.CLIENT_URL}" style="display: inline-block; padding: 12px 24px; background-color: #0891b2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Explore Latest Articles</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} TechPixe. All rights reserved.</p>
            <p style="margin: 0;">
                <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> if you didn't sign up for this.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = welcomeTemplate;
