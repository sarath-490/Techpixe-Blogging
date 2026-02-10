import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
    return (
        <div className="bg-white min-h-screen py-12">
            <Helmet><title>Privacy Policy - AI Insights</title></Helmet>
            <div className="max-w-3xl mx-auto px-4 text-slate-600 prose prose-slate">
                <h1>Privacy Policy</h1>
                <p>Last updated: February 07, 2026</p>
                <p>At AI Insights, accessible from aiinsights.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AI Insights and how we use it.</p>
                <h3>Look and Feel</h3>
                <p>We are committed to maintaining the trust and confidence of our visitors to our web site. In particular, we want you to know that we are not in the business of selling, renting or trading email lists with other companies and businesses for marketing purposes.</p>
                {/* Placeholder content for length */}
                <h3>Cookies</h3>
                <p>Review our cookie policy for details on how we track user sessions.</p>
            </div>
        </div>
    );
}
