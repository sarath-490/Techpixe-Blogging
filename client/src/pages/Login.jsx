import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    // Reset Flow States
    const [resetMode, setResetMode] = useState(false); // false, 'request', 'verify'
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !loading) {
            navigate('/admin');
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        setError('');
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/admin');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleResetRequest = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/reset-request', { email });
            toast.success(res.data.message);
            setResetMode('verify');
        } catch (err) {
            toast.error(err.response?.data?.error || "Request failed");
        }
    };

    const handleResetVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/reset-verify', { email, code: resetCode, newPassword });
            toast.success(res.data.message);
            setResetMode(false);
            setPassword('');
        } catch (err) {
            toast.error(err.response?.data?.error || "Reset failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="animate-spin h-8 w-8 text-cyan-500" />
        </div>
    );

    // RESET VERIFY UI
    if (resetMode === 'verify') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <Helmet>
                    <title>Reset Password | TechPixe</title>
                </Helmet>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800">
                    <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">New Password</h2>
                    <form onSubmit={handleResetVerify} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Secret Code (Check Server Terminal)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                required
                                placeholder="Enter 6-digit code"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Min 6 characters"
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                            Set New Password
                        </button>
                        <button type="button" onClick={() => setResetMode(false)} className="w-full text-sm text-slate-500 hover:text-cyan-500 mt-4">
                            Back to Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // RESET REQUEST UI
    if (resetMode === 'request') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <Helmet>
                    <title>Reset Password | TechPixe</title>
                </Helmet>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800">
                    <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">Reset Password</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Enter your email to receive a secret code in the server terminal.</p>
                    <form onSubmit={handleResetRequest} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                            Generate Secret Code
                        </button>
                        <button type="button" onClick={() => setResetMode(false)} className="w-full text-sm text-slate-500 hover:text-cyan-500 mt-4">
                            Back to Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // DEFAULT LOGIN UI
    return (
        <>
            <Helmet>
                <title>Admin Login - AI Insights</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="w-full max-w-md p-8 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl relative z-10 mx-4">
                    <div className="mb-8 text-center">
                        <Link to="/" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>
                        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Sign in to manage your content
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loggingIn}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loggingIn ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                        </button>

                        <p className="text-center mt-2">
                            <button type="button" onClick={() => setResetMode('request')} className="text-sm text-slate-500 hover:text-cyan-500 transition-colors">
                                Forgot Password?
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
