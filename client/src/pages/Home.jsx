import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import Newsletter from '../components/Newsletter';
import { Loader2, TrendingUp, Mail, ChevronRight, ArrowRight, Zap, Globe, Users } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const { isDark } = useTheme();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/posts', {
                    params: { category, search }
                });
                if (data.success) {
                    setPosts(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category, search]);

    const featuredPost = !search && !category && posts.length > 0 ? posts[0] : null;
    const listPosts = featuredPost ? posts.slice(1) : posts;

    return (
        <>
            <Helmet>
                <title>{search ? `Search: ${search} - TechPixe` : category ? `${category} - TechPixe` : 'TechPixe | Future of Autonomous AI & Technology'}</title>
                <meta name="description" content="TechPixe: Your premier source for deep technical analysis, AI research, and strategic insights on the future of autonomous technology and engineering." />
                <link rel="canonical" href="https://techpixe.com" />

                {/* Global Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://techpixe.com" />
                <meta property="og:title" content="TechPixe | Future of Autonomous AI & Technology" />
                <meta property="og:description" content="Deep technical analysis and strategic insights for engineering leaders." />
                <meta property="og:image" content="https://techpixe.com/og-image.jpg" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="TechPixe | Future of Autonomous AI & Technology" />
                <meta name="twitter:description" content="Deep technical analysis and strategic insights for engineering leaders." />
                <meta name="twitter:image" content="https://techpixe.com/og-image.jpg" />

                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "TechPixe",
                        "url": "https://techpixe.com",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://techpixe.com/?search={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen">
                {/* Hero Section */}
                {!search && !category && (
                    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950">
                        {/* Abstract Background */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                <span>AI Insights & Analysis</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight text-slate-900 dark:text-slate-100 mb-8 leading-[1.1] animate-slide-up drop-shadow-2xl">
                                Deep Analysis of <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 font-bold">
                                    AI Developments
                                </span>
                            </h1>

                            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-200 mb-12 leading-relaxed font-light animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                Technical insights, research updates, and practical guides for developers and researchers working with artificial intelligence.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <Link to="/?category=Tutorials" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-1 flex items-center justify-center">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Explore Analysis
                                </Link>
                                <a href="#newsletter" className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 text-white border border-slate-700 font-medium text-lg rounded-xl hover:bg-slate-800 hover:border-cyan-500/50 transition-all backdrop-blur-sm flex items-center justify-center">
                                    <Mail className="w-5 h-5 mr-2" />
                                    Subscribe Free
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* Trust Signals */}
                {!search && !category && (
                    <section className="py-12 border-y border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-8">
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">Read by developers & researchers at</p>
                            </div>
                            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-90">
                                {['Startups', 'Tech Companies', 'Research Labs', 'Universities'].map((org) => (
                                    <div key={org} className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-bold">
                                        {org}
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-8">
                                <p className="text-sm text-slate-400">
                                    Join <span className="text-cyan-400 font-medium">thousands of readers</span> staying updated on AI developments
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Featured Post (Glass Card) */}
                {!search && !category && featuredPost && (
                    <section className="-mt-16 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                        <Link to={`/blog/${featuredPost.slug}`} className="group relative block rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[21/9] md:aspect-[2.5/1] bg-slate-950">
                            <img
                                src={featuredPost.featuredImage}
                                alt={featuredPost.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-20"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/10 opacity-100 transition-opacity duration-300 group-hover:via-slate-950/90"></div>

                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                                <div className="flex items-center space-x-3 mb-4 text-cyan-400 text-sm font-bold tracking-wider uppercase">
                                    <span>{featuredPost.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                                    <span>{format(new Date(featuredPost.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:text-cyan-100 transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-slate-300 text-lg line-clamp-2 md:line-clamp-3 mb-6 font-light">
                                    {featuredPost.excerpt}
                                </p>
                                <span className="inline-flex items-center text-white font-medium group-hover:translate-x-2 transition-transform">
                                    Read Analysis <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            </div>
                        </Link>
                    </section>
                )}

                {/* Main Feed */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-16">

                        <div className="lg:w-2/3">
                            <div className="flex items-baseline justify-between mb-12 border-b border-slate-200 dark:border-slate-800 pb-4">
                                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                                    {search ? `Search: ${search}` : category || 'Latest Analysis'}
                                </h2>
                                {!search && !category && (
                                    <Link to="/?category=AI News" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium tracking-wide flex items-center">
                                        View Archive <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500 w-10 h-10" /></div>
                            ) : (
                                <div className="space-y-12">
                                    {listPosts.map((post) => (
                                        <article key={post._id} className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                            <Link to={`/blog/${post.slug}`} className="md:col-span-5 block aspect-video rounded-2xl overflow-hidden ring-1 ring-white/10 relative">
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:sepia-[.2]"
                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600' }}
                                                />
                                            </Link>

                                            <div className="md:col-span-7 flex flex-col h-full justify-center">
                                                <div className="flex items-center space-x-3 mb-3 text-xs font-semibold tracking-wider uppercase">
                                                    <Link to={`/?category=${post.category}`} className="text-cyan-400 hover:text-cyan-300">
                                                        {post.category}
                                                    </Link>
                                                    <span className="text-slate-700">|</span>
                                                    <span className="text-slate-500">{format(new Date(post.createdAt), 'MMMM d')}</span>
                                                </div>

                                                <Link to={`/blog/${post.slug}`} className="block">
                                                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 font-light opacity-90 group-hover:opacity-100 transition-opacity">
                                                        {post.excerpt}
                                                    </p>
                                                </Link>

                                                <div className="flex items-center mt-auto pt-2">
                                                    <div className="flex items-center text-xs text-slate-500 font-medium">
                                                        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-[10px] text-white mr-2 border border-slate-600">
                                                            {post.author?.[0] || 'AI'}
                                                        </div>
                                                        <span className="text-slate-400">{post.author || 'Editorial Team'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}

                                    {listPosts.length === 0 && (
                                        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                                            <p className="text-slate-500">We couldn't find any articles matching your search.</p>
                                            <button onClick={() => window.location.href = '/'} className="mt-4 text-cyan-400 hover:underline">Return Home</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modern Sidebar */}
                        <aside className="lg:w-1/3 space-y-12">

                            {/* Topics Cloud */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Explore Topics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Agentic AI', 'LLM Ops', 'Vector DBs', 'AI Ethics', 'Robotics', 'Future of Work', 'Autonomous Systems', 'Neural Networks', 'Prompt Engineering', 'AI Agents'].map(tag => (
                                        <Link key={tag} to={`/?category=${tag}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-medium hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-all">
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <Newsletter />

                            {/* About Section */}
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/50">
                                <h4 className="flex items-center text-sm font-bold text-slate-900 dark:text-white mb-3">
                                    <Globe className="h-4 w-4 text-cyan-400 mr-2" />
                                    Our Mission
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                    We provide deep technical analysis and strategic insights for engineering leaders building the future of autonomous AI systems. No hype, just signal.
                                </p>
                                <div className="flex items-center justify-between">
                                    <Link to="/about" className="text-xs text-cyan-400 hover:underline">Learn more →</Link>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <Users className="h-3 w-3 mr-1" />
                                        Since 2024
                                    </div>
                                </div>
                            </div>

                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
