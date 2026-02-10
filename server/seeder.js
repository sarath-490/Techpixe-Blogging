const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const User = require('./models/User');

dotenv.config({ path: './.env' }); // Adjust path if running from server

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-blog', {})
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const posts = [
  {
    title: "The Rise of Agentic AI: From Copilots to Autopilots",
    content: `
# The Shift to Agency

The last two years of generative AI have been defined by "copilots"—assistants that wait for user instructions. The next phase is different. We are entering the era of **Agentic AI**.

Autonomous agents can perceive, reason, act, and learn. They don't just write code; they deploy it. They don't just draft emails; they manage campaigns.

## Why This Matters
For businesses, the implication is a shift in workforce composition. AI employees will handle deterministic and semi-deterministic workflows, allowing humans to focus on high-level strategy and creative direction.

![Agentic Workflow](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600)

## Key Technologies
1. **Chain of Thought Reasoning**: Enabling models to plan before acting.
2. **Tool Use**: Giving LLMs access to APIs, browsers, and databases.
3. **Memory Systems**: Long-term state management for complex tasks.

The future isn't just about smarter chat bots. It's about digital workers.
    `,
    excerpt: "We are transitioning from AI tools that chat to AI agents that work. Explore the architecture of the autonomous enterprise.",
    category: "AI Employees",
    author: "Editorial Team",
    featuredImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600",
    tags: ["Agents", "Future of Work", "LLM"],
    views: 1250
  },
  {
    title: "Vector Databases: The Long-Term Memory of AI",
    content: "With the rise of RAG (Retrieval Augmented Generation), vector databases have become the hottest part of the infrastructure stack...",
    excerpt: "Why Pinecone, Weaviate, and Chroma are becoming as essential as Postgres in the modern AI stack.",
    category: "AI Tools",
    author: "Dev Rel",
    featuredImage: "https://images.unsplash.com/photo-1558494949-efc52728101c?auto=format&fit=crop&q=80&w=1600",
    tags: ["Vector DB", "Infrastructure"],
    views: 890
  },
  {
    title: "Ethics of the Autonomous Workforce",
    content: "As we deploy AI agents that can hire, fire, and spend money, what are the guardrails?...",
    excerpt: "Navigating the moral and legal landscape of deploying non-human workers in critical business functions.",
    category: "Ethics",
    author: "Sarah Connor",
    featuredImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=1600",
    tags: ["Ethics", "Policy"],
    views: 2100
  },
  {
    title: "Building Your First AI Employee with LangChain",
    content: "A step-by-step tutorial on creating a marketing agent that monitors Twitter and drafts responses...",
    excerpt: "Code-heavy guide to orchestrating your first autonomous loop using Python and LangChain.",
    category: "Tutorials",
    author: "Code Master",
    featuredImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1600",
    tags: ["Dev", "LangChain", "Python"],
    views: 3400
  }
];

const seedDB = async () => {
    try {
        await Post.deleteMany({});
        // We're not seeding users to avoid overwriting admin, assume admin exists or create manually if needed.
        // But for posts to work, we just need them there.
        
        // Add slugs manually or let pre-save hook do it (if exists). 
        // Assuming Post model has slugify hook.
        
        // Use create to trigger pre-save hooks (slugify)
        for (const post of posts) {
            await Post.create(post);
        }
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDB();
