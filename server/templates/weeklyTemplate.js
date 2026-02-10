const weeklyTemplate = (posts, unsubscribeUrl) => {
    const postsHtml = posts.map(post => `
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
            ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin-bottom: 16px;">` : ''}
            <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0;">
                <a href="${process.env.CLIENT_URL}/blog/${post.slug}" style="text-decoration: none; color: #1e293b;">${post.title}</a>
            </h2>
            <p style="font-size: 16px; color: #475569; margin: 0 0 16px 0; line-height: 1.6;">${post.description || post.content.substring(0, 150)}...</p>
            <a href="${process.env.CLIENT_URL}/blog/${post.slug}" style="display: inline-block; padding: 10px 20px; background-color: #0891b2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Read Article</a>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechPixe Weekly</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #334155;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.025em;">TechPixe <span style="color: #22d3ee;">Weekly</span></h1>
            <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">Deep technical analysis for engineers</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
            <p style="font-size: 16px; margin-bottom: 32px;">Here's what happened this week in autonomous AI and engineering:</p>
            
            ${postsHtml}
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #f1f5f9;">
                <a href="${process.env.CLIENT_URL}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Visit TechPixe</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 8px 0;">You are receiving this because you subscribed to TechPixe.</p>
            <p style="margin: 0;">
                <a href="${unsubscribeUrl}" style="color: #0891b2; text-decoration: underline;">Unsubscribe</a> from these emails.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = weeklyTemplate;
