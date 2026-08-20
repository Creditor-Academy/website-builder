import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Globe, Layout, LogOut, Building2, Users, Activity, X, ShieldCheck,
    Image as ImageIcon, MessageSquare, User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { logoutUser } from '@/api/auth';

// Shared context passed to every dashboard page rendered inside the layout's Outlet
export interface DashboardOutletContext {
    isAdmin: boolean;
    setIsAdmin: (val: boolean | ((prev: boolean) => boolean)) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
}

export const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    let initials = '';
    if (parts.length > 1 && parts[1].length > 0) {
        initials = parts[0][0] + parts[1][0];
    } else if (parts[0] && parts[0].length > 0) {
        initials = parts[0][0];
    }
    return initials.toUpperCase();
};

// NavItem — supports router Link + active state
const NavItem = ({ icon, label, to, activeColor = 'text-white', hoverBg = 'hover:bg-slate-700', hoverText = 'hover:text-white', defaultText = 'text-slate-300' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = location.pathname === to;

    const handleClick = (e) => {
        e.preventDefault();
        navigate(to);
    };

    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-start gap-2 py-2 px-3 text-sm transition-all duration-300 group/nav-item rounded-full",
                isActive
                    ? `bg-gradient-to-r from-purple-600 to-indigo-600 ${activeColor} font-semibold shadow-lg shadow-purple-500/30`
                    : `${defaultText} ${hoverText} ${hoverBg}`
            )}
            onClick={handleClick}
        >
            <span className={cn("transition-colors duration-300", isActive ? activeColor : `${defaultText} ${hoverText}`)}>{icon}</span>
            {label}
        </Button>
    );
};

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    const user = JSON.parse(localStorage.getItem("user") || 'null');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userName, setUserName] = useState(user?.name || 'User');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isAdminRole = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'INSTITUTION_ADMIN';

    // Admin mode is derived from the URL: /admin/* is admin, /dashboard/* is user.
    // This makes the mode survive refresh and allows direct linking to admin pages.
    const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

    // All sidebar links are prefixed with the current mode's base path
    const base = isAdmin ? '/admin' : '/dashboard';

    // Switching mode = navigating between the /admin and /dashboard route trees
    const setIsAdmin = (val: boolean | ((prev: boolean) => boolean)) => {
        const next = typeof val === 'function' ? val(isAdmin) : val;
        navigate(next ? '/admin' : '/dashboard');
    };

    // Dashboard always uses light mode — strip dark class so landing page theme doesn't bleed in
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
        return () => {
            // Restore saved theme when leaving dashboard
            try {
                const saved = localStorage.getItem('buildora-theme');
                if (saved === 'dark') document.documentElement.classList.add('dark');
            } catch {}
        };
    }, []);

    // ✅ Listen for userUpdated event
    useEffect(() => {
        const handleUserUpdated = (e) => {
            setUserName(e.detail.name);
        };
        window.addEventListener("userUpdated", handleUserUpdated);
        return () => window.removeEventListener("userUpdated", handleUserUpdated);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        // Only admins may access the /admin route tree
        if (isAdmin && !isAdminRole) {
            navigate('/dashboard');
        }
    }, [user, isAdmin, isAdminRole, navigate]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logoutUser();
        } catch (err: any) {
            // 401 means session already expired — treat as successful logout
            if (err?.response?.status !== 401) {
                console.error(err);
            }
        } finally {
            localStorage.removeItem("user");
            setIsLoggingOut(false);
            navigate("/");
        }
    };

    const outletContext: DashboardOutletContext = {
        isAdmin,
        setIsAdmin,
        isSidebarOpen,
        setIsSidebarOpen,
        userName,
        setUserName,
    };

    return (
        <div className={cn(
            "h-screen flex font-sans selection:bg-primary/10 relative overflow-hidden",
            isAdmin ? "bg-white" : "bg-[#f8fafc]"
        )}>
            <Helmet>
                <title>Dashboard | Buildora</title>
            </Helmet>

            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-purple-900 to-indigo-950 border-r border-slate-700 flex flex-col justify-between z-50 rounded-tr-3xl rounded-br-3xl",
                    "lg:static lg:flex",
                    isMobile ? "transition-transform duration-300 ease-in-out" : "",
                    isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
                )}
            >
                <div className="p-4 shrink-0">
                    <div className="flex items-center gap-2.5 px-2">
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">
                            Buildora
                        </h1>
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto lg:hidden text-white hover:bg-slate-700 hover:text-white"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                <nav className="flex-1 px-4 py-1 space-y-0.5 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-1">Main Menu</p>
                    <NavItem icon={<Globe className="w-4 h-4" />} label="Dashboard" to={base} />
                    <NavItem icon={<Layout className="w-4 h-4" />} label="Templates" to={`${base}/templates`} />
                    <NavItem icon={<ImageIcon className="w-4 h-4" />} label="Assets" to={`${base}/assets`} />
                    <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Messages" to={`${base}/messages`} />
                    <NavItem icon={<UserIcon className="w-4 h-4" />} label="Profile" to={`${base}/profile`} />
                    {isAdmin && (
                        <div className="pt-1">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-1">System</p>
                            <NavItem icon={<Users className="w-4 h-4" />} label="Users" to="/admin/users" activeColor="text-white" />
                            {user?.role === 'SUPER_ADMIN' && (
                                <NavItem icon={<Building2 className="w-4 h-4" />} label="Organizations" to="/admin/organizations" activeColor="text-white" />
                            )}
                            <NavItem icon={<Layout className="w-4 h-4" />} label="Websites" to="/admin/websites" activeColor="text-white" />
                            {/* <NavItem icon={<LayoutTemplate className="w-4 h-4" />} label="Templates" to="/admin/admin-templates" activeColor="text-white" /> */}
                            <NavItem icon={<Activity className="w-4 h-4" />} label="Deployment Monitoring" to="/admin/deployment" activeColor="text-white" />
                            <NavItem icon={<ShieldCheck className="w-4 h-4" />} label="Audit Logs" to="/admin/audit" activeColor="text-white" />
                            {/* <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" to="/admin/settings" activeColor="text-white" /> */}
                        </div>
                    )}
                </nav>

                <div className="p-4 mt-auto space-y-3">
                    {/* ── Admin access card (only when NOT in admin mode) ── */}
                    {!isAdmin && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'INSTITUTION_ADMIN') && (
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 shadow-lg">
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />
                            <div className="absolute -bottom-2 -left-2 w-14 h-14 bg-white/10 rounded-full pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-white font-bold text-sm leading-tight">Admin Access</p>
                                <p className="text-white/70 text-[11px] mt-0.5 mb-3">Switch to manage your platform.</p>
                                <button
                                    onClick={() => setIsAdmin(true)}
                                    className="w-full bg-white text-indigo-700 font-bold text-xs py-2 rounded-xl hover:bg-indigo-50 transition-all active:scale-[0.98]"
                                >
                                    Go to Admin →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Exit admin mode (only when IN admin mode) ── */}
                    {isAdmin && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'INSTITUTION_ADMIN') && (
                        <button
                            onClick={() => setIsAdmin(false)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10"
                        >
                            <ShieldCheck className="w-4 h-4 text-purple-300" />
                            Exit Admin Mode
                        </button>
                    )}

                    <div className="flex items-center gap-2 p-2 rounded-xl border border-transparent hover:bg-white/5 transition-colors">
                        {/* Avatar → Profile page */}
                        <div
                            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer group/profile"
                            onClick={() => navigate(`${base}/profile`)}
                        >
                            <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm group-hover/profile:ring-2 group-hover/profile:ring-purple-400 transition-all">
                                    {getInitials(userName)}
                                </div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-800 rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate group-hover/profile:text-purple-200 transition-colors">
                                    {userName}
                                </p>
                                <p className="text-xs text-slate-400 truncate">View Profile</p>
                            </div>
                        </div>
                        {/* Logout button */}
                        <button
                            onClick={!isLoggingOut ? handleLogout : undefined}
                            disabled={isLoggingOut}
                            title="Log out"
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content — only this area re-renders on navigation; sidebar stays mounted */}
            <main className={cn("flex-1 overflow-y-auto", isAdmin && location.pathname === '/admin' ? "" : "p-6 lg:p-10")}>
                <Suspense
                    fallback={
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    }
                >
                    <Outlet key={location.pathname} context={outletContext} />
                </Suspense>
            </main>
        </div>
    );
};

export default DashboardLayout;
