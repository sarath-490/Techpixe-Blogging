import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Home } from 'lucide-react'; // Assuming you have lucide-react installed

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4">
            <Helmet>
                <title>404 - Page Not Found | TechPixe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="text-center max-w-md">
                <AlertTriangle className="w-24 h-24 text-cyan-500 mx-auto mb-6 animate-bounce" />
                <h1 className="text-6xl font-bold font-display mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-colors duration-200"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
