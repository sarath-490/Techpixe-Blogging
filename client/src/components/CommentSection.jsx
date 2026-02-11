import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/comments/${postId}`);
            if (data.success) {
                setComments(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch comments:', err);
            setComments([]);
        }
    };

    const [name, setName] = useState('');

    // Removed auto-fill useEffect as per user request to keep it empty by default


    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (!name.trim()) {
            toast.error("Please enter your name");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                content: text,
                name: name
            };

            const { data } = await api.post(`/comments/${postId}`, payload);

            if (data.success) {
                setComments([...comments, data.data]);
                setText('');
                if (!user) setName(''); // Only clear name if guest
                toast.success('Comment posted');
            } else {
                toast.error('Failed to post comment');
            }
        } catch (err) {
            console.error('CommentSection error:', err);
            toast.error('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('[Frontend] handleDelete called with ID:', id);
        if (!window.confirm("Delete this comment?")) return;
        try {
            console.log('[Frontend] Sending DELETE request...');
            const res = await api.delete(`/comments/${id}`);
            console.log('[Frontend] DELETE response:', res);
            setComments(comments.filter(c => c._id !== id));
            toast.success("Deleted");
        } catch (err) {
            console.error('[Frontend] Delete error:', err);
            const errorMessage = err.response?.data?.error || "Failed to delete comment";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="space-y-8">
            {/* Input Form */}
            <form onSubmit={handlePostComment} className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
                <h4 className="text-slate-900 dark:text-slate-100 font-bold mb-4 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" /> Leave a thought
                </h4>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Your Name (Required)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-300 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                        required
                    />
                </div>

                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share your perspective..."
                        rows="3"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-slate-900 dark:text-slate-300 text-sm focus:border-cyan-500 focus:outline-none resize-none transition-colors"
                    ></textarea>
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute bottom-3 right-3 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors disabled:opacity-50 shadow-md"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-4 animate-fade-in group">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-cyan-700 dark:text-cyan-400">{comment.name}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy') : 'Just now'}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{comment.content}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-1 ml-2">
                                {user && (user.role === 'admin' || (comment.user && (comment.user === user._id || comment.user === user.id))) && (
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        title="Delete comment"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm italic py-4">No comments yet. Be the first to analyze this.</p>
                )}
            </div>
        </div>
    );
}
