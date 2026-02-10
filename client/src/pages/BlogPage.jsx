import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { format } from 'date-fns';
import api from '../utils/api';
import CommentSection from '../components/CommentSection';
import { Loader2, Calendar, Clock, Twitter, Linkedin, Facebook } from 'lucide-react';
import 'highlight.js/styles/atom-one-dark.css';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';
import DOMPurify from 'dompurify';

export default function BlogPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');
    const { isDark } = useTheme();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/posts/${slug}`);
                if (data.success) {
                    setPost(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    // Scroll Progress & Dynamic TOC logic
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);

            // Active TOC item
            const headingElements = document.querySelectorAll('h2, h3');
            let currentId = '';
            headingElements.forEach((heading) => {
                const top = heading.getBoundingClientRect().top;
                if (top < 150) {
                    currentId = heading.id;
                }
            });
            if (currentId) setActiveId(currentId);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [post]);

    // Parse headings from content after render
    // Parse headings from content after render AND add IDs for navigation
    useEffect(() => {
        if (post?.content) {
            // We need to wait for the DOM to update with the new content
            setTimeout(() => {
                const article = document.querySelector('article');
                if (!article) return;

                const elements = Array.from(article.querySelectorAll('h2, h3'))
                    .map((elem) => {
                        // Generate ID if missing
                        if (!elem.id) {
                            const id = elem.textContent
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[^\w-]/g, '');
                            elem.id = id;
                        }
                        return {
                            id: elem.id,
                            text: elem.textContent,
                            level: Number(elem.tagName.substring(1))
                        };
                    });
                setHeadings(elements);
            }, 100);
        }
    }, [post]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="text-center">
                <Loader2 className="animate-spin text-cyan-500 w-12 h-12 mb-4 mx-auto" />
                <p className="text-slate-500 animate-pulse">Loading analysis...</p>
            </div>
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="mb-6">The analysis you are looking for might have been moved or deleted.</p>
            <Link to="/" className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-50 transition-colors">
                Return Home
            </Link>
        </div>
    );

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = post ? `${post.title} 🚀 #AIInsights #FutureOfWork` : '';

    const handleShare = (platform) => {
        let url = '';
        if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        } else if (platform === 'linkedin') {
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        } else if (platform === 'facebook') {
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        }
        window.open(url, '_blank');
    };

    // Custom components for ReactMarkdown
    const MarkdownComponents = {
        h2: ({ node, ...props }) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return <h2 id={id} className="text-2xl font-bold mt-12 mb-6 text-slate-900 dark:text-white scroll-mt-24" {...props} />
        },
        h3: ({ node, ...props }) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return <h3 id={id} className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100 scroll-mt-24" {...props} />
        },
        a: ({ node, href, ...props }) => {
            // Determine if internal link
            const isInternal = href.startsWith('/') || href.includes(window.location.hostname);
            if (isInternal) {
                return <Link to={href} className="text-cyan-600 dark:text-cyan-400 hover:underline" {...props} />
            }
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline" {...props} />
        },
        img: ({ node, ...props }) => (
            <img className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 my-8 w-full" {...props} loading="lazy" />
        )
    };

    return (
        <>
            <Helmet>
                <title>{post.title} | AI Insights</title>
                <meta name="description" content={post.excerpt} />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.featuredImage} />
                <meta property="article:published_time" content={post.createdAt} />
                <meta property="article:author" content={post.author} />
                <meta property="article:section" content={post.category} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:image" content={post.featuredImage} />

                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "image": [post.featuredImage],
                        "datePublished": post.createdAt,
                        "dateModified": post.updatedAt || post.createdAt,
                        "author": [{
                            "@type": "Person",
                            "name": post.author || "Editorial Team",
                            "url": "https://ai-insights.tech/about"
                        }],
                        "publisher": {
                            "@type": "Organization",
                            "name": "AI Insights",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://ai-insights.tech/logo.png"
                            }
                        },
                        "description": post.excerpt
                    })}
                </script>
            </Helmet>

            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300">

                {/* Scroll Progress Bar */}
                <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-slate-200 dark:bg-slate-800">
                    <div
                        className="h-full bg-cyan-500 transition-all duration-150 ease-out"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>

                {/* Header Section */}
                <div className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 text-cyan-600 dark:text-cyan-400 text-sm font-bold tracking-widest uppercase mb-6">
                        <Link to={`/?category=${post.category}`} className="hover:underline">{post.category}</Link>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-sm font-medium">
                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 mr-3 flex items-center justify-center text-white font-bold border border-slate-200 dark:border-slate-700">
                                {post.author?.[0] || 'A'}
                            </div>
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 opacity-70" />
                            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 opacity-70" />
                            {Math.ceil(post.content.length / 1000)} min read
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600' }}
                        />
                    </div>
                </div>

                {/* Content Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 relative">

                        {/* LEFT: Dynamic Table of Contents (Desktop) */}
                        <aside className="hidden xl:block w-64 pt-4 shrink-0">
                            <div className="sticky top-32">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-4 border-l-2 border-transparent">On this page</h4>
                                <ul className="space-y-1 text-sm">
                                    {headings.map((heading) => (
                                        <li key={heading.id}>
                                            <a
                                                href={`#${heading.id}`}
                                                className={clsx(
                                                    "block py-2 px-4 border-l-2 transition-all duration-200",
                                                    activeId === heading.id
                                                        ? "border-cyan-500 text-cyan-600 dark:text-cyan-400 font-medium bg-cyan-50/50 dark:bg-cyan-900/10"
                                                        : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                {heading.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* CENTER: Main Content */}
                        <article className="lg:flex-1 max-w-3xl mx-auto w-full min-w-0">
                            <div className="prose prose-lg dark:prose-invert max-w-none 
                                prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:scroll-mt-24
                                prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-8 prose-p:font-light
                                prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:underline-offset-4 hover:prose-a:text-cyan-500
                                prose-blockquote:border-l-cyan-500 prose-blockquote:bg-slate-100 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800
                                prose-pre:bg-slate-900 dark:prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-xl"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                            >
                            </div>

                            {/* Tags & Mobile Share */}
                            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-400 font-medium">#{post.category.replace(' ', '')}</span>
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-400 font-medium">#AI</span>
                                    </div>
                                    <div className="lg:hidden flex space-x-4">
                                        <button onClick={() => handleShare('twitter')} className="text-slate-500 hover:text-cyan-500"><Twitter /></button>
                                        <button onClick={() => handleShare('linkedin')} className="text-slate-500 hover:text-blue-500"><Linkedin /></button>
                                        <button onClick={() => handleShare('facebook')} className="text-slate-500 hover:text-blue-600"><Facebook /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="mt-16 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
                                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 mb-6">Discussion</h3>
                                <CommentSection postId={post._id} theme={isDark ? 'dark' : 'light'} />
                            </div>
                        </article>

                        {/* RIGHT: Share Buttons (Desktop) */}
                        <aside className="hidden lg:flex flex-col space-y-6 w-24 pt-4 shrink-0">
                            <div className="sticky top-32 flex flex-col space-y-4 items-center">
                                <p className="text-[10px] uppercase font-bold text-slate-500 text-center mb-2">Share</p>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:border-cyan-500 transition-all shadow-sm hover:shadow-cyan-500/20 flex items-center justify-center transform hover:scale-110"
                                    title="Share on Twitter"
                                >
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm hover:shadow-blue-600/20 flex items-center justify-center transform hover:scale-110"
                                    title="Share on LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-800 hover:border-blue-800 transition-all shadow-sm hover:shadow-blue-800/20 flex items-center justify-center transform hover:scale-110"
                                    title="Share on Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </button>
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}
