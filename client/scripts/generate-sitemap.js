import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to fetch data (using native fetch in Node 18+)
const fetchPosts = async () => {
  try {
    // Adjust URL to your production API if different, or local if running locally
    // If you are running this script locally, make sure your server is running.
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api/posts'; 
    console.log(`Fetching posts from: ${apiUrl}`);
    
    // We might need to handle pagination if there are many posts, 
    // but for now let's assume this endpoint returns all or we request a large limit.
    const response = await fetch(`${apiUrl}?limit=1000`); 
    const data = await response.json();
    
    if (data.success) {
      return data.data; // Assuming your API returns { success: true, data: [...] }
    } else {
      console.error('API Error:', data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
};

const generateSitemap = async () => {
  const posts = await fetchPosts();
  const baseUrl = 'https://techpixe.com'; // REPLACE with your actual domain

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/login'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((url) => {
      return `
  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('')}
  ${posts
    .map((post) => {
      return `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt || post.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)){
      fs.mkdirSync(publicDir);
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully at client/public/sitemap.xml');
};

generateSitemap();
