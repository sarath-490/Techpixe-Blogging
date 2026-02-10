import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Eye, TrendingUp, Users, MessageSquare, Activity, FileText, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../utils/cn';

const StatsCard = ({ title, value, icon: Icon, change, trend }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
            {change && (
                <div className={cn("flex items-center mt-2 text-sm", trend === 'up' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                    {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1 rotate-180" />}
                    <span>{change}</span>
                    <span className="text-gray-400 dark:text-slate-500 ml-1">vs last month</span>
                </div>
            )}
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
            <Icon className="h-6 w-6" />
        </div>
    </div>
);

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock data for chart - ideally fetch from backend analytics endpoint
    const chartData = [
        { name: 'Mon', views: 400 },
        { name: 'Tue', views: 300 },
        { name: 'Wed', views: 550 },
        { name: 'Thu', views: 700 },
        { name: 'Fri', views: 450 },
        { name: 'Sat', views: 800 },
        { name: 'Sun', views: 600 },
    ];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/posts');
            if (data.success) {
                setPosts(data.data);
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await api.delete(`/posts/${id}`);
                setPosts(posts.filter(post => post._id !== id));
                toast.success('Blog deleted successfully');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete blog');
            }
        }
    };

    const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);

    return (
        <>
            <Helmet>
                <title>Dashboard - AI Insights Admin</title>
            </Helmet>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h1>
                        <p className="text-gray-500 dark:text-slate-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                    </div>
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                        <Link
                            to="/"
                            target="_blank"
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all hover:shadow-md"
                        >
                            <Globe className="mr-2 h-5 w-5 text-cyan-500" /> View Site
                        </Link>
                        <Link
                            to="/admin/create"
                            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Create Blog
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Blogs" value={posts.length} icon={FileText} change="+12%" trend="up" />
                    <StatsCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} change="+8%" trend="up" />
                    <StatsCard title="Active Users" value="1,240" icon={Users} change="+2%" trend="up" /> {/* Mock */}
                    <StatsCard title="New Comments" value="34" icon={MessageSquare} change="-5%" trend="down" /> {/* Mock */}
                </div>

                {/* Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Traffic Overview</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                                    <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                                        itemStyle={{ color: '#0f172a' }}
                                    />
                                    <Area type="monotone" dataKey="views" stroke="#2563eb" fillOpacity={1} fill="url(#colorViews)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Activity / Categories */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
                        <ul className="space-y-4">
                            {posts.slice(0, 5).map((post, idx) => (
                                <li key={post._id} className="flex items-center space-x-3 pb-3 border-b border-gray-50 dark:border-slate-800 last:border-0 last:pb-0">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">New blog created</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{post.title}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-slate-500">{format(new Date(post.createdAt), 'MMM d')}</span>
                                </li>
                            ))}
                            {posts.length === 0 && <p className="text-gray-400 dark:text-slate-500 text-sm">No recent activity.</p>}
                        </ul>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Blogs</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                            <thead className="bg-gray-50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                                {posts.map((post) => (
                                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-800" src={post.featuredImage} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{post.title}</div>
                                                    <div className="text-sm text-gray-500 dark:text-slate-400 flex items-center"><Eye className="h-3 w-3 mr-1" /> {post.views} views</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                                Published
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/admin/edit/${post._id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(post._id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Password Update Section (Secret Code Method) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 transition-colors">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Security</h3>
                    <div className="max-w-md space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                                To reset your password, generate a secret code which will appear in the <strong>Server Terminal</strong>.
                            </p>
                            <button
                                onClick={async () => {
                                    if (!user?.email) return toast.error("User email not found");
                                    try {
                                        const res = await api.post('/auth/reset-request', { email: user.email });
                                        toast.success(res.data.message);
                                    } catch (err) {
                                        toast.error(err.response?.data?.error || "Request failed");
                                    }
                                }}
                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                            >
                                Generate Secret Code
                            </button>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const code = e.target.code.value;
                            const newPassword = e.target.newPassword.value;

                            if (!code || !newPassword) return toast.error('Please fill all fields');

                            try {
                                const { data } = await api.post('/auth/reset-verify', {
                                    email: user.email,
                                    code,
                                    newPassword
                                });
                                if (data.success) {
                                    toast.success('Password updated successfully');
                                    e.target.reset();
                                }
                            } catch (err) {
                                toast.error(err.response?.data?.error || 'Failed to update password');
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Secret Code (from Terminal)</label>
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="Enter 6-digit code"
                                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Min 6 characters"
                                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                />
                            </div>
                            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Set New Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}


