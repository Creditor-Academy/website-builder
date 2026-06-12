import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Plus, Globe, MoreVertical, Edit2, Trash2,
    Layout, Settings, LogOut, Clock, CheckCircle,
    FileText, Search, Sparkles, Zap, Files, Building2, ShoppingBag, Users,
    ArrowRight, ChevronLeft, Palette, Layers, MonitorPlay, Move, LayoutTemplate,
    Upload, Monitor, Link as LinkIcon, Activity, Menu, X, ShieldCheck, ListFilter, Bell, ArrowUp, ArrowDown,
    UserX, RefreshCw, Eye, Image as ImageIcon, Loader2, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import GradientButton from '@/components/ui/GradientButton';

import { templatesList } from '@/lib/templates';
import templateApi from '@/api/templates';
import { loginUser, logoutUser } from "../api/auth";
import statsApi from "../api/stats";
import {
    updateUserProfile,
    deactivateOwnAccount,
    getUserById,
    getUsers,
    updateUserRole,
    updateUserStatus,
    restoreUser,
    createUser,
} from "../api/user";


// OverviewCard component
const OverviewCard = ({ title, value, icon, description, iconBgClass, iconColorClass }) => (
    <Card className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1 group/overview-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4">
            <CardTitle className="text-base font-semibold text-slate-700">{title}</CardTitle>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover/overview-card:scale-105 transition-transform", iconBgClass, iconColorClass)}>{icon}</div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-slate-900">{value}</div>
            {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
        </CardContent>
    </Card>
);

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

const WebsiteCard = ({ site, index, onDelete, onEdit, onViewMessages }) => {
    const template = templatesList.find((t) => t.id === site.templateId);

    return (
        <Card className="group/website-card border border-slate-200 bg-white rounded-3xl overflow-hidden flex flex-col shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
                {template && template.id !== 'blank' ? (
                    <div className="absolute inset-0 transition-transform duration-500 group-hover/website-card:scale-105 p-4">
                        <img src={template.image} alt={site.name} className="w-full h-full object-cover rounded-2xl border border-slate-200 shadow-sm" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover/website-card:opacity-100 transition-opacity duration-300" />
                    </div>
                ) : (
                    <div className="absolute inset-0 transition-transform duration-500 group-hover/website-card:scale-105 p-4">
                        <div className="w-full h-full border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden">
                            <div className="h-6 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                                <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                                <div className="flex gap-2 pt-2">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50" />
                                    <div className="h-8 w-8 rounded-lg bg-slate-50" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover/website-card:opacity-100 transition-opacity duration-300" />
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover/website-card:opacity-100 transition-all duration-300 z-10">
                    <Button size="sm" onClick={onEdit} className="bg-white text-slate-900 hover:bg-white/90 rounded-full shadow-lg">
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                </div>
            </div>

            <CardHeader className="p-6 pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold text-slate-800 group-hover/website-card:text-indigo-600 transition-colors leading-tight">
                            {site.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {format(new Date(site.lastEdited), 'MMM d, p')}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                            <DropdownMenuItem onClick={onEdit} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                                <Edit2 className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                                <Files className="w-4 h-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onDelete} className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                <Trash2 className="w-4 h-4" /> Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardFooter className="p-6 pt-3 mt-auto flex justify-between items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${site.status === 'Published'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${site.status === 'Published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {site.status}
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="link" className="text-slate-500 p-0 h-auto text-sm font-semibold hover:text-indigo-600" onClick={onViewMessages}>
                        Messages
                    </Button>
                    <Button variant="link" className="text-indigo-600 p-0 h-auto text-sm font-bold group-hover/website-card:underline underline-offset-4" onClick={onEdit}>
                        Open Editor →
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

const EmptyState = ({ onAction }) => (
    <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white p-12 text-center transition-all hover:border-primary/20 hover:bg-slate-50/50">
        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6">
            <Globe className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Your creative journey starts here</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Every great brand starts with a single page. Build yours with our visual canvas.
        </p>
        <Button size="lg" className="mt-6 rounded-full px-8 gap-2 shadow-lg shadow-primary/20" onClick={onAction}>
            <Plus className="w-5 h-5" /> Create Your First Site
        </Button>
    </div>
);


// ─── SettingsView ─────────────────────────────────────────────────────────────
// Integrated: updateUserProfile (PUT /users/me), deactivateOwnAccount (DELETE /users/me)
const SettingsView = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || 'null');
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [deactivating, setDeactivating] = useState(false);
    const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false);

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            await updateUserProfile(name);

            if (user) {
                localStorage.setItem("user", JSON.stringify({ ...user, name }));
                window.dispatchEvent(new CustomEvent("userUpdated", { detail: { name } }));
            }

            toast({
                title: "Profile updated",
                description: "Name updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Update failed",
                description: typeof error === 'string'
                    ? error
                    : error?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ NEW: Calls DELETE /users/me, clears localStorage, redirects to home
    const handleDeactivateAccount = async () => {
        try {
            setDeactivating(true);
            await deactivateOwnAccount();
            localStorage.removeItem("user");
            toast({ title: "Account deactivated", description: "Your account has been deactivated." });
            navigate("/");
        } catch (error) {
            toast({
                title: "Deactivation failed",
                description: typeof error === 'string'
                    ? error
                    : error?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setDeactivating(false);
            setConfirmDeactivateOpen(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-12 animate-in fade-in duration-500 pb-32">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your profile, security, and account preferences.</p>
            </div>

            <section className="bg-white border rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Profile Information</h3>
                        <p className="text-sm text-slate-500">Update your personal details.</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <Input value={email} disabled className="h-14 rounded-2xl bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-60" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Email cannot be changed directly.</p>
                    </div>
                </div>
                <Button onClick={handleUpdateProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </section>

            <section className="bg-white border rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Security</h3>
                        <p className="text-sm text-slate-500">Manage your password.</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Password</label>
                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all shadow-inner" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">New Password</label>
                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all shadow-inner" />
                        </div>
                    </div>
                    <Button className="rounded-2xl px-10 h-14 font-bold" variant="secondary" onClick={() => toast({ title: "Password changed", description: "Password updated successfully." })}>
                        Update Password
                    </Button>
                </div>
            </section>

            {/* ✅ UPDATED: Danger Zone now uses deactivateOwnAccount API with confirmation dialog */}
            <section className="bg-rose-50 border border-rose-100 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Danger Zone</h3>
                        <p className="text-sm text-rose-600">Irreversible account actions.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-rose-100/50">
                    <div className="space-y-1">
                        <p className="font-black text-slate-900 text-lg">Deactivate Account</p>
                        <p className="text-sm text-slate-500 max-w-md font-medium">Temporarily disable your profile and all websites. This action will log you out immediately.</p>
                    </div>
                    <Dialog open={confirmDeactivateOpen} onOpenChange={setConfirmDeactivateOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="rounded-2xl font-black h-14 px-8 shadow-lg shadow-rose-200"
                                disabled={deactivating}
                            >
                                <UserX className="w-4 h-4 mr-2" />
                                {deactivating ? "Deactivating..." : "Deactivate Profile"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-[2rem]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-slate-900">Confirm Deactivation</DialogTitle>
                                <DialogDescription className="text-slate-500 mt-2">
                                    Are you sure you want to deactivate your account? You will be logged out immediately. This action can be reversed by an admin.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 mt-4">
                                <Button variant="outline" onClick={() => setConfirmDeactivateOpen(false)} className="rounded-xl">
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeactivateAccount}
                                    disabled={deactivating}
                                    className="rounded-xl"
                                >
                                    {deactivating ? "Deactivating..." : "Yes, Deactivate"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </section>
        </div>
    );
};

const getInitials = (name) => {
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

const userDashboardRoutes = [];

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
    }, [open, userId]);

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

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { websites, fetchWebsites, createWebsite, deleteWebsite } = useBuilderStore();
    const isMobile = useIsMobile();
    const user = JSON.parse(localStorage.getItem("user") || 'null');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userName, setUserName] = useState(user?.name || 'User');
    const [tempUserName, setTempUserName] = useState(user?.name || 'User');
    const [tempUserEmail] = useState(user?.email || '');

    const { toast } = useToast();

    const [newSiteName, setNewSiteName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [filterStatus, setFilterStatus] = useState('all');
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

    // DB templates for New Project dialog
    const [dbTemplates, setDbTemplates] = useState<any[]>([]);
    const [isCreatingSite, setIsCreatingSite] = useState(false);

    const adminRoutes = [
        '/dashboard/users',
        '/dashboard/organizations',
        '/dashboard/websites',
        // '/dashboard/admin-templates',
        '/dashboard/deployment',
        '/dashboard/settings',
    ];

    // ✅ Listen for userUpdated event
    useEffect(() => {
        const handleUserUpdated = (e) => {
            setUserName(e.detail.name);
            setTempUserName(e.detail.name);
        };
        window.addEventListener("userUpdated", handleUserUpdated);
        return () => window.removeEventListener("userUpdated", handleUserUpdated);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        if (!isAdmin && adminRoutes.includes(location.pathname)) {
            navigate('/dashboard');
        } else if (isAdmin && userDashboardRoutes.includes(location.pathname)) {
            navigate('/dashboard');
        }
    }, [user, isAdmin, location.pathname, navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoadingStats(true);
                const response = await statsApi.getDashboardStats({ adminView: isAdmin });
                if (response.data && response.data.data) {
                    setStats(response.data.data);
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
        if (isAdmin) {
            setIsLoadingUsers(true);
            getUsers({ limit: 10, page: 1 })
                .then((res) => {
                    const data = res.data?.data?.users || res.data?.data || res.data || [];
                    setAdminUsers(Array.isArray(data) ? data : []);
                })
                .catch((err) => console.error("Failed to fetch users:", err))
                .finally(() => setIsLoadingUsers(false));
        }
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

    const handleProfileSave = async () => {
        try {
            setIsUpdatingProfile(true);
            await updateUserProfile(tempUserName);

            const updatedUser = { ...user, name: tempUserName };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUserName(tempUserName);

            setIsUserProfileDialogOpen(false);
            toast({ title: "Profile updated", description: "Your name has been updated successfully." });
        } catch (error) {
            console.error("Profile update failed:", error);
            toast({
                title: "Update failed",
                description: error?.response?.data?.message || "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

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

    const handleDialogClose = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setNewSiteName('');
            setSelectedTemplate('blank');
        }
    };

    const filteredWebsites = React.useMemo(() => {
        if (!websites) return [];
        let tempWebsites = websites.filter(site =>
            site.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filterStatus === 'all') {
            tempWebsites = tempWebsites.filter(site => site.status?.toLowerCase() !== 'deleted');
        } else {
            tempWebsites = tempWebsites.filter(site => site.status?.toLowerCase() === filterStatus.toLowerCase());
        }

        if (sortBy === 'recent') {
            tempWebsites.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
        } else if (sortBy === 'name') {
            tempWebsites.sort((a, b) => a.name.localeCompare(b.name));
        }

        return tempWebsites;
    }, [websites, searchQuery, sortBy, filterStatus]);

    const handleCreateSite = async () => {
        if (!newSiteName.trim() || isCreatingSite) return;
        try {
            setIsCreatingSite(true);
            const id = await createWebsite(newSiteName, selectedTemplate);
            setIsDialogOpen(false);
            setNewSiteName('');
            setSelectedTemplate('blank');
            navigate(`/builder/${id}`);
        } catch (err: any) {
            toast({
                title: 'Could not create site',
                description: err?.message || 'Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsCreatingSite(false);
        }
    };

    return (
        <div className="h-screen bg-[#f8fafc] flex font-sans selection:bg-primary/10 relative overflow-hidden">
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
                    {!isAdmin && (
                        <NavItem icon={<Globe className="w-4 h-4" />} label="Dashboard" to="/dashboard" />
                    )}
                    <NavItem icon={<Layout className="w-4 h-4" />} label="Templates" to="/dashboard/templates" />
                    <NavItem icon={<ImageIcon className="w-4 h-4" />} label="Assets" to="/dashboard/assets" />
                    <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Messages" to="/dashboard/messages" />
                    {isAdmin && (
                        <div className="pt-1">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-1">System</p>
                            <NavItem icon={<Users className="w-4 h-4" />} label="Users" to="/dashboard/users" activeColor="text-white" />
                            {user?.role === 'SUPER_ADMIN' && (
                                <NavItem icon={<Building2 className="w-4 h-4" />} label="Organizations" to="/dashboard/organizations" activeColor="text-white" />
                            )}
                            <NavItem icon={<Layout className="w-4 h-4" />} label="Websites" to="/dashboard/websites" activeColor="text-white" />
                            {/* <NavItem icon={<LayoutTemplate className="w-4 h-4" />} label="Templates" to="/dashboard/admin-templates" activeColor="text-white" /> */}
                            <NavItem icon={<Activity className="w-4 h-4" />} label="Deployment Monitoring" to="/dashboard/deployment" activeColor="text-white" />
                            <NavItem icon={<ShieldCheck className="w-4 h-4" />} label="Audit Logs" to="/dashboard/audit" activeColor="text-white" />
                            <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" to="/dashboard/settings" activeColor="text-white" />
                        </div>
                    )}
                </nav>

                <div className="p-4 mt-auto space-y-3">
                    {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'INSTITUTION_ADMIN') && (
                        <GradientButton
                            className="w-full justify-start py-2 px-3 text-sm"
                            onClick={() => setIsAdmin(!isAdmin)}
                            icon={isAdmin
                                ? <ShieldCheck className="w-4 h-4 text-purple-400" />
                                : <Users className="w-4 h-4" />
                            }
                        >
                            {isAdmin ? "Admin Mode On" : "Switch to Admin Mode"}
                        </GradientButton>
                    )}

                    <div
                        className={`flex items-center gap-3 p-2 rounded-xl transition-colors border border-transparent 
                            ${isLoggingOut ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer hover:border-slate-700"}
                        `}
                        onClick={!isLoggingOut ? handleLogout : undefined}
                    >
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                                {getInitials(userName)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-800 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                {isLoggingOut ? "Logging out..." : userName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">Pro Plan</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">

                {location.pathname === '/dashboard' && !isAdmin ? (
                    <>
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                            <div className="flex items-center gap-4">
                                {isMobile && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden"
                                        onClick={() => setIsSidebarOpen(true)}
                                    >
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                )}
                                <div>
                                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Project Hub</h2>
                                    <p className="text-lg text-slate-600 flex items-center gap-2 mt-1">
                                        Welcome back! You have <span className="text-indigo-600 font-medium">{websites.length} active projects</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                    <DialogTrigger asChild>
                                        <GradientButton
                                            onClick={() => setIsDialogOpen(true)}
                                            className="h-11 px-6 text-base w-auto rounded-full"
                                            icon={<Plus className="w-5 h-5 text-purple-600 group-hover:text-indigo-600 transition-colors" />}
                                        >
                                            New Project
                                        </GradientButton>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-5xl rounded-[2rem] p-0 overflow-hidden bg-white border-slate-100 shadow-2xl">
                                        <DialogTitle className="sr-only">Create New Website</DialogTitle>
                                        <div className="flex flex-col md:flex-row h-[700px] w-full">
                                            <div className="w-full md:w-1/3 bg-white p-10 flex flex-col pt-12 border-r border-slate-100 relative z-10 shadow-xl rounded-l-[2rem]">
                                                <div>
                                                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                                        <LayoutTemplate className="w-7 h-7" />
                                                    </div>
                                                    <h2 className="text-[2rem] font-black text-slate-900 tracking-tight mb-3 leading-none">Create a Project</h2>
                                                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                                                        Give your masterpiece a name and select a starting template to kick things off.
                                                    </p>
                                                </div>
                                                <div className="mt-4 space-y-4 flex-1">
                                                    <div className="relative group/input-wrapper">
                                                        <label className="text-xs font-bold text-slate-800 mb-2 block uppercase tracking-wider">Project Name</label>
                                                        <Input
                                                            placeholder="e.g., My Awesome Site"
                                                            value={newSiteName}
                                                            onChange={(e) => setNewSiteName(e.target.value)}
                                                            className="h-14 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-slate-900 shadow-inner"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-auto pt-8 border-t border-slate-100">
                                                    <Button
                                                        onClick={handleCreateSite}
                                                        disabled={!newSiteName.trim() || isCreatingSite}
                                                        className="w-full h-14 font-bold text-lg flex items-center justify-center gap-2 group/button-create-site active:scale-[0.98] rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 transition-all">
                                                        {isCreatingSite ? (
                                                            <><Loader2 className="w-5 h-5 animate-spin" /> Creating...
                                                            </>
                                                        ) : (
                                                            <>Start Building
                                                            <ArrowRight className="w-5 h-5 group-hover/button-create-site:translate-x-1 transition-transform" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-2/3 bg-slate-50 p-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Select a Template</h3>
                                                    <span className="text-xs font-bold text-slate-500 px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm uppercase tracking-wider">
                                                        {dbTemplates.length} options
                                                    </span>
                                                </div>



                                                {/* DB Templates */}
                                                {dbTemplates.length > 0 && (
                                                    <>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Custom Templates</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                                                            {dbTemplates.map((tpl) => (
                                                                <div
                                                                    key={tpl.id}
                                                                    onClick={() => setSelectedTemplate(tpl.id)}
                                                                    className={cn(
                                                                        "group/template-dialog-card cursor-pointer rounded-[1.5rem] overflow-hidden transition-all duration-300 relative border-[3px] bg-white flex flex-col",
                                                                        selectedTemplate === tpl.id
                                                                            ? "border-blue-500 shadow-[0_10px_40px_rgba(59,130,246,0.15)] scale-[1.02]"
                                                                            : "border-transparent border-slate-200 hover:border-blue-300 hover:shadow-xl opacity-80 hover:opacity-100"
                                                                    )}
                                                                >
                                                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                                                        {tpl.image ? (
                                                                            <img
                                                                                src={tpl.image}
                                                                                alt={tpl.name}
                                                                                className={cn("w-full h-full object-cover transition-transform duration-700", selectedTemplate === tpl.id ? "scale-105" : "group-hover/template-dialog-card:scale-105")}
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                                                                                <LayoutTemplate className="w-12 h-12 text-indigo-200" />
                                                                                <p className="text-xs text-indigo-300 font-medium mt-2">{tpl.category || 'Template'}</p>
                                                                            </div>
                                                                        )}
                                                                        <AnimatePresence>
                                                                            {selectedTemplate === tpl.id && (
                                                                                <motion.div
                                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                                    exit={{ scale: 0, opacity: 0 }}
                                                                                    className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                                                                                >
                                                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                                                </motion.div>
                                                                            )}
                                                                        </AnimatePresence>
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover/template-dialog-card:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                                            <p className="text-white font-semibold text-sm drop-shadow-md">{tpl.description || ''}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-6 flex items-center gap-4 bg-white relative z-10 border-t border-slate-100">
                                                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm", selectedTemplate === tpl.id ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500")}>
                                                                            <LayoutTemplate className="w-6 h-6" />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className={cn("font-bold text-lg transition-colors leading-tight", selectedTemplate === tpl.id ? "text-slate-900" : "text-slate-700")}>{tpl.name}</h4>
                                                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{tpl.category || 'Custom'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={isUserProfileDialogOpen} onOpenChange={setIsUserProfileDialogOpen}>
                                    <DialogTrigger asChild>
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-sm border-2 border-slate-300 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
                                            {getInitials(tempUserName)}
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-8 bg-white border-slate-200 shadow-xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold text-slate-900">User Profile</DialogTitle>
                                            <DialogDescription className="text-slate-500">View and update your profile information.</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col items-center gap-4 py-4">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-4xl shadow-lg">
                                                {getInitials(tempUserName)}
                                            </div>
                                            <div className="grid gap-2 w-full">
                                                <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
                                                <Input
                                                    id="name"
                                                    value={tempUserName}
                                                    onChange={(e) => setTempUserName(e.target.value)}
                                                    className="rounded-xl bg-slate-50 border-slate-200 px-4 h-12 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div className="grid gap-2 w-full">
                                                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                                                <Input
                                                    id="email"
                                                    value={tempUserEmail}
                                                    disabled
                                                    className="rounded-xl bg-slate-100 border-slate-200 px-4 h-12 text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
                                            <Button variant="outline" onClick={() => setIsUserProfileDialogOpen(false)} className="rounded-xl h-12 px-6 text-base border-slate-200 text-slate-700 hover:bg-slate-100">
                                                Cancel
                                            </Button>
                                            <Button type="submit" onClick={handleProfileSave} disabled={isUpdatingProfile} className="rounded-xl h-12 px-6 text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-600/30 transition-all">
                                                {isUpdatingProfile ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </header>

                        {/* Overview Cards */}
                        <section className="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
                            <OverviewCard
                                title="Total Websites"
                                value={isLoadingStats ? "..." : stats.totalWebsites}
                                description="Real-time project count"
                                icon={<Globe className="w-5 h-5" />}
                                iconBgClass="bg-gradient-to-br from-purple-600 to-indigo-600"
                                iconColorClass="text-white"
                            />
                            <OverviewCard
                                title="Templates Available"
                                value={dbTemplates.length}
                                description="Ready to use designs"
                                icon={<Layout className="w-5 h-5" />}
                                iconBgClass="bg-gradient-to-br from-emerald-600 to-teal-600"
                                iconColorClass="text-white"
                            />
                        </section>

                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                            <div className="relative flex-1 w-full">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search projects..."
                                    className="pl-10 w-full h-12 bg-white border-slate-200 rounded-full shadow-md shadow-slate-200/50 focus:ring-primary/20 focus:shadow-lg focus:shadow-slate-300/50 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full md:w-[160px] h-12 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-primary/20 focus:shadow-lg focus:shadow-slate-300/50 transition-all flex items-center justify-between px-4">
                                    <ListFilter className="w-4 h-4 text-slate-400" />
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
                                    <SelectItem value="recent">Recent</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                {['all', 'draft', 'published', 'deleted'].map((status) => (
                                    <Button
                                        key={status}
                                        variant={filterStatus === status ? 'default' : 'outline'}
                                        className={cn(
                                            "rounded-full h-10 px-4 text-sm font-semibold capitalize",
                                            filterStatus === status
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700",
                                            "transition-all duration-200"
                                        )}
                                        onClick={() => setFilterStatus(status)}
                                    >
                                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {websites.length === 0 ? (
                            <EmptyState onAction={() => setIsDialogOpen(true)} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredWebsites.map((site, index) => (
                                    <WebsiteCard
                                        key={site.id}
                                        site={site}
                                        index={index}
                                        onDelete={() => deleteWebsite(site.id)}
                                        onEdit={() => navigate(`/builder/${site.id}`)}
                                        onViewMessages={() => navigate(`/dashboard/messages?websiteId=${site.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : location.pathname === '/dashboard' && isAdmin ? (
                    <div className="relative min-h-screen py-0 px-0 overflow-hidden">
                        {/* Admin Dashboard Header */}
                        <motion.header
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="sticky top-0 z-30 flex items-center justify-between min-h-[180px] px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/30 shrink-0 rounded-b-[2rem]"
                        >
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
                                }}
                                className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-2xl font-semibold text-white/80 mb-1">Welcome back, {userName}!</motion.p>
                                    <motion.h2 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-4xl font-extrabold text-white tracking-tight">Admin Dashboard</motion.h2>
                                    <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-lg text-white/80 mt-0.5">Platform overview and management at a glance.</motion.p>
                                </div>
                            </motion.div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="relative rounded-full h-12 w-12 text-white hover:bg-white/10 transition-colors">
                                    <Bell className="w-6 h-6" />
                                    <span className="absolute top-3 right-3 block w-2.5 h-2.5 rounded-full bg-white" />
                                </Button>
                                <DropdownMenu open={isUserProfileDialogOpen} onOpenChange={setIsUserProfileDialogOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-base cursor-pointer shadow-md hover:shadow-lg transition-all">
                                            {getInitials(userName)}
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100" onClick={() => navigate('/dashboard/settings')}>
                                            <Settings className="w-4 h-4" /> Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                            <LogOut className="w-4 h-4" /> Log Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </motion.header>

                        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-10">
                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[
                                    { label: "Total Users", value: isLoadingStats ? "..." : stats.totalUsers, icon: <Users className="w-5 h-5" />, bg: "bg-purple-100", color: "text-purple-600", trend: "+12.5%", up: true },
                                    { label: "Active Websites", value: isLoadingStats ? "..." : stats.totalWebsites, icon: <Globe className="w-6 h-6" />, bg: "bg-indigo-100", color: "text-indigo-600", trend: "-3.2%", up: false },
                                    { label: "Total Templates", value: dbTemplates.length, icon: <LayoutTemplate className="w-5 h-5" />, bg: "bg-emerald-100", color: "text-emerald-600", trend: "+2 Templates", up: true },
                                    { label: "Active Deployments", value: isLoadingStats ? "..." : stats.activeDeployments, icon: <Activity className="w-5 h-5" />, bg: "bg-rose-100", color: "text-rose-600", trend: "+8.1%", up: true },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                                {stat.icon}
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <span className="text-4xl font-extrabold text-slate-900">{stat.value}</span>
                                            <span className={`text-sm font-semibold flex items-center ${stat.up ? "text-emerald-500" : "text-rose-500"}`}>
                                                {stat.up ? <ArrowUp className="w-4 h-4 mr-0.5" /> : <ArrowDown className="w-4 h-4 mr-0.5" />}
                                                {stat.trend}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </section>

                            {/* ✅ NEW: Admin Users Quick Panel — uses real getUsers data */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-slate-900">Recent Users</h3>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            className="rounded-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 hover:shadow-lg transition-all gap-1.5"
                                            onClick={() => setIsAddUserOpen(true)}
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add User
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => navigate('/dashboard/users')}>
                                            View All <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
                                    {isLoadingUsers ? (
                                        <div className="flex items-center justify-center py-12">
                                            <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                                        </div>
                                    ) : adminUsers.length === 0 ? (
                                        <p className="text-center text-slate-400 py-10 text-sm">No users found.</p>
                                    ) : (
                                        <div className="divide-y divide-slate-50">
                                            {adminUsers.slice(0, 6).map((u) => (
                                                <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                            {getInitials(u.name)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                                                            <p className="text-xs text-slate-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                                                            u.active
                                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                                : "bg-rose-50 text-rose-500 border border-rose-100"
                                                        )}>
                                                            {u.active ? "Active" : "Suspended"}
                                                        </span>
                                                        {/* View detail */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full hover:bg-slate-100"
                                                            title="View user details"
                                                            onClick={() => { setSelectedUserId(u.id); setUserDetailOpen(true); }}
                                                        >
                                                            <Eye className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                        {/* Suspend / Reactivate */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full hover:bg-slate-100"
                                                            title={u.active ? "Suspend user" : "Reactivate user"}
                                                            onClick={() => handleToggleUserStatus(u.id, u.active)}
                                                        >
                                                            <UserX className={cn("w-4 h-4", u.active ? "text-rose-400" : "text-emerald-500")} />
                                                        </Button>
                                                        {/* Restore (only for deleted users) */}
                                                        {u.deletedAt && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full hover:bg-slate-100"
                                                                title="Restore deleted user"
                                                                onClick={() => handleRestoreUser(u.id)}
                                                            >
                                                                <RefreshCw className="w-4 h-4 text-blue-400" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick action cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { label: "Manage Users", desc: "Overview and control of all user accounts.", icon: <Users className="w-7 h-7" />, bg: "bg-purple-100", color: "text-purple-600", border: "hover:border-purple-300", to: '/dashboard/users' },
                                        { label: "Manage Websites", desc: "Oversee all created websites, their status, and configurations.", icon: <Layout className="w-7 h-7" />, bg: "bg-indigo-100", color: "text-indigo-600", border: "hover:border-indigo-300", to: '/dashboard/websites' },
                                        { label: "Manage Templates", desc: "Browse, add, and manage all available website templates.", icon: <LayoutTemplate className="w-7 h-7" />, bg: "bg-emerald-100", color: "text-emerald-600", border: "hover:border-emerald-300", to: '/dashboard/admin-templates' },
                                    ].map((card) => (
                                        <motion.div
                                            key={card.label}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() => navigate(card.to)}
                                            className={`relative cursor-pointer bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-start transition-all duration-300 hover:-translate-y-1 ${card.border}`}
                                        >
                                            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                                                {card.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{card.label}</h3>
                                            <p className="text-slate-600 text-sm">{card.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="lg:col-span-1 space-y-6">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                        onClick={() => navigate('/dashboard/deployment')}
                                        className="relative cursor-pointer bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:border-rose-300"
                                    >
                                        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                            <Activity className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">Monitor Deployments</h3>
                                        <p className="text-slate-600 text-sm">Track the status and history of all website deployments.</p>
                                    </motion.div>

                                    <Card className="rounded-2xl bg-white border border-slate-100 shadow-lg p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Insights</h3>
                                        <p className="text-sm text-slate-600">Additional admin information can go here. For example, recent logs, system health, or quick links.</p>
                                        <Button variant="link" className="mt-4 self-start text-purple-600 p-0 h-auto text-sm font-bold">
                                            View Details →
                                        </Button>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Outlet key={location.pathname} />
                )}
            </main>

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
        </div>
    );
};

export { SettingsView };
export default Dashboard;