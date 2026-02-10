import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPage from './pages/BlogPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Unsubscribe from './pages/Unsubscribe';

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-300 font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-grow w-full">
            {children}
        </main>
        <Footer />
    </div>
);

import AdminSidebar from './components/AdminSidebar';

// Admin Layout Wrapper
const AdminLayout = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // Protect Admin Routes
    if (!user && location.pathname !== '/login') {
        return <Navigate to="/login" replace />;
    }

    // Role-based protection: if logged in but not admin/editor, redirect to home with error (or just home)
    if (user && !['admin', 'editor'].includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-300 overflow-hidden transition-colors duration-200">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50">
                <AdminSidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64 min-w-0 overflow-hidden h-full">
                <main className="flex-1 overflow-y-auto p-8 focus:outline-none">
                    {children}
                </main>
            </div>
        </div>
    );
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={
                <PublicLayout>
                    <Home />
                </PublicLayout>
            } />
            <Route path="/blog/:slug" element={
                <PublicLayout>
                    <BlogPage />
                </PublicLayout>
            } />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

            {/* Auth Route - Special Case (No Navbar usually, or specialized) */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <AdminLayout>
                    <AdminDashboard />
                </AdminLayout>
            } />
            <Route path="/admin/create" element={
                <AdminLayout>
                    <CreateBlog />
                </AdminLayout>
            } />
            <Route path="/admin/edit/:id" element={
                <AdminLayout>
                    <EditBlog />
                </AdminLayout>
            } />

            <Route path="/unsubscribe/:token" element={<Unsubscribe />} />

            {/* Catch all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Helmet>
                    <title template="%s | TechPixe">TechPixe</title>
                    <meta name="description" content="TechPixe: Your premier source for deep technical analysis, AI research, and strategic insights on the future of autonomous technology and engineering." />
                    <meta name="keywords" content="TechPixe, AI, Artificial Intelligence, Autonomous Agents, Technology Blog, Engineering Insights, Machine Learning, Future of Work" />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="TechPixe - Future of Autonomous AI & Technology" />
                    <meta property="og:description" content="Deep technical analysis and strategic insights for engineering leaders." />
                    <meta property="og:image" content="https://techpixe.com/og-image.jpg" /> {/* Replace with actual image URL if available */}
                    <meta property="og:url" content="https://techpixe.com/" />
                    <meta property="og:site_name" content="TechPixe" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="TechPixe - Future of Autonomous AI & Technology" />
                    <meta name="twitter:description" content="Deep technical analysis and strategic insights for engineering leaders." />
                    <meta name="twitter:image" content="https://techpixe.com/og-image.jpg" />
                </Helmet>
                <ScrollToTop />
                <Toaster position="top-center" reverseOrder={false} />
                <AppRoutes />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
