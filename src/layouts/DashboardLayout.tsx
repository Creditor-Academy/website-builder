import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Menu } from 'lucide-react';
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
import { useIsCompact } from '@/hooks/use-mobile';
import { logoutUser } from '@/api/auth';
import { DashboardSidebar } from '@/components/Common/sidebar';

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

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isCompact = useIsCompact();
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

            <DashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
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

            {/* Outlet Main View Area */}
            <main className={cn(
                "flex-1 min-h-0 overflow-y-auto w-full",
                isDashboardShellPage ? "bg-[#fcf8fa] text-[#1b1b1d]" : "bg-[#f6f3f5] text-[#1b1b1d]",
                isFullWidthPage ? "" : "p-6 lg:p-10 max-w-7xl mx-auto"
            )}>
                {isCompact && (
                    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-[#e5e7eb] bg-[#fcf8fa]/95 px-4 py-3 backdrop-blur lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-full hover:bg-[#eae7e9] hover:scale-100"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5 text-[#0F172A]" />
                        </Button>
                        <span className="text-sm font-semibold text-[#0F172A]">Buildora Workspace</span>
                    </div>
                )}
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
