import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Menu, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsCompact } from '@/hooks/use-mobile';
import { logoutUser } from '@/api/auth';
import { clearStoredUser } from '@/lib/authSession';
import { DashboardSidebar } from '@/components/Common/sidebar';
import { BrandLogo } from '@/components/Common/BrandLogo';
import Loading from '@/components/Common/LoadingUI';
import { motion } from 'framer-motion';
import { pageMotion } from '@/lib/motion';
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

export interface DashboardOutletContext {
    isAdmin: boolean;
    setIsAdmin: (val: boolean | ((prev: boolean) => boolean)) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isCompact = useIsCompact();
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    })();
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
        document.body.style.backgroundColor = 'var(--dashboard-bg)';
        return () => {
            document.body.style.backgroundColor = '';
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

    useEffect(() => {
        if (!isCompact) setIsSidebarOpen(false);
    }, [isCompact]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logoutUser();
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error(err);
            }
        } finally {
            clearStoredUser();
            setIsLoggingOut(false);
            setLogoutDialogOpen(false);
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

    return (
        <div className="h-dvh w-full bg-dashboard">
            <div className={cn(
                'relative mx-auto flex h-full w-full max-w-dashboard overflow-hidden font-sans selection:bg-primary/10',
                isCompact ? 'p-2 sm:p-3' : 'gap-2 p-2 sm:gap-3 sm:p-3 lg:gap-4 lg:p-4',
            )}>
                <Helmet>
                    <title>Dashboard | Buildora</title>
                </Helmet>

                <DashboardSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isCompact={isCompact}
                    isAdmin={isAdmin}
                    isAdminRole={isAdminRole}
                    userRole={user?.role}
                    userName={userName}
                    base={base}
                    onGoAdmin={() => setIsAdmin(true)}
                    onExitAdmin={() => setIsAdmin(false)}
                    onLogout={() => setLogoutDialogOpen(true)}
                    isLoggingOut={isLoggingOut}
                />

                <main className="min-h-0 min-w-0 w-full flex-1 overflow-x-clip overflow-y-auto no-scrollbar">
                    <div className="w-full min-w-0">
                        {isCompact && (
                            <div className="sticky top-0 z-30 mb-3 flex items-center gap-2 rounded-2xl border border-border bg-[#0f172a] px-3 py-2.5 shadow-sm backdrop-blur">
                                <button
                                    type="button"
                                    title="Open menu"
                                    aria-label="Open menu"
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#0F172A] shadow-sm"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                                <BrandLogo
                                    imgClassName="h-7 w-7"
                                />
                            </div>
                        )}
                        <Suspense fallback={<Loading />}>
                            <motion.div key={location.pathname} {...pageMotion}>
                                <Outlet context={outletContext} />
                            </motion.div>
                        </Suspense>
                    </div>
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
        </div>
    );
};

export default DashboardLayout;
