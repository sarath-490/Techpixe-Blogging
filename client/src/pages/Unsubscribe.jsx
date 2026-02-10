import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, XCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Unsubscribe() {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = async () => {
            try {
                const { data } = await api.get(`/subscribers/unsubscribe/${token}`);
                setStatus('success');
                setMessage(data.message || 'You have been successfully unsubscribed.');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Invalid or expired unsubscribe link.');
            }
        };

        if (token) {
            unsubscribe();
        }
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <Helmet>
                <title>Unsubscribe | TechPixe</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100 dark:border-slate-800">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400">Processing your request...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Unsubscribed</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
                        <Link to="/" className="inline-block px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors font-medium">
                            Return to Home
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
                        <Link to="/" className="inline-block px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors font-medium">
                            Return to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
