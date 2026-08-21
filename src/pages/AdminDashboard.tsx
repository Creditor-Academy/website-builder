import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '@/layouts/DashboardLayout';
import { getInitials } from '@/layouts/DashboardLayout';
import {
    Plus, Globe, CheckCircle, Users,
    ArrowRight, LayoutTemplate, Activity, Menu, ShieldCheck, Bell, ArrowUp, ArrowDown,
    UserX, RefreshCw, Eye,
    CheckCheck, Info, Trash, Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import templateApi from '@/api/templates';
import statsApi from "../api/stats";
import { getAuditLogs } from "../api/audit";
import {
    getUserById,
    getUsers,
    updateUserStatus,
    restoreUser,
    createUser,
} from "../api/user";
import { DashboardStatCard, DashboardPanel } from '@/components/dashboard/DashboardCard';

// ─── AddUserDialog ────────────────────────────────────────────────────────────
// ✅ Calls POST /users to create a new user (Admin / Institution Admin only)
const ROLE_OPTIONS = ['USER', 'ADMIN', 'INSTITUTION_ADMIN'];

const AddUserDialog = ({ open, onOpenChange, onUserCreated }) => {
    const { toast } = useToast();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
        if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
        if (!form.role) e.role = 'Role is required';
        return e;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }

        try {
            setLoading(true);
            const res = await createUser(form);
            const newUser = res.data?.data || res.data;
            toast({ title: 'User created', description: `${form.name} has been added successfully.` });
            onUserCreated?.(newUser);
            setForm({ name: '', email: '', password: '', role: 'USER' });
            setErrors({});
            onOpenChange(false);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Failed to create user';
            toast({ title: 'Creation failed', description: msg, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = (val) => {
        if (!loading) {
            setForm({ name: '', email: '', password: '', role: 'USER' });
            setErrors({});
            onOpenChange(val);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg rounded-[2rem] p-0 overflow-hidden bg-white border-slate-100 shadow-2xl">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-7">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-white">Add New User</DialogTitle>
                    <DialogDescription className="text-white/70 mt-1 text-sm">
                        Create a new user account on the platform.
                    </DialogDescription>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <Input
                            placeholder="e.g., Jane Smith"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all", errors.name && "border-rose-400 bg-rose-50 focus:bg-rose-50")}
                        />
                        {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <Input
                            type="email"
                            placeholder="jane@example.com"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                            className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all", errors.email && "border-rose-400 bg-rose-50 focus:bg-rose-50")}
                        />
                        {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                        <Input
                            type="password"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={e => handleChange('password', e.target.value)}
                            className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all", errors.password && "border-rose-400 bg-rose-50 focus:bg-rose-50")}
                        />
                        {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password}</p>}
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role</label>
                        <Select value={form.role} onValueChange={val => handleChange('role', val)}>
                            <SelectTrigger className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all", errors.role && "border-rose-400")}>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
                                {ROLE_OPTIONS.map(r => (
                                    <SelectItem key={r} value={r} className="capitalize">
                                        {r.replace('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-xs text-rose-500 font-medium">{errors.role}</p>}
                    </div>
                </div>

                <div className="px-8 pb-8 flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => handleClose(false)}
                        disabled={loading}
                        className="rounded-xl h-11 px-6 border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-xl h-11 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all font-bold"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Creating...</span>
                        ) : (
                            <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Create User</span>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── UserDetailDialog ─────────────────────────────────────────────────────────
// ✅ Calls GET /users/:id to show detailed user info in a dialog
const UserDetailDialog = ({ userId, open, onOpenChange }) => {
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (open && userId) {
            setLoading(true);
            getUserById(userId)
                .then((res) => setUserDetail(res.data?.data || res.data))
                .catch(() => toast({ title: "Failed to load user", variant: "destructive" }))
                .finally(() => setLoading(false));
        }
    }, [open, userId, toast]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-[2rem] p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                ) : userDetail ? (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-2xl">
                                {getInitials(userDetail.name)}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-900">{userDetail.name}</p>
                                <p className="text-sm text-slate-500">{userDetail.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                                <p className="text-sm font-semibold text-slate-800">{userDetail.role || '—'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                <span className={cn(
                                    "text-sm font-semibold",
                                    userDetail.active ? "text-emerald-600" : "text-rose-500"
                                )}>
                                    {userDetail.active ? "Active" : "Suspended"}
                                </span>
                            </div>
                            {userDetail.createdAt && (
                                <div className="bg-slate-50 rounded-2xl p-4 col-span-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Joined</p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {format(new Date(userDetail.createdAt), 'PPP')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 py-8 text-center">No data found.</p>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ─── AdminDashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { fetchWebsites } = useBuilderStore();
    const isMobile = useIsMobile();
    // Sidebar / admin-mode state lives in DashboardLayout and is shared via Outlet context
    const { isAdmin, setIsAdmin, setIsSidebarOpen, userName } = useOutletContext<DashboardOutletContext>();

    const { toast } = useToast();

    const [stats, setStats] = useState({
        totalWebsites: 0,
        totalUsers: 0,
        activeDeployments: 0,
        totalOrganizations: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // ✅ NEW: state for admin user list + user detail dialog + add user dialog
    const [adminUsers, setAdminUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userDetailOpen, setUserDetailOpen] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    // ── Notification panel state ────────────────────────────────────────────
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [notifLoading, setNotifLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [readIds, setReadIds] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem('readNotifIds') || '[]')); }
        catch { return new Set(); }
    });
    const notifRef = useRef<HTMLDivElement>(null);

    // DB templates (used for the Total Templates stat)
    const [dbTemplates, setDbTemplates] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoadingStats(true);
                const response = await statsApi.getDashboardStats({ adminView: isAdmin });
                // Handle both { data: { data: {...} } } and { data: {...} }
                const statsData = response.data?.data || response.data;
                if (statsData && typeof statsData === 'object') {
                    setStats(prev => ({ ...prev, ...statsData }));
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchStats();
        fetchWebsites(undefined, isAdmin);
    }, [isAdmin, fetchWebsites]);

    // ✅ NEW: Fetch users list when admin mode is active
    useEffect(() => {
        if (!isAdmin) return;
        setIsLoadingUsers(true);
        getUsers({ limit: 10, page: 1 })
            .then((res) => {
                // Handle every possible response shape the backend may return
                const raw = res.data;
                let users: any[] = [];
                if (Array.isArray(raw?.data?.users)) users = raw.data.users;
                else if (Array.isArray(raw?.data))   users = raw.data;
                else if (Array.isArray(raw?.users))  users = raw.users;
                else if (Array.isArray(raw))         users = raw;
                setAdminUsers(users);
            })
            .catch((err) => {
                console.error("Failed to fetch users:", err?.response?.data || err?.message);
                setAdminUsers([]);
            })
            .finally(() => setIsLoadingUsers(false));
    }, [isAdmin]);

    // Fetch DB templates
    useEffect(() => {
        templateApi.getWebsiteTemplates()
            .then(res => {
                const raw = res.data?.data || res.data || [];
                const flat: any[] = Array.isArray(raw) ? raw : Object.values(raw).flat();
                setDbTemplates(flat.filter((t: any) => !t.deletedAt));
            })
            .catch(() => setDbTemplates([]));
    }, []);

    // ✅ NEW: Toggle user active status via PATCH /users/:id/status
    const handleToggleUserStatus = async (userId, currentActive) => {
        try {
            await updateUserStatus(userId, !currentActive);
            setAdminUsers(prev =>
                prev.map(u => u.id === userId ? { ...u, active: !currentActive } : u)
            );
            toast({
                title: `User ${!currentActive ? "reactivated" : "suspended"}`,
                description: `User status has been updated.`
            });
        } catch (err) {
            toast({ title: "Status update failed", variant: "destructive" });
        }
    };

    // ✅ NEW: Restore user via POST /users/:id/restore
    const handleRestoreUser = async (userId) => {
        try {
            await restoreUser(userId);
            setAdminUsers(prev =>
                prev.map(u => u.id === userId ? { ...u, active: true, deletedAt: null } : u)
            );
            toast({ title: "User restored", description: "User account has been restored." });
        } catch (err) {
            toast({ title: "Restore failed", variant: "destructive" });
        }
    };

    // ✅ NEW: Prepend newly created user to adminUsers list
    const handleUserCreated = (newUser) => {
        if (newUser && newUser.id) {
            setAdminUsers(prev => [newUser, ...prev]);
        }
    };

    // ── Notification logic ──────────────────────────────────────────────────
    const fetchNotifications = async () => {
        setNotifLoading(true);
        try {
            const data = await getAuditLogs({ limit: 15, page: 1 });
            const logs = data?.logs || data?.data?.logs || data?.data || [];
            setNotifications(Array.isArray(logs) ? logs : []);
            const unread = Array.isArray(logs)
                ? logs.filter((l: any) => !readIds.has(l.id)).length
                : 0;
            setUnreadCount(unread);
        } catch {
            setNotifications([]);
        } finally {
            setNotifLoading(false);
        }
    };

    // Open panel → fetch + close on outside click
    useEffect(() => {
        if (notifOpen) fetchNotifications();
    }, [notifOpen]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        if (notifOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [notifOpen]);

    const markAllRead = () => {
        const allIds = new Set(notifications.map((n: any) => n.id));
        setReadIds(allIds);
        setUnreadCount(0);
        try { localStorage.setItem('readNotifIds', JSON.stringify([...allIds])); } catch {}
    };

    const getNotifIcon = (action: string) => {
        const a = (action || '').toLowerCase();
        if (a.includes('delete') || a.includes('purge')) return <Trash className="w-3.5 h-3.5 text-rose-500" />;
        if (a.includes('create') || a.includes('register')) return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
        if (a.includes('login') || a.includes('auth')) return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
        if (a.includes('update') || a.includes('edit')) return <Info className="w-3.5 h-3.5 text-indigo-500" />;
        if (a.includes('publish') || a.includes('deploy')) return <Globe2 className="w-3.5 h-3.5 text-purple-500" />;
        return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    };

    const formatNotifTime = (dateStr: string) => {
        try {
            const diff = Date.now() - new Date(dateStr).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return 'just now';
            if (mins < 60) return `${mins}m ago`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs}h ago`;
            return `${Math.floor(hrs / 24)}d ago`;
        } catch { return ''; }
    };

    return (
        <>
            <div className="min-h-screen bg-[#f7f7fb]">

                {/* ── Admin top strip ── */}
                <div className="bg-white border-b border-slate-100 px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isMobile && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-1" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="w-5 h-5" />
                            </Button>
                        )}
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Admin Dashboard</h1>
                            <p className="text-xs text-slate-400 mt-0.5">Platform overview · {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <div ref={notifRef} className="relative">
                            <Button variant="ghost" size="icon"
                                onClick={() => setNotifOpen(v => !v)}
                                className="relative rounded-lg h-9 w-9 text-slate-500 hover:bg-slate-100 transition-colors">
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Button>
                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute right-0 top-11 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                                <Bell className="w-4 h-4" /> Notifications
                                                {unreadCount > 0 && <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                                            </span>
                                            {unreadCount > 0 && <button onClick={markAllRead} className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1"><CheckCheck className="w-3.5 h-3.5" /> Mark all read</button>}
                                        </div>
                                        <div className="overflow-y-auto max-h-[320px]">
                                            {notifLoading ? (
                                                <div className="flex flex-col gap-3 p-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex items-start gap-3 animate-pulse"><div className="w-7 h-7 rounded-full bg-slate-100 shrink-0" /><div className="flex-1 space-y-1.5"><div className="h-3 bg-slate-100 rounded-full w-3/4" /><div className="h-2.5 bg-slate-100 rounded-full w-1/2" /></div></div>)}</div>
                                            ) : notifications.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400"><Bell className="w-8 h-8 opacity-20" /><p className="text-sm font-medium">No notifications yet</p></div>
                                            ) : notifications.map((n: any) => {
                                                const isUnread = !readIds.has(n.id);
                                                return (
                                                    <div key={n.id} className={cn("flex items-start gap-3 px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors", isUnread && "bg-indigo-50/40")}>
                                                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5", isUnread ? "bg-white shadow-sm border border-slate-100" : "bg-slate-100")}>{getNotifIcon(n.action)}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={cn("text-[13px] leading-snug truncate", isUnread ? "font-semibold text-slate-900" : "font-medium text-slate-600")}>{n.action || n.type || 'System event'}</p>
                                                            <p className="text-[11px] text-slate-400 mt-0.5">{formatNotifTime(n.createdAt || n.created_at)}</p>
                                                        </div>
                                                        {isUnread && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {notifications.length > 0 && (
                                            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                                                <button onClick={() => { setNotifOpen(false); navigate('/admin/audit'); }} className="text-[12px] font-bold text-indigo-600 hover:underline w-full text-center">View all in Audit Logs →</button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={() => setIsAdmin(false)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-all"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" /> Exit Admin
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">

                    {/* Greeting banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl sm:rounded-2xl px-4 sm:px-7 py-4 sm:py-5 flex items-center justify-between shadow-md shadow-indigo-200/40">
                        <div className="absolute right-0 top-0 w-48 h-full bg-white/5 skew-x-[-15deg] translate-x-8 pointer-events-none" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <p className="text-indigo-200 text-sm font-medium">Good day, {userName} 👋</p>
                            <h2 className="text-xl font-black text-white mt-0.5 tracking-tight">Admin Dashboard</h2>
                            <p className="text-indigo-200/70 text-xs mt-1">Here's what's happening on the platform today.</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { label: "Total Users",        value: isLoadingStats ? "…" : stats.totalUsers,        icon: <Users className="w-4 h-4" />,        iconBg: "bg-purple-100 text-purple-600", trend: "+12.5%", up: true  },
                            { label: "Active Websites",    value: isLoadingStats ? "…" : stats.totalWebsites,     icon: <Globe className="w-4 h-4" />,         iconBg: "bg-indigo-100 text-indigo-600", trend: "+3.2%",  up: true  },
                            { label: "Total Templates",    value: dbTemplates.length,                              icon: <LayoutTemplate className="w-4 h-4" />, iconBg: "bg-emerald-100 text-emerald-600",trend: "+2",     up: true  },
                            { label: "Active Deployments", value: isLoadingStats ? "…" : stats.activeDeployments, icon: <Activity className="w-4 h-4" />,      iconBg: "bg-rose-100 text-rose-600",    trend: "+8.1%",  up: true  },
                        ].map((s, i) => (
                            <motion.div key={s.label}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.07 }}
                            >
                            <DashboardStatCard className="hover:shadow-lg transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium text-[#45464d]">{s.label}</p>
                                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border border-[#c6c6cd] bg-[#f6f3f5]", s.iconBg)}>{s.icon}</div>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-[#000000]">{s.value}</p>
                                <p className={cn("text-xs font-semibold mt-1 flex items-center gap-0.5", s.up ? "text-emerald-600" : "text-[#ba1a1a]")}>
                                    {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{s.trend}
                                </p>
                            </DashboardStatCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Recent Users — 2/3 */}
                        <DashboardPanel className="lg:col-span-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[#c6c6cd]">
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-slate-900">Recent Users</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Latest registered accounts</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <Button size="sm" className="h-8 rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm" onClick={() => setIsAddUserOpen(true)}>
                                        <Plus className="w-3.5 h-3.5" /> Add User
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => navigate('/admin/users')}>
                                        View All
                                    </Button>
                                </div>
                            </div>
                            <div>
                                {isLoadingUsers ? (
                                    <div className="flex justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-slate-300" /></div>
                                ) : adminUsers.length === 0 ? (
                                    <p className="text-center text-slate-400 py-10 text-sm">No users found.</p>
                                ) : (
                                    <div className="divide-y divide-slate-50">
                                        {adminUsers.slice(0, 6).map((u) => (
                                            <div key={u.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50/60 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                                        {getInitials(u.name)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800 leading-tight">{u.name}</p>
                                                        <p className="text-[11px] text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full",
                                                        u.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-500 border border-rose-100")}>
                                                        {u.active ? "Active" : "Suspended"}
                                                    </span>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-slate-100" onClick={() => { setSelectedUserId(u.id); setUserDetailOpen(true); }}>
                                                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-slate-100" onClick={() => handleToggleUserStatus(u.id, u.active)}>
                                                        <UserX className={cn("w-3.5 h-3.5", u.active ? "text-rose-400" : "text-emerald-500")} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </DashboardPanel>

                        {/* Right column: Quick Actions + Recent Activity */}
                        <div className="flex flex-col gap-4">
                            {/* Quick Actions */}
                            <DashboardPanel className="p-4 sm:p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h3>
                                <div className="space-y-1.5">
                                    {[
                                        { label: "Manage Users",        icon: <Users className="w-3.5 h-3.5" />,       bg: "bg-purple-100 text-purple-600", to: '/admin/users' },
                                        { label: "Manage Websites",     icon: <Globe className="w-3.5 h-3.5" />,        bg: "bg-indigo-100 text-indigo-600", to: '/admin/websites' },
                                        { label: "Manage Templates",    icon: <LayoutTemplate className="w-3.5 h-3.5" />,bg: "bg-emerald-100 text-emerald-600", to: '/admin/templates' },
                                        { label: "Monitor Deployments", icon: <Activity className="w-3.5 h-3.5" />,     bg: "bg-rose-100 text-rose-600", to: '/admin/deployment' },
                                        { label: "Audit Logs",          icon: <ShieldCheck className="w-3.5 h-3.5" />,  bg: "bg-slate-100 text-slate-500", to: '/admin/audit' },
                                    ].map((a) => (
                                        <button key={a.label} onClick={() => navigate(a.to)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group text-left">
                                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", a.bg)}>{a.icon}</div>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{a.label}</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </DashboardPanel>

                            {/* Recent Activity */}
                            <DashboardPanel className="p-4 sm:p-5 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                                    <button onClick={() => navigate('/admin/audit')} className="text-[11px] text-indigo-600 font-bold hover:underline">View All</button>
                                </div>
                                <div className="space-y-3">
                                    {notifications.length === 0 && !notifLoading && (
                                        <p className="text-xs text-slate-400 text-center py-3">No recent activity</p>
                                    )}
                                    {notifications.slice(0, 5).map((n: any) => (
                                        <div key={n.id} className="flex items-start gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                                {getNotifIcon(n.action)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-slate-700 truncate">{n.action || 'System event'}</p>
                                                <p className="text-[10px] text-slate-400">{formatNotifTime(n.createdAt || n.created_at)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardPanel>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Add User Dialog (POST /users) */}
            <AddUserDialog
                open={isAddUserOpen}
                onOpenChange={setIsAddUserOpen}
                onUserCreated={handleUserCreated}
            />

            {/* ✅ User Detail Dialog (GET /users/:id) */}
            <UserDetailDialog
                userId={selectedUserId}
                open={userDetailOpen}
                onOpenChange={setUserDetailOpen}
            />
        </>
    );
};

export { AddUserDialog, UserDetailDialog };
export default AdminDashboard;
