import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '@/layouts/DashboardLayout';
import { getInitials } from '@/lib/getInitials';
import {
    Plus, Globe, CheckCircle, Users,
    ArrowRight, LayoutTemplate, Activity, ShieldCheck, Bell, ArrowUp, ArrowDown,
    UserX, RefreshCw, Eye,
    CheckCheck, Info, Trash, Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/components/ui/use-toast";
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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
import adminHeroImg from '@/assets/admin_dashboard/admin-manage-online-dashboard-with-laptop-illustration-svg-download-png-1597939.webp';
import Loading from '@/components/Common/LoadingUI';

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
            <DialogContent className="sm:max-w-lg rounded-3xl sm:rounded-3xl border-0 p-0 overflow-hidden bg-white shadow-xl font-[Inter,sans-serif] gap-0">
                <div className="bg-[#0F172A] px-8 py-7 border-0">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-white">Add New User</DialogTitle>
                    <DialogDescription className="text-white/60 mt-1 text-sm">
                        Create a new user account on the platform.
                    </DialogDescription>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Full Name</label>
                        <Input
                            placeholder="e.g., Jane Smith"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            className={cn("h-12 rounded-lg bg-[#F4F4F5] border-[#E8E8E8] text-[#0F172A] focus:bg-white focus:border-[#0F172A] transition-all", errors.name && "border-rose-400 bg-rose-50 focus:bg-rose-50")}
                        />
                        {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Email Address</label>
                        <Input
                            type="email"
                            placeholder="jane@example.com"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                            className={cn("h-12 rounded-lg bg-[#F4F4F5] border-[#E8E8E8] text-[#0F172A] focus:bg-white focus:border-[#0F172A] transition-all", errors.email && "border-rose-400 bg-rose-50 focus:bg-rose-50")}
                        />
                        {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Password</label>
                        <Input
                            type="password"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={e => handleChange('password', e.target.value)}
                            className={cn("h-12 rounded-lg bg-[#F4F4F5] border-[#E8E8E8] text-[#0F172A] focus:bg-white focus:border-[#0F172A] transition-all", errors.password && "border-rose-400 bg-rose-50 focus:bg-rose-50")}
                        />
                        {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password}</p>}
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Role</label>
                        <Select value={form.role} onValueChange={val => handleChange('role', val)}>
                            <SelectTrigger className={cn("h-12 rounded-lg bg-[#F4F4F5] border-[#E8E8E8] text-[#0F172A] focus:bg-white transition-all", errors.role && "border-rose-400")}>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white border-[#E8E8E8] shadow-lg">
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
                        className="h-11 rounded-xl px-6 border border-[#E5E7EB] bg-white text-[#0F172A] shadow-none hover:bg-gray-100 hover:text-[#0F172A] hover:border-[#E5E7EB] hover:shadow-none hover:scale-100 active:scale-100 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-11 rounded-xl px-8 bg-[#0F172A] text-white shadow-none hover:bg-[#1E293B] hover:text-white hover:shadow-none hover:scale-100 active:scale-100 transition-colors font-semibold"
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

/** Pull a single user out of GET /users/:id (and similar) response shapes. */
function extractUserFromResponse(responseData: any) {
    if (!responseData || typeof responseData !== 'object') return null;
    if (responseData.user && typeof responseData.user === 'object') return responseData.user;
    if (responseData.data?.user && typeof responseData.data.user === 'object') return responseData.data.user;
    if (responseData.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data) && responseData.data.id) {
        return responseData.data;
    }
    if (responseData.id) return responseData;
    return null;
}

function formatUserRoleLabel(role?: string) {
    if (!role) return '—';
    if (role === 'SUPER_ADMIN') return 'Super Admin';
    if (role === 'INSTITUTION_ADMIN') return 'Inst. Admin';
    if (role === 'ADMIN') return 'Admin';
    if (role === 'USER') return 'User';
    return role;
}

function isUserActiveStatus(u: any) {
    if (!u) return false;
    if (u.isActive === true || u.active === true) return true;
    if (u.status === 'ACTIVE' || u.status === 'Active') return true;
    return false;
}

// ─── UserDetailDialog ─────────────────────────────────────────────────────────
// Calls GET /users/:id; seeds from list row so details show correctly immediately
const UserDetailDialog = ({ userId, open, onOpenChange, initialUser = null }) => {
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!open) {
            setUserDetail(null);
            return;
        }
        if (!userId) return;

        // Show list-row data right away so Role/Status match Recent Users
        if (initialUser) setUserDetail(initialUser);

        setLoading(!initialUser);
        getUserById(userId)
            .then((res) => {
                const user = extractUserFromResponse(res.data);
                if (user) setUserDetail(user);
            })
            .catch(() => {
                if (!initialUser) {
                    toast({ title: "Failed to load user", variant: "destructive" });
                }
            })
            .finally(() => setLoading(false));
    }, [open, userId, initialUser, toast]);

    const name = userDetail?.name || '—';
    const email = userDetail?.email || '—';
    const roleLabel = formatUserRoleLabel(userDetail?.role);
    const active = isUserActiveStatus(userDetail);
    const joinedAt = userDetail?.created_at || userDetail?.createdAt;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-3xl p-8">
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
                            <div className="w-16 h-16 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-2xl">
                                {getInitials(userDetail.name)}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-[#0F172A]">{name}</p>
                                <p className="text-sm text-[#747781]">{email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-[#F4F4F5] rounded-xl p-4">
                                <p className="text-[10px] font-bold text-[#787778] uppercase tracking-wider mb-1">Role</p>
                                <p className="text-sm font-semibold text-[#0F172A]">{roleLabel}</p>
                            </div>
                            <div className="bg-[#F4F4F5] rounded-xl p-4">
                                <p className="text-[10px] font-bold text-[#787778] uppercase tracking-wider mb-1">Status</p>
                                <span className={cn(
                                    "text-sm font-semibold",
                                    active ? "text-emerald-600" : "text-rose-500"
                                )}>
                                    {active ? "Active" : "Suspended"}
                                </span>
                            </div>
                            {joinedAt && (
                                <div className="bg-[#F4F4F5] rounded-xl p-4 col-span-2">
                                    <p className="text-[10px] font-bold text-[#787778] uppercase tracking-wider mb-1">Joined</p>
                                    <p className="text-sm font-semibold text-[#0F172A]">
                                        {format(new Date(joinedAt), 'PPP')}
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
    // Sidebar / admin-mode state lives in DashboardLayout and is shared via Outlet context
    const { isAdmin, setIsAdmin, userName } = useOutletContext<DashboardOutletContext>();

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
    const [selectedUserPreview, setSelectedUserPreview] = useState(null);
    const [userDetailOpen, setUserDetailOpen] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [confirmStatusUser, setConfirmStatusUser] = useState<{ id: string; name: string; active: boolean } | null>(null);

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
                else if (Array.isArray(raw?.data)) users = raw.data;
                else if (Array.isArray(raw?.users)) users = raw.users;
                else if (Array.isArray(raw)) users = raw;
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

    // ── Notification / recent activity ──────────────────────────────────────
    const fetchNotifications = async () => {
        setNotifLoading(true);
        try {
            const data = await getAuditLogs({ limit: 15, page: 1 });
            const logs =
                data?.logs ||
                data?.data?.logs ||
                data?.data ||
                (Array.isArray(data) ? data : []);
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

    // Load recent activity on mount + when notification panel opens
    useEffect(() => {
        void fetchNotifications();
    }, []);

    useEffect(() => {
        if (notifOpen) void fetchNotifications();
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
        try { localStorage.setItem('readNotifIds', JSON.stringify([...allIds])); } catch { }
    };

    const formatActivityLabel = (n: any) => {
        const action = (n.action || '').toLowerCase();
        const entity = (n.entity_type || n.entityType || '').toLowerCase();
        let meta = n.metadata;
        if (typeof meta === 'string') {
            try { meta = JSON.parse(meta); } catch { /* ignore */ }
        }
        const name = meta?.name ? String(meta.name) : '';

        if (action.includes('status')) {
            if (typeof meta?.active === 'boolean') {
                return meta.active ? `User reactivated${name ? `: ${name}` : ''}` : `User suspended${name ? `: ${name}` : ''}`;
            }
            return 'User status updated';
        }
        if (action.includes('create') && entity.includes('website')) {
            return name ? `Website created: ${name}` : 'Website created';
        }
        if (action.includes('create') && entity.includes('user')) {
            return name ? `User created: ${name}` : 'User created';
        }
        if (action.includes('create')) return name ? `Created: ${name}` : (n.action || 'Item created');
        if (action.includes('delete')) return name ? `Deleted: ${name}` : (n.action || 'Item deleted');
        if (action.includes('publish') || action.includes('deploy')) {
            return name ? `Published: ${name}` : 'Site published';
        }
        if (action.includes('update') || action.includes('edit')) {
            return name ? `Updated: ${name}` : (n.action || 'Item updated');
        }
        return n.action || 'System event';
    };

    const getNotifIcon = (action: string) => {
        const a = (action || '').toLowerCase();
        if (a.includes('delete') || a.includes('purge')) return <Trash className="w-3.5 h-3.5 text-rose-500" />;
        if (a.includes('create') || a.includes('register')) return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
        if (a.includes('login') || a.includes('auth')) return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
        if (a.includes('update') || a.includes('edit')) return <Info className="w-3.5 h-3.5 text-[#747781]" />;
        if (a.includes('publish') || a.includes('deploy')) return <Globe2 className="w-3.5 h-3.5 text-[#0F172A]" />;
        return <Activity className="w-3.5 h-3.5 text-[#787778]" />;
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
            <div className="min-h-screen bg-dashboard font-[Inter,sans-serif]">

                {/* Header bar — match Websites / Templates */}
                <div className="relative z-30 mb-6 rounded-3xl bg-[#0F172A] px-4 py-5 sm:px-7">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
                        <div className="absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                                Admin Dashboard
                            </h2>
                            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                Platform overview ·{' '}
                                {new Date().toLocaleDateString('en', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="flex w-full items-center gap-2 md:w-auto md:justify-end md:gap-2.5">
                            <div ref={notifRef} className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setNotifOpen((v) => !v)}
                                    className="relative h-10 w-10 rounded-full text-slate-300 hover:bg-white/10 hover:text-white hover:scale-100 md:h-11 md:w-11"
                                >
                                    <Bell className="h-4 w-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white">
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
                                            className="absolute right-0 top-12 z-[80] w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
                                        >
                                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                                                <span className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                                                    <Bell className="h-4 w-4" /> Notifications
                                                    {unreadCount > 0 && (
                                                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-600">
                                                            {unreadCount} new
                                                        </span>
                                                    )}
                                                </span>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllRead}
                                                        className="flex items-center gap-1 text-[11px] font-bold text-[#0F172A] hover:underline"
                                                    >
                                                        <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-[320px] overflow-y-auto">
                                                {notifLoading ? (
                                                    <div className="flex flex-col gap-3 p-4">
                                                        {Array.from({ length: 4 }).map((_, i) => (
                                                            <div key={i} className="flex animate-pulse items-start gap-3">
                                                                <div className="h-7 w-7 shrink-0 rounded-full bg-slate-100" />
                                                                <div className="flex-1 space-y-1.5">
                                                                    <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                                                                    <div className="h-2.5 w-1/2 rounded-full bg-slate-100" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : notifications.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                                                        <Bell className="h-8 w-8 opacity-20" />
                                                        <p className="text-sm font-medium">No notifications yet</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((n: any) => {
                                                        const isUnread = !readIds.has(n.id);
                                                        return (
                                                            <div
                                                                key={n.id}
                                                                className={cn(
                                                                    'flex items-start gap-3 border-b border-slate-50 px-5 py-3.5',
                                                                    isUnread && 'bg-slate-50'
                                                                )}
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                                                                        isUnread
                                                                            ? 'border border-slate-200 bg-white shadow-sm'
                                                                            : 'bg-slate-100'
                                                                    )}
                                                                >
                                                                    {getNotifIcon(n.action)}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p
                                                                        className={cn(
                                                                            'truncate text-[13px] leading-snug',
                                                                            isUnread
                                                                                ? 'font-semibold text-[#0F172A]'
                                                                                : 'font-medium text-slate-500'
                                                                        )}
                                                                    >
                                                                        {n.action || n.type || 'System event'}
                                                                    </p>
                                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                                        {formatNotifTime(n.createdAt || n.created_at)}
                                                                    </p>
                                                                </div>
                                                                {isUnread && (
                                                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0F172A]" />
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                            {notifications.length > 0 && (
                                                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                                                    <button
                                                        onClick={() => {
                                                            setNotifOpen(false);
                                                            navigate('/admin/audit');
                                                        }}
                                                        className="w-full text-center text-xs font-bold text-[#0F172A] hover:underline"
                                                    >
                                                        View all in Audit Logs →
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsAdmin(false)}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#0F172A] shadow-none transition-colors hover:scale-100 hover:bg-slate-100 hover:text-[#0F172A] active:scale-100 md:h-11 md:px-5 md:text-sm"
                            >
                                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#0F172A]" />
                                Exit Admin
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="space-y-5 bg-transparent py-6">

                    {/* Greeting + stats: banner left, 2×2 cards right */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
                        {/* Dark greeting banner — left */}
                        <div className="relative flex min-h-[220px] items-center overflow-hidden rounded-3xl bg-[#0F172A] px-7 py-6 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] lg:min-h-[240px]">
                            <div className="pointer-events-none absolute right-0 top-0 h-full w-48 translate-x-8 skew-x-[-15deg] bg-white/5" />
                            <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />
                            <div className="relative z-10 max-w-[55%] pr-2 sm:max-w-[48%]">
                                <p className="text-sm font-medium text-white/60">
                                    Good day,{' '}
                                    <span className="font-semibold text-white">{userName}</span>
                                </p>
                                <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">Admin Dashboard</h2>
                                <p className="mt-1.5 max-w-sm text-xs text-white/45">
                                    Here&apos;s what&apos;s happening on the platform today.
                                </p>
                            </div>
                            <img
                                src={adminHeroImg}
                                alt=""
                                className="pointer-events-none absolute -bottom-2 right-1 h-[80%] w-auto max-w-[48%] object-contain object-bottom sm:right-2 sm:h-[88%] sm:max-w-[58%] md:right-3 lg:-bottom-8 lg:h-[95%] lg:max-w-[60%]"
                                draggable={false}
                            />
                        </div>

                        {/* Stats — 2×2 grid on the right */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Total Users", value: isLoadingStats ? "…" : stats.totalUsers, icon: <Users className="w-4 h-4" />, iconBg: "bg-[#F4F4F5] text-[#0F172A]", trend: "+12.5%", up: true },
                                { label: "Active Websites", value: isLoadingStats ? "…" : stats.totalWebsites, icon: <Globe className="w-4 h-4" />, iconBg: "bg-[#F4F4F5] text-[#747781]", trend: "+3.2%", up: true },
                                { label: "Total Templates", value: dbTemplates.length, icon: <LayoutTemplate className="w-4 h-4" />, iconBg: "bg-[#F4F4F5] text-[#231500]", trend: "+2", up: true },
                                { label: "Active Deployments", value: isLoadingStats ? "…" : stats.activeDeployments, icon: <Activity className="w-4 h-4" />, iconBg: "bg-[#F4F4F5] text-[#787778]", trend: "+8.1%", up: true },
                            ].map((s, i) => (
                                <motion.div key={s.label}
                                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.07 }}
                                    className="rounded-3xl border border-[#E8E8E8] bg-white p-5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-xs font-semibold text-[#747781]">{s.label}</p>
                                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", s.iconBg)}>{s.icon}</div>
                                    </div>
                                    <p className="text-3xl font-bold text-[#0F172A]">{s.value}</p>
                                    <p className={cn("mt-1 flex items-center gap-0.5 text-xs font-semibold", s.up ? "text-emerald-600" : "text-rose-500")}>
                                        {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{s.trend}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Recent Users — 2/3 */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
                                <div>
                                    <h3 className="text-sm font-bold text-[#0F172A]">Recent Users</h3>
                                    <p className="text-[11px] text-[#747781] mt-0.5">Latest registered accounts</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="h-9 rounded-full px-4 text-xs font-semibold bg-[#0F172A] text-white gap-1.5 shadow-none hover:bg-[#1E293B] hover:text-white hover:shadow-none hover:scale-100 active:scale-100 transition-colors"
                                        onClick={() => setIsAddUserOpen(true)}
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add User
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 rounded-full px-4 text-xs font-semibold border border-[#E5E7EB] bg-white text-[#0F172A] shadow-none hover:bg-gray-100 hover:text-[#0F172A] hover:border-[#E5E7EB] hover:shadow-none hover:scale-100 active:scale-100 transition-colors"
                                        onClick={() => navigate('/admin/users')}
                                    >
                                        View All
                                    </Button>
                                </div>
                            </div>
                            <div>
                                {isLoadingUsers ? (
                                    <Loading label="Loading users" />
                                ) : adminUsers.length === 0 ? (
                                    <p className="text-center text-[#787778] py-10 text-sm">No users found.</p>
                                ) : (
                                    <div className="divide-y divide-[#F4F4F5]">
                                        {adminUsers.slice(0, 6).map((u) => (
                                            <div key={u.id} className="flex items-center justify-between px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                                        {getInitials(u.name)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F172A] leading-tight">{u.name}</p>
                                                        <p className="text-[11px] text-[#747781]">{u.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full",
                                                        u.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-500 border border-rose-100")}>
                                                        {u.active ? "Active" : "Suspended"}
                                                    </span>
                                                    <TooltipProvider delayDuration={200}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 rounded-lg hover:bg-[#F4F4F5] hover:scale-100"
                                                                    onClick={() => {
                                                                        setSelectedUserId(u.id);
                                                                        setSelectedUserPreview(u);
                                                                        setUserDetailOpen(true);
                                                                    }}
                                                                >
                                                                    <Eye className="w-3.5 h-3.5 text-[#787778]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="rounded-lg border-[#E5E7EB] bg-white text-[#0F172A] shadow-md">
                                                                View user details
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 rounded-lg hover:bg-[#F4F4F5] hover:scale-100"
                                                                    onClick={() => setConfirmStatusUser({ id: u.id, name: u.name, active: u.active })}
                                                                >
                                                                    <UserX className={cn("w-3.5 h-3.5", u.active ? "text-rose-400" : "text-emerald-500")} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="rounded-lg border-[#E5E7EB] bg-white text-[#0F172A] shadow-md">
                                                                {u.active ? 'Suspend user' : 'Reactivate user'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right column: Quick Actions + Recent Activity */}
                        <div className="flex flex-col gap-4">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5">
                                <h3 className="text-sm font-bold text-[#0F172A] mb-3">Quick Actions</h3>
                                <div className="space-y-1">
                                    {[
                                        { label: "Manage Users", icon: <Users className="w-3.5 h-3.5" />, bg: "bg-[#F4F4F5] text-[#0F172A]", to: '/admin/users' },
                                        { label: "Manage Websites", icon: <Globe className="w-3.5 h-3.5" />, bg: "bg-[#F4F4F5] text-[#747781]", to: '/admin/websites' },
                                        { label: "Manage Templates", icon: <LayoutTemplate className="w-3.5 h-3.5" />, bg: "bg-[#F4F4F5] text-[#231500]", to: '/admin/templates' },
                                        { label: "Monitor Deployments", icon: <Activity className="w-3.5 h-3.5" />, bg: "bg-[#F4F4F5] text-[#787778]", to: '/admin/deployment' },
                                        { label: "Audit Logs", icon: <ShieldCheck className="w-3.5 h-3.5" />, bg: "bg-[#F4F4F5] text-[#747781]", to: '/admin/audit' },
                                    ].map((a) => (
                                        <button key={a.label} onClick={() => navigate(a.to)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F8F8F9] transition-colors group text-left">
                                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", a.bg)}>{a.icon}</div>
                                            <span className="text-sm font-medium text-[#0F172A]">{a.label}</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-[#E8E8E8] ml-auto group-hover:text-[#747781] transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="flex flex-1 flex-col rounded-3xl border border-[#E8E8E8] bg-white p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-[#0F172A]">Recent Activity</h3>
                                    <button type="button" onClick={() => navigate('/admin/audit')} className="text-[11px] font-bold text-[#0F172A] hover:underline">View All</button>
                                </div>
                                <div className="space-y-3">
                                    {notifLoading && notifications.length === 0 && (
                                        <Loading className="min-h-[8rem] py-6" label="Loading activity" />
                                    )}
                                    {!notifLoading && notifications.length === 0 && (
                                        <p className="py-3 text-center text-xs text-[#787778]">No recent activity</p>
                                    )}
                                    {notifications.slice(0, 5).map((n: any) => (
                                        <div key={n.id} className="flex items-start gap-2.5">
                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4F4F5]">
                                                {getNotifIcon(n.action)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-[#0F172A]">
                                                    {formatActivityLabel(n)}
                                                </p>
                                                <p className="text-[10px] text-[#787778]">
                                                    {formatNotifTime(n.createdAt || n.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                onOpenChange={(open) => {
                    setUserDetailOpen(open);
                    if (!open) setSelectedUserPreview(null);
                }}
                initialUser={selectedUserPreview}
            />

            {/* Confirm suspend / reactivate */}
            <AlertDialog open={!!confirmStatusUser} onOpenChange={(open) => { if (!open) setConfirmStatusUser(null); }}>
                <AlertDialogContent className="w-[90%] max-w-md rounded-2xl border-[#E5E7EB]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#0F172A]">
                            {confirmStatusUser?.active ? 'Suspend this user?' : 'Reactivate this user?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmStatusUser?.active
                                ? <>This will suspend <span className="font-semibold text-[#0F172A]">{confirmStatusUser?.name}</span> and they will lose access.</>
                                : <>This will reactivate <span className="font-semibold text-[#0F172A]">{confirmStatusUser?.name}</span> and restore their access.</>}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="rounded-xl hover:scale-100"
                            onClick={() => setConfirmStatusUser(null)}
                        >
                            No
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className={cn(
                                'rounded-xl text-white hover:scale-100',
                                confirmStatusUser?.active
                                    ? 'bg-rose-600 hover:bg-rose-700'
                                    : 'bg-[#0F172A] hover:bg-[#1E293B]'
                            )}
                            onClick={() => {
                                if (confirmStatusUser) {
                                    void handleToggleUserStatus(confirmStatusUser.id, confirmStatusUser.active);
                                    setConfirmStatusUser(null);
                                }
                            }}
                        >
                            Yes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export { AddUserDialog, UserDetailDialog };
export default AdminDashboard;
