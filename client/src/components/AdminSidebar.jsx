import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Users, MessageSquare, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';

export default function AdminSidebar() {
    const { logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Blogs', icon: FileText, path: '/admin/create' }, // Simplify for now, ideally list page
        // { name: 'Users', icon: Users, path: '/admin/users' },
        // { name: 'Comments', icon: MessageSquare, path: '/admin/comments' },
        // { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col shadow-xl">
            <div className="h-16 flex items-center justify-center border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-wider">ADMIN PANEL</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/admin'} // Exact match for dashboard home
                        className={({ isActive }) => clsx(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group",
                            isActive
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                    onClick={toggleTheme}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {isDark ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
