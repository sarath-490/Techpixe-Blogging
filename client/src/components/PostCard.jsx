import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function PostCard({ post }) {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={post.featuredImage || 'https://via.placeholder.com/800x400'} alt={post.title} />
            </div>
            <div className="flex-1 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">
                        <Link to={`/?category=${post.category}`} className="hover:underline">
                            {post.category}
                        </Link>
                    </p>
                    <Link to={`/blog/${post.slug}`} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</p>
                        <p className="mt-3 text-base text-gray-500 dark:text-slate-400 line-clamp-3">{post.excerpt}</p>
                    </Link>
                </div>
                <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                        <span className="sr-only">{post.author}</span>
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-300 font-bold text-xs">AI</div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.author}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500 dark:text-slate-400">
                            <time dateTime={post.createdAt}>{format(new Date(post.createdAt), 'MMM d, yyyy')}</time>
                            <span aria-hidden="true">&middot;</span>
                            <span>{Math.ceil(post.content.length / 1000)} min read</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
