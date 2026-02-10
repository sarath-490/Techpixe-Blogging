import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditBlog() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('AI News');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [image, setImage] = useState('');
    const [imageInputType, setImageInputType] = useState('upload'); // 'upload' or 'url'
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get('/posts'); // In real app, fetch by ID endpoint if available, but filtering list works for now
                if (data.success) {
                    const p = data.data.find(post => post._id === id);
                    if (p) {
                        setTitle(p.title);
                        setCategory(p.category);
                        setContent(p.content);
                        setExcerpt(p.excerpt);
                        setImage(p.featuredImage);
                        // Check if existing image is a URL or uploaded path to set input type preference?
                        // Actually, just default to upload is fine, or url if it's external.
                        if (p.featuredImage && p.featuredImage.startsWith('http')) {
                            setImageInputType('url');
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load blog');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImage(data);
            setUploading(false);
            toast.success('Image uploaded');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/posts/${id}`, {
                title, category, content, excerpt, featuredImage: image
            });
            if (data.success) {
                toast.success('Blog updated successfully');
                navigate('/admin');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to update blog');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="animate-spin text-cyan-600 w-8 h-8" /></div>;

    return (
        <div className="max-w-5xl mx-auto">
            <Helmet><title>Edit Blog - Admin</title></Helmet>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <button onClick={() => navigate('/admin')} className="mr-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Blog</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="block w-full border border-gray-300 dark:border-slate-700 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-shadow" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full border border-gray-300 dark:border-slate-700 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-shadow">
                            <option>AI News</option>
                            <option>AI Tools</option>
                            <option>AI Employees</option>
                            <option>Machine Learning</option>
                            <option>Ethics</option>
                            <option>Tutorials</option>
                            <option>Opinion</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Featured Image</label>
                    <div className="flex space-x-4 mb-3">
                        <button type="button" onClick={() => setImageInputType('upload')} className={`px-3 py-1 text-sm rounded-full ${imageInputType === 'upload' ? 'bg-cyan-100 text-cyan-700 font-medium' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Upload</button>
                        <button type="button" onClick={() => setImageInputType('url')} className={`px-3 py-1 text-sm rounded-full ${imageInputType === 'url' ? 'bg-cyan-100 text-cyan-700 font-medium' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Image URL</button>
                    </div>

                    {imageInputType === 'upload' ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <input type="file" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition-colors" />
                            </div>
                            {uploading && <Loader2 className="animate-spin text-cyan-600 w-5 h-5" />}
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="block w-full border border-gray-300 dark:border-slate-700 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-shadow"
                        />
                    )}

                    {image && (
                        <div className="mt-4 relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                            <img src={image} onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Error+Loading+Image'} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excerpt</label>
                    <textarea rows="3" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="block w-full border border-gray-300 dark:border-slate-700 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-shadow" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content</label>
                    <div className="prose-editor text-slate-900 dark:text-white">
                        <ReactQuill theme="snow" value={content} onChange={setContent} className="h-64 mb-12" />
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                    <button type="button" onClick={() => navigate('/admin')} className="mr-3 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                        Cancel
                    </button>
                    <button type="submit" className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                        <Save className="w-4 h-4 mr-2" /> Update Blog
                    </button>
                </div>
            </form>
        </div>
    );
}
