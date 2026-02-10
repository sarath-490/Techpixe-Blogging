import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
            <Helmet>
                <title>About Us - AI Insights</title>
            </Helmet>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">About AI Insights</h1>
                <div className="prose prose-lg prose-slate dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p className="mb-6">
                        Welcome to <strong>AI Insights</strong>, your premier destination for understanding the rapidly evolving world of Artificial Intelligence, Autonomous Agents, and the Future of Work.
                    </p>
                    <p className="mb-6">
                        In an era where "AI Employees" and digital workforces are becoming reality, we believe in providing clear, trustworthy, and deep-dive content that empowers professionals, developers, and businesses to stay ahead.
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Our Mission</h2>
                    <p className="mb-6">
                        To demystify AI technology and explore its practical implications on the global economy. We focus on:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Autonomous Agents:</strong> How they work and what they can do.</li>
                        <li><strong>AI in the Workforce:</strong> The shift from copilot to autopilot.</li>
                        <li><strong>Ethics & Policy:</strong> Navigating the moral landscape of AI.</li>
                        <li><strong>Developer Tools:</strong> The technical stack powering the next generation.</li>
                    </ul>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">The Team</h2>
                    <p>
                        We are a team of engineers, researchers, and tech journalists passionate about the frontier of intelligence.
                    </p>
                </div>
            </div>
        </div>
    );
}
