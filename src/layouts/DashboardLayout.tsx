import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Globe, Layout, LogOut, Building2, Users, Activity, X, ShieldCheck,
    Image as ImageIcon, MessageSquare, User as UserIcon, Plus, ArrowRight, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { logoutUser } from '@/api/auth';

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

const NavItem = ({ icon, label, to, onClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = location.pathname === to;

    const handleClick = (e) => {
        e.preventDefault();
        if (onClick) onClick();
        navigate(to);
    };

    return (
        <a
            href={to}
            onClick={handleClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out text-sm font-medium",
                isActive
                    ? "bg-[#dedfeb] text-[#191b24] font-semibold"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
            )}
        >
            <span className="shrink-0 w-5 h-5 flex items-center justify-center">{icon}</span>
            <span className="truncate">{label}</span>
        </a>
    );
};

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    const user = JSON.parse(localStorage.getItem("user") || 'null');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [userName, setUserName] = useState(user?.name || 'User');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isAdminRole = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'INSTITUTION_ADMIN';
    const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
    const base = isAdmin ? '/admin' : '/dashboard';

    const setIsAdmin = (val: boolean | ((prev: boolean) => boolean)) => {
        const next = typeof val === 'function' ? val(isAdmin) : val;
        navigate(next ? '/admin' : '/dashboard');
    };

    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
        return () => {
            try {
                const saved = localStorage.getItem('buildora-theme');
                if (saved === 'dark') document.documentElement.classList.add('dark');
            } catch {}
        };
    }, []);

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
        if (isAdmin && !isAdminRole) {
            navigate('/dashboard');
        }
    }, [user, isAdmin, isAdminRole, navigate]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logoutUser();
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error(err);
            }
        } finally {
            localStorage.removeItem("user");
            setIsLoggingOut(false);
            setLogoutDialogOpen(false);
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

    const fullWidthPages = [
        '/dashboard',
        '/admin',
        '/dashboard/templates',
        '/admin/templates',
        '/dashboard/assets',
        '/admin/assets',
        '/dashboard/messages',
        '/admin/messages',
        '/dashboard/profile',
        '/admin/profile',
    ];
    const isDashboardShellPage = fullWidthPages.includes(location.pathname);
    const isFullWidthPage = isDashboardShellPage;

    return (
        <div className="h-screen bg-[#f6f3f5] text-[#1b1b1d] flex font-sans relative overflow-hidden">
            <Helmet>
                <title>Dashboard | Buildora</title>
            </Helmet>

            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SideNavBar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-64 bg-[#131b2e] border-r border-[#c6c6cd]/30 text-white flex flex-col h-full py-6 px-4 shrink-0 z-50",
                    "lg:static lg:flex",
                    isMobile ? "transition-transform duration-300 ease-in-out" : "",
                    isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
                )}
            >
                {/* Header Title Section */}
                <div className="mb-6 px-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Buildora Workspace
                        </h1>
                        <p className="text-xs text-slate-300 mt-1">
                            {isAdmin ? 'System Admin Portal' : 'Pro Plan'}
                        </p>
                    </div>
                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-white hover:bg-white/10"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                {/* Primary Action Button */}
                <button 
                    onClick={() => navigate(`${base}/templates`)}
                    className="bg-[#c4c6d1] text-[#191b24] hover:bg-[#e1e2ed] transition-colors px-4 py-2 mb-6 text-sm font-medium flex items-center justify-center gap-2 w-full rounded-lg shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </button>

                {/* Navigation Menu */}
                <nav className="flex-1 space-y-1 overflow-y-auto">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase px-3 mb-2">
                        Main Menu
                    </p>
                    <NavItem icon={<Globe className="w-4 h-4" />} label="Projects" to={base} onClick={() => isMobile && setIsSidebarOpen(false)} />
                    <NavItem icon={<Layout className="w-4 h-4" />} label="Templates" to={`${base}/templates`} onClick={() => isMobile && setIsSidebarOpen(false)} />
                    <NavItem icon={<ImageIcon className="w-4 h-4" />} label="Assets" to={`${base}/assets`} onClick={() => isMobile && setIsSidebarOpen(false)} />
                    <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Messages" to={`${base}/messages`} onClick={() => isMobile && setIsSidebarOpen(false)} />
                    <NavItem icon={<UserIcon className="w-4 h-4" />} label="Profile" to={`${base}/profile`} onClick={() => isMobile && setIsSidebarOpen(false)} />

                    {isAdmin && (
                        <div className="pt-4 space-y-1">
                            <p className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase px-3 mb-2">
                                Admin System
                            </p>
                            <NavItem icon={<Users className="w-4 h-4" />} label="Users" to="/admin/users" onClick={() => isMobile && setIsSidebarOpen(false)} />
                            {user?.role === 'SUPER_ADMIN' && (
                                <NavItem icon={<Building2 className="w-4 h-4" />} label="Organizations" to="/admin/organizations" onClick={() => isMobile && setIsSidebarOpen(false)} />
                            )}
                            <NavItem icon={<Layout className="w-4 h-4" />} label="Websites" to="/admin/websites" onClick={() => isMobile && setIsSidebarOpen(false)} />
                            <NavItem icon={<Activity className="w-4 h-4" />} label="Deployments" to="/admin/deployment" onClick={() => isMobile && setIsSidebarOpen(false)} />
                            <NavItem icon={<ShieldCheck className="w-4 h-4" />} label="Audit Logs" to="/admin/audit" onClick={() => isMobile && setIsSidebarOpen(false)} />
                        </div>
                    )}
                </nav>

                {/* Footer Section */}
                <div className="mt-auto border-t border-[#c6c6cd]/20 pt-4 space-y-2 text-white">
                    {/* Admin Switcher (User Mode) */}
                    {!isAdmin && isAdminRole && (
                        <div className="mb-4 bg-[#eae7e9] text-[#1b1b1d] p-3 rounded-xl shadow-sm flex flex-col gap-2">
                            <div className="w-8 h-8 bg-[#131b2e] rounded-lg flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-[#7c839b]" />
                            </div>
                            <div>
                                <p className="text-[#1b1b1d] font-semibold text-sm">Admin Access</p>
                                <p className="text-[#45464d] text-[10px] leading-tight">Switch to manage platform</p>
                            </div>
                            <button
                                onClick={() => setIsAdmin(true)}
                                className="w-full bg-[#131b2e] text-white py-2 rounded-full text-xs font-semibold hover:bg-[#3f465c] transition-colors flex items-center justify-center gap-1.5"
                            >
                                Go to Admin
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {/* Exit Admin Mode (Admin Mode) */}
                    {isAdmin && isAdminRole && (
                        <div className="mb-4">
                            <button
                                onClick={() => setIsAdmin(false)}
                                className="w-full bg-[#eae7e9] text-[#1b1b1d] hover:bg-[#e4e2e4] py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-4 h-4 text-[#131b2e]" />
                                Exit Admin Mode
                            </button>
                        </div>
                    )}

                    {/* User Profile & Logout */}
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div
                            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                            onClick={() => navigate(`${base}/profile`)}
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#c4c6d1] text-[#191b24] flex items-center justify-center text-xs font-bold shrink-0">
                                {getInitials(userName)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {userName}
                                </p>
                                <p className="text-[10px] text-slate-300 truncate">View Profile</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setLogoutDialogOpen(true)}
                            disabled={isLoggingOut}
                            title="Log out"
                            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 shrink-0"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Outlet Main View Area */}
            <main className={cn(
                "flex-1 min-h-0 overflow-y-auto w-full",
                isDashboardShellPage ? "bg-[#fcf8fa] text-[#1b1b1d]" : "bg-[#f6f3f5] text-[#1b1b1d]",
                isFullWidthPage ? "" : "p-6 lg:p-10 max-w-7xl mx-auto"
            )}>
                <Suspense
                    fallback={
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                        </div>
                    }
                >
                    <Outlet key={location.pathname} context={outletContext} />
                </Suspense>
            </main>

            <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                <AlertDialogContent className="rounded-2xl w-[calc(100vw-2rem)] sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to log out of your Buildora account?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void handleLogout();
                            }}
                            disabled={isLoggingOut}
                            className="bg-[#131b2e] hover:bg-[#252f4a] text-white"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Logging out…
                                </>
                            ) : (
                                'OK'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DashboardLayout;