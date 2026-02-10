import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail, ArrowUpRight, Facebook, Instagram } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDark } = useTheme();

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const response = await api.post('/subscribers', { email });

            if (response.data.success) {
                setEmail('');
                toast.success(response.data.message || "Successfully subscribed!");
            } else {
                toast.error(response.data.error || "Subscription failed");
            }
        } catch (err) {
            console.error('Footer subscription error:', err);
            const errorMessage = err.response?.data?.error || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 pt-20 pb-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white via-slate-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg group-hover:shadow-cyan-500/25 group-hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                    <span className="relative font-black text-lg bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 block">
                                        A
                                    </span>
                                </div>
                                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-black text-slate-800 dark:text-white tracking-tight font-display">
                                    AI
                                    <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent"> Insights</span>
                                </span>
                                <span className="text-[8px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors font-medium">
                                    Autonomous Intelligence
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xs">
                            The premier publication for engineering leaders tracking the autonomous workforce revolution.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <SocialLink icon={Twitter} href="https://x.com/Techpixe90" />
                            <SocialLink icon={Linkedin} href="https://www.linkedin.com/company/techpixeofficial/" />
                            <SocialLink icon={Facebook} href="https://www.facebook.com/techpixe?mibextid=ZbWKwL" />
                            <SocialLink icon={Instagram} href="https://www.instagram.com/techpixe/" />
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="md:col-span-2">
                        <h3 className="text-slate-900 dark:text-slate-200 font-bold mb-6 text-sm">Analysis</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li><FooterLink to="/?category=AI News">News</FooterLink></li>
                            <li><FooterLink to="/?category=AI Tools">Tools</FooterLink></li>
                            <li><FooterLink to="/?category=AI Employees">Agents</FooterLink></li>
                            <li><FooterLink to="/?category=Ethics">Ethics</FooterLink></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-slate-900 dark:text-slate-200 font-bold mb-6 text-sm">Company</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                            <li><FooterLink to="/about">About</FooterLink></li>
                            <li><FooterLink to="/contact">Contact</FooterLink></li>

                        </ul>
                    </div>

                    {/* Subscribe Column */}
                    <div className="md:col-span-4">
                        <h3 className="text-slate-900 dark:text-slate-200 font-bold mb-6 text-sm">Stay ahead of the curve</h3>
                        <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                            <div className="flex">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-300 px-4 py-2.5 rounded-l-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-full placeholder-slate-400 dark:placeholder-slate-400"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white px-5 py-2.5 rounded-r-lg text-sm font-bold hover:from-cyan-700 hover:to-blue-700 dark:hover:from-cyan-600 transition-all border-l-0 disabled:opacity-50 flex items-center"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white/30 rounded-full animate-spin"></div> : 'Join'}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                Join thousands of readers staying updated on AI developments
                            </p>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; 2026 AI Insights Media. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
                        <Link to="/sitemap" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const SocialLink = ({ icon: Icon, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white hover:bg-cyan-50 dark:hover:bg-cyan-950/30 hover:border-cyan-500/50 transition-all duration-300 group"
    >
        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
    </a>
);

const FooterLink = ({ to, children }) => (
    <Link to={to} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors flex items-center group">
        {children}
    </Link>
);
