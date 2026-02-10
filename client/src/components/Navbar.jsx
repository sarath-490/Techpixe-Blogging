import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronRight, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme, isDark } = useTheme();

    // Scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
            setIsOpen(false);
        }
    };

    const navLinks = [
        { name: 'Analysis', path: '/?category=AI News' },
        { name: 'Agents', path: '/?category=AI Employees' },
        { name: 'Tools', path: '/?category=AI Tools' },
        { name: 'Ethics', path: '/?category=Ethics' },
    ];

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled
                ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 shadow-sm"
                : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl group-hover:shadow-cyan-500/25 group-hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <span className="relative font-black text-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 block">
                                    A
                                </span>
                            </div>
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-500 dark:bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight font-display">
                                AI
                                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent"> Insights</span>
                            </span>
                            <span className="text-[8px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors font-medium">
                                Autonomous Intelligence
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Toggle theme"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <form onSubmit={handleSearch} className="hidden lg:block relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search analysis..."
                                className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 w-48 focus:w-64 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none placeholder-slate-500 dark:placeholder-slate-400"
                            />
                        </form>

                        <a
                            href="#newsletter"
                            className="hidden md:flex items-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-bold rounded-full hover:bg-slate-800 dark:hover:bg-cyan-50 transition-colors shadow-lg hover:shadow-cyan-500/10"
                        >
                            Subscribe
                        </a>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-5 shadow-xl">
                    <div className="px-4 py-6 space-y-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search topics..."
                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:border-cyan-500 outline-none"
                            />
                        </form>
                        <div className="space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-cyan-600 dark:hover:text-white rounded-lg transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex justify-between items-center">
                                        {link.name}
                                        <ChevronRight className="h-4 w-4 opacity-50" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <a href="#newsletter" className="block w-full text-center py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors">
                                Subscribe to Newsletter
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
