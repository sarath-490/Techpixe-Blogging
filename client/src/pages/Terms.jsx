import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
    return (
        <div className="bg-white min-h-screen py-12">
            <Helmet><title>Terms of Service - AI Insights</title></Helmet>
            <div className="max-w-3xl mx-auto px-4 text-slate-600 prose prose-slate">
                <h1>Terms of Service</h1>
                <p>Last updated: February 07, 2026</p>
                <p>Please read these terms and conditions carefully before using Our Service.</p>
                <h3>Interpretation and Definitions</h3>
                <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                <h3>Acknowledgment</h3>
                <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company.</p>
            </div>
        </div>
    );
}
