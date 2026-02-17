const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-blog', {
});

const importData = async () => {
  try {
    await Post.deleteMany();
    await User.deleteMany();

    const user = await User.create({
      username: 'admin',
      email: 'admin@techpixe.com',
      password: 'password123',
      role: 'admin'
    });

    const posts = [
      {
        title: "What Are AI Employees? The Rise of the Autonomous Workforce",
        content: `## Introduction

The concept of "AI Employees" is no longer science fiction. In 2026, companies are increasingly deploying autonomous AI agents to handle complex workflows, from customer support to software engineering. Unlike traditional chatbots, AI employees have agency—they can plan, execute, and iterate on tasks without constant human supervision.

## Key Characteristics of AI Employees

1. **autonomy**: They make decisions based on goals.
2. **Memory**: They retain context across long periods.
3. **Tool Use**: They can browse the web, write code, and send emails.

## The Economic Impact

Analysts predict that within 5 years, 40% of routine cognitive labor will be handled by autonomous agents. This shift will create a "hybrid workforce" where humans manage teams of AI agents.`,
        excerpt: "Autonomous AI agents are reshaping the global economy. Learn what AI employees are and how they differ from traditional automation.",
        category: "AI Employees",
        featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        author: "Tech Visionary",
        tags: ["Future of Work", "Agents", "Automation"]
      },
      {
        title: "Top 5 AI Tools for Developers in 2026",
        content: `## 1. GitHub Copilot X (v4)

The latest version of Copilot understands entire codebases instantly and can refactor legacy systems with 99% accuracy.

## 2. Devin 2.0

Devin has evolved from a junior engineer to a senior architect, capable of designing distributed systems from scratch.

## 3. Cursor IDE

Still the favorite for many, its deep integration of context-aware chat makes pair programming seamless.

## 4. Vercel AI SDK

The standard for building AI applications on the web.

## 5. LangChain Cloud

Orchestrating agents has never been easier.`,
        excerpt: "A curated list of the most essential AI coding assistants and platforms for software engineers in 2026.",
        category: "AI Tools",
        featuredImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
        author: "Code Master",
        tags: ["Development", "Tools", "Productivity"]
      },
      {
        title: "The Ethics of Autonomous Decision Making",
        content: "As we hand over more control to AI agents, we must ask: who is responsible when an AI makes a mistake? This article explores the legal and ethical frameworks emerging in 2026...",
        excerpt: "Who is liable when an AI employee fails? Exploring the legal and ethical frontiers of autonomous systems.",
        category: "Ethics",
        featuredImage: "https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&q=80&w=1000",
        author: "Sarah Ethical",
        tags: ["Ethics", "Law", "Policy"]
      }
    ];

    await Post.create(posts);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
