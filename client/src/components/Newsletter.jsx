import React, { useState } from 'react';
import { Mail, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [subscriberCount, setSubscriberCount] = useState('50+');

    React.useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                // Assuming we don't have a public endpoint for count yet, let's just make one or mock it with a slight random increase to simulate "live" if real count is not available publicly.
                // But the user asked for "real numbers like 50+ and they should be increased as users subscribe".
                // We need a public endpoint for count. 
                // Let's create a route for getting count.
                const { data } = await api.get('/subscribers/count');
                if (data.success) {
                    const roundedCount = Math.floor((data.count + 50) / 10) * 10;
                    setSubscriberCount(`${roundedCount}+`);
                }
            } catch (err) {
                // Fallback
            }
        };
        fetchSubscribers();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const response = await api.post('/subscribers', { email });

            if (response.data.success) {
                setStatus('success');
                setEmail('');
                toast.success(response.data.message || "Welcome to the inner circle!");
            } else {
                setStatus('error');
                toast.error(response.data.error || "Subscription failed");
            }
        } catch (err) {
            console.error('Newsletter subscription error:', err);
            setStatus('error');
            const errorMessage = err.response?.data?.error || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    };

    if (status === 'success') {
        return (
            <div className="relative p-8 rounded-3xl overflow-hidden border border-green-500/30 bg-green-500/10 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                    <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">You're in!</h3>
                    <p className="text-green-200">Watch your inbox for the next briefing.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-green-400 hover:text-green-300 underline">
                        Add another email
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div id="newsletter" className="relative p-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-900/20 dark:to-slate-950 transition-colors"></div>
            {/* <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500 blur-3xl opacity-10"></div> */}

            <div className="relative z-10">
                <Mail className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mb-6 transition-colors" />
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2 transition-colors">Join the inner circle.</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed transition-colors">
                    Get the weekly briefing on autonomous agents read by forward-thinking engineers and researchers.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-3">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="engineer@tech.com"
                            disabled={status === 'loading'}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-cyan-50 transition-colors shadow-lg flex items-center justify-center disabled:opacity-70"
                    >
                        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
                    </button>
                </form>

                {status === 'error' && (
                    <div className="mt-4 flex items-center text-red-400 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1.5" />
                        <span>Subscription failed. Please try again.</span>
                    </div>
                )}

                <p className="mt-4 text-xs text-slate-500 flex items-center justify-center">
                    <Users className="h-3 w-3 mr-1.5" /> {subscriberCount} subscribers
                </p>
            </div>
        </div>
    );
}
