import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Globe, Layout, LogOut, Building2, Users, Activity, X, ShieldCheck,
    Image as ImageIcon, MessageSquare, User as UserIcon, PanelLeftClose, PanelLeft,
} from 'lucide-react';
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

export const getInitials = (name: string) => {
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

const NavItem = ({
    icon,
    label,
    to,
    exact = false,
    collapsed,
}: {
    icon: React.ReactNode;
    label: string;
    to: string;
    exact?: boolean;
    collapsed: boolean;
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = exact
        ? location.pathname === to
        : location.pathname === to || location.pathname.startsWith(`${to}/`);

    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={() => navigate(to)}
            className={cn(
                'inline-flex h-10 items-center gap-2.5 rounded-3xl text-sm transition-colors duration-200',
                collapsed ? 'w-10 justify-center px-0' : 'w-full justify-start px-3',
                isActive
                    ? 'bg-white/15 font-semibold text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
            )}
        >
            <span className="shrink-0">{icon}</span>
            {!collapsed && <span className="truncate">{label}</span>}
        </button>
    );
};

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userName, setUserName] = useState(user?.name || 'User');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem('buildora-sidebar-collapsed') === '1';
        } catch {
            return false;
        }
    });

    const isAdminRole = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'INSTITUTION_ADMIN';
    const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
    const base = isAdmin ? '/admin' : '/dashboard';

    const setIsAdmin = (val: boolean | ((prev: boolean) => boolean)) => {
        const next = typeof val === 'function' ? val(isAdmin) : val;
        navigate(next ? '/admin' : '/dashboard');
    };

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('buildora-sidebar-collapsed', next ? '1' : '0');
            } catch { /* ignore */ }
            return next;
        });
    };

    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
        return () => {
            try {
                const saved = localStorage.getItem('buildora-theme');
                if (saved === 'dark') document.documentElement.classList.add('dark');
            } catch { /* ignore */ }
        };
    }, []);

    useEffect(() => {
        const handleUserUpdated = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.name) setUserName(detail.name);
        };
        window.addEventListener('userUpdated', handleUserUpdated);
        return () => window.removeEventListener('userUpdated', handleUserUpdated);
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
            localStorage.removeItem('user');
            setIsLoggingOut(false);
            navigate('/');
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

    const sidebarInner = (
        <>
            {/* Header */}
            <div className={cn('shrink-0', collapsed ? 'px-2 pt-3' : 'px-4 pt-4')}>
                <div className={cn('flex items-center', collapsed ? 'flex-col gap-2' : 'justify-between gap-2')}>
                    {!collapsed && (
                        <h1 className="truncate px-1 text-xl font-bold tracking-tight text-white">
                            Buildora
                        </h1>
                    )}
                    <button
                        type="button"
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        onClick={() => {
                            if (isMobile) setIsSidebarOpen(false);
                            else toggleCollapsed();
                        }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        {isMobile ? (
                            <X className="h-4 w-4" />
                        ) : collapsed ? (
                            <PanelLeft className="h-4 w-4" />
                        ) : (
                            <PanelLeftClose className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Nav */}
            <nav className={cn(
                'relative z-10 flex-1 space-y-1 overflow-y-auto py-3 no-scrollbar',
                collapsed ? 'flex flex-col items-center px-2' : 'px-3'
            )}>
                {!collapsed && (
                    <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Main Menu
                    </p>
                )}
                <NavItem collapsed={collapsed} icon={<Globe className="h-4 w-4" />} label="Dashboard" to={base} exact />
                <NavItem collapsed={collapsed} icon={<Layout className="h-4 w-4" />} label="Templates" to={`${base}/templates`} />
                <NavItem collapsed={collapsed} icon={<ImageIcon className="h-4 w-4" />} label="Assets" to={`${base}/assets`} />
                <NavItem collapsed={collapsed} icon={<MessageSquare className="h-4 w-4" />} label="Messages" to={`${base}/messages`} />
                <NavItem collapsed={collapsed} icon={<UserIcon className="h-4 w-4" />} label="Profile" to={`${base}/profile`} />

                {isAdmin && (
                    <div className={cn('pt-2', collapsed && 'flex flex-col items-center')}>
                        {!collapsed && (
                            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                System
                            </p>
                        )}
                        {collapsed && <div className="my-1 h-px w-8 bg-white/10" />}
                        <NavItem collapsed={collapsed} icon={<Users className="h-4 w-4" />} label="Users" to="/admin/users" />
                        {user?.role === 'SUPER_ADMIN' && (
                            <NavItem collapsed={collapsed} icon={<Building2 className="h-4 w-4" />} label="Organizations" to="/admin/organizations" />
                        )}
                        <NavItem collapsed={collapsed} icon={<Layout className="h-4 w-4" />} label="Websites" to="/admin/websites" />
                        <NavItem collapsed={collapsed} icon={<Activity className="h-4 w-4" />} label="Deployment Monitoring" to="/admin/deployment" />
                        <NavItem collapsed={collapsed} icon={<ShieldCheck className="h-4 w-4" />} label="Audit Logs" to="/admin/audit" />
                    </div>
                )}
            </nav>

            {/* Footer */}
            <div className={cn('relative z-10 mt-auto space-y-2 pb-4', collapsed ? 'px-2' : 'px-3')}>
                {!isAdmin && isAdminRole && (
                    collapsed ? (
                        <button
                            type="button"
                            title="Go to Admin"
                            aria-label="Go to Admin"
                            onClick={() => setIsAdmin(true)}
                            className="mx-auto flex h-10 w-10 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/15"
                        >
                            <ShieldCheck className="h-4 w-4" />
                        </button>
                    ) : (
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-3">
                            <p className="text-sm font-bold text-white">Admin Access</p>
                            <p className="mt-0.5 mb-2 text-[11px] text-white/60">Switch to manage your platform.</p>
                            <button
                                type="button"
                                onClick={() => setIsAdmin(true)}
                                className="w-full rounded-3xl bg-white py-2 text-xs font-bold text-[#131924] transition-colors hover:bg-slate-100"
                            >
                                Go to Admin →
                            </button>
                        </div>
                    )
                )}

                {isAdmin && isAdminRole && (
                    <button
                        type="button"
                        title="Exit Admin Mode"
                        aria-label="Exit Admin Mode"
                        onClick={() => setIsAdmin(false)}
                        className={cn(
                            'flex items-center gap-2 rounded-3xl border border-white/10 bg-white/10 text-sm font-semibold text-white transition-colors hover:bg-white/15',
                            collapsed ? 'mx-auto h-10 w-10 justify-center' : 'w-full px-3 py-2.5'
                        )}
                    >
                        <ShieldCheck className="h-4 w-4 shrink-0 text-slate-300" />
                        {!collapsed && <span className="truncate">Exit Admin Mode</span>}
                    </button>
                )}

                <div className={cn(
                    'flex items-center rounded-3xl transition-colors hover:bg-white/5',
                    collapsed ? 'justify-center p-1' : 'gap-2 p-2'
                )}>
                    <button
                        type="button"
                        title="View Profile"
                        onClick={() => navigate(`${base}/profile`)}
                        className={cn('flex min-w-0 items-center', collapsed ? '' : 'flex-1 gap-2')}
                    >
                        <div className="relative shrink-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F172A] text-sm font-bold text-white ring-1 ring-white/15">
                                {getInitials(userName)}
                            </div>
                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#131924] bg-emerald-400" />
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 flex-1 text-left">
                                <p className="truncate text-sm font-semibold text-white">{userName}</p>
                                <p className="truncate text-xs text-slate-400">View Profile</p>
                            </div>
                        )}
                    </button>
                    {!collapsed && (
                        <button
                            type="button"
                            title="Log out"
                            onClick={!isLoggingOut ? handleLogout : undefined}
                            disabled={isLoggingOut}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-3xl text-slate-400 transition-colors hover:bg-white/10 hover:text-rose-400 disabled:opacity-50"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {collapsed && (
                    <button
                        type="button"
                        title="Log out"
                        onClick={!isLoggingOut ? handleLogout : undefined}
                        disabled={isLoggingOut}
                        className="mx-auto flex h-10 w-10 items-center justify-center rounded-3xl text-white/70 transition-colors hover:bg-white/10 hover:text-rose-400 disabled:opacity-50"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div className={cn(
            'relative flex h-screen overflow-hidden font-sans selection:bg-primary/10',
            isAdmin ? 'bg-[#F3F4F6]' : 'bg-[#f8fafc]'
        )}>
            <Helmet>
                <title>Dashboard | Buildora</title>
            </Helmet>

            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Desktop sidebar */}
            {!isMobile && (
                <aside
                    className={cn(
                        'relative z-40 my-3 ml-3 flex shrink-0 flex-col overflow-hidden rounded-3xl bg-[#131924] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.45)] transition-[width] duration-300 ease-in-out',
                        collapsed ? 'w-[72px]' : 'w-64'
                    )}
                >
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] origin-bottom-right skew-x-[-18deg] bg-[#202838]/70" />
                    <div className="relative z-10 flex h-full flex-col">
                        {sidebarInner}
                    </div>
                </aside>
            )}

            {/* Mobile sidebar drawer */}
            {isMobile && (
                <aside
                    className={cn(
                        'fixed inset-y-3 left-3 z-50 flex w-64 flex-col overflow-hidden rounded-3xl bg-[#131924] shadow-xl transition-transform duration-300 ease-in-out',
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
                    )}
                >
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] origin-bottom-right skew-x-[-18deg] bg-[#202838]/70" />
                    <div className="relative z-10 flex h-full flex-col">
                        <MobileSidebar
                            collapsed={false}
                            userName={userName}
                            isAdmin={isAdmin}
                            isAdminRole={isAdminRole}
                            user={user}
                            base={base}
                            isLoggingOut={isLoggingOut}
                            onClose={() => setIsSidebarOpen(false)}
                            onLogout={handleLogout}
                            setIsAdmin={setIsAdmin}
                            navigate={navigate}
                        />
                    </div>
                </aside>
            )}

            <main className={cn(
                'min-w-0 flex-1 overflow-y-auto',
                isAdmin && location.pathname === '/admin' ? '' : 'p-6 lg:p-10'
            )}>
                {isMobile && !isSidebarOpen && (
                    <button
                        type="button"
                        title="Open sidebar"
                        aria-label="Open sidebar"
                        onClick={() => setIsSidebarOpen(true)}
                        className="mb-4 flex h-10 w-10 items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white text-[#0F172A] shadow-sm"
                    >
                        <PanelLeft className="h-4 w-4" />
                    </button>
                )}
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

/** Mobile drawer always shows full labels */
function MobileSidebar({
    collapsed,
    userName,
    isAdmin,
    isAdminRole,
    user,
    base,
    isLoggingOut,
    onClose,
    onLogout,
    setIsAdmin,
    navigate,
}: {
    collapsed: boolean;
    userName: string;
    isAdmin: boolean;
    isAdminRole: boolean;
    user: any;
    base: string;
    isLoggingOut: boolean;
    onClose: () => void;
    onLogout: () => void;
    setIsAdmin: (v: boolean) => void;
    navigate: (path: string) => void;
}) {
    return (
        <>
            <div className="flex items-center justify-between px-4 pt-4">
                <h1 className="text-xl font-bold tracking-tight text-white">Buildora</h1>
                <button
                    type="button"
                    title="Close sidebar"
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-3xl text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
                <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Menu</p>
                <NavItem collapsed={collapsed} icon={<Globe className="h-4 w-4" />} label="Dashboard" to={base} exact />
                <NavItem collapsed={collapsed} icon={<Layout className="h-4 w-4" />} label="Templates" to={`${base}/templates`} />
                <NavItem collapsed={collapsed} icon={<ImageIcon className="h-4 w-4" />} label="Assets" to={`${base}/assets`} />
                <NavItem collapsed={collapsed} icon={<MessageSquare className="h-4 w-4" />} label="Messages" to={`${base}/messages`} />
                <NavItem collapsed={collapsed} icon={<UserIcon className="h-4 w-4" />} label="Profile" to={`${base}/profile`} />
                {isAdmin && (
                    <div className="pt-2">
                        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">System</p>
                        <NavItem collapsed={collapsed} icon={<Users className="h-4 w-4" />} label="Users" to="/admin/users" />
                        {user?.role === 'SUPER_ADMIN' && (
                            <NavItem collapsed={collapsed} icon={<Building2 className="h-4 w-4" />} label="Organizations" to="/admin/organizations" />
                        )}
                        <NavItem collapsed={collapsed} icon={<Layout className="h-4 w-4" />} label="Websites" to="/admin/websites" />
                        <NavItem collapsed={collapsed} icon={<Activity className="h-4 w-4" />} label="Deployment Monitoring" to="/admin/deployment" />
                        <NavItem collapsed={collapsed} icon={<ShieldCheck className="h-4 w-4" />} label="Audit Logs" to="/admin/audit" />
                    </div>
                )}
            </nav>
            <div className="mt-auto space-y-2 px-3 pb-4">
                {isAdmin && isAdminRole && (
                    <button
                        type="button"
                        onClick={() => setIsAdmin(false)}
                        className="flex w-full items-center gap-2 rounded-3xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
                    >
                        <ShieldCheck className="h-4 w-4" /> Exit Admin Mode
                    </button>
                )}
                {!isAdmin && isAdminRole && (
                    <button
                        type="button"
                        onClick={() => setIsAdmin(true)}
                        className="flex w-full items-center gap-2 rounded-3xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
                    >
                        <ShieldCheck className="h-4 w-4" /> Go to Admin
                    </button>
                )}
                <div className="flex items-center gap-2 rounded-3xl p-2 hover:bg-white/5">
                    <button type="button" onClick={() => navigate(`${base}/profile`)} className="flex min-w-0 flex-1 items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F172A] text-sm font-bold text-white">
                            {getInitials(userName)}
                        </div>
                        <div className="min-w-0 text-left">
                            <p className="truncate text-sm font-semibold text-white">{userName}</p>
                            <p className="truncate text-xs text-slate-400">View Profile</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        title="Log out"
                        onClick={!isLoggingOut ? onLogout : undefined}
                        className="flex h-8 w-8 items-center justify-center rounded-3xl text-slate-400 hover:text-rose-400"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default DashboardLayout;
