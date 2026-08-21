import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Eye, EyeOff, Loader2,
    AlertTriangle, Trash2, Mail, User,
    CheckCircle2, KeyRound, Calendar, ChevronDown, UserCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getProfile, updateUserProfile, changePassword, deactivateOwnAccount } from '@/api/user';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';

function roleLabel(role: string) {
    return (role || 'USER').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function DashboardProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
    const { toast } = useToast();
    const stored = JSON.parse(localStorage.getItem('user') || 'null');

    // ─── State Logic ──────────────────────────────────────────────────────────
    const [name, setName] = useState(stored?.name || '');
    const [email] = useState(stored?.email || '');
    const [role] = useState(stored?.role || 'USER');
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);

    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [conPw, setConPw] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showCon, setShowCon] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    const [delOpen, setDelOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pwOpen, setPwOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const d = await getProfile();
                const u = d?.user || d;
                if (u?.name) setName(u.name);
            } catch {
                /* fallback to localStorage */
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const saveProfile = async () => {
        if (name.trim().length < 2) {
            toast({ title: 'Name too short', variant: 'destructive' });
            return;
        }
        setSavingProfile(true);
        try {
            await updateUserProfile(name.trim());
            if (stored) {
                localStorage.setItem('user', JSON.stringify({ ...stored, name: name.trim() }));
                window.dispatchEvent(new CustomEvent('userUpdated', { detail: { name: name.trim() } }));
            }
            toast({ title: 'Profile updated ✓' });
        } catch (e: any) {
            toast({ title: 'Update failed', description: e?.message, variant: 'destructive' });
        } finally {
            setSavingProfile(false);
        }
    };

    const savePw = async () => {
        if (!oldPw) {
            toast({ title: 'Enter current password', variant: 'destructive' });
            return;
        }
        if (newPw.length < 8) {
            toast({ title: 'Minimum 8 characters', variant: 'destructive' });
            return;
        }
        if (newPw !== conPw) {
            toast({ title: "Passwords don't match", variant: 'destructive' });
            return;
        }
        setSavingPw(true);
        try {
            await changePassword(oldPw, newPw);
            setOldPw('');
            setNewPw('');
            setConPw('');
            toast({ title: 'Password changed ✓' });
        } catch (e: any) {
            toast({ title: 'Failed', description: e?.message, variant: 'destructive' });
        } finally {
            setSavingPw(false);
        }
    };

    const deactivate = async () => {
        setDeleting(true);
        try {
            await deactivateOwnAccount();
            localStorage.removeItem('user');
            navigate('/');
        } catch (e: any) {
            toast({ title: 'Failed', description: e?.message, variant: 'destructive' });
        } finally {
            setDeleting(false);
            setDelOpen(false);
        }
    };

    const eyeToggle = (show: boolean, toggle: () => void) => (
        <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    return (
        <DashboardPageShell
            basePath={basePath}
            title={`Hi, ${loading ? '…' : (name.split(' ')[0] || 'there')}`}
            pageLabel="Profile"
            description="Manage your account, password and preferences."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start font-sans">
                {/* Left Column: Status & Info */}
                <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                    {/* Role & Status Row */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 min-w-0">
                            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Role</h3>
                            <div className="flex items-center gap-2 text-navy font-medium text-sm">
                                <User className="w-4 h-4 text-slate-400 shrink-0" />
                                {roleLabel(role)}
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 min-w-0">
                            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Status</h3>
                            <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                Active
                            </div>
                        </div>
                    </div>

                    {/* Account Info Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 relative overflow-hidden">
                        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-6">
                            Account Info
                        </h3>
                        {/* Decorative Icon Background */}
                        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] pointer-events-none select-none">
                            <UserCircle className="w-40 h-40 text-navy" strokeWidth={1} />
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Name</p>
                                    <p className="text-sm font-medium text-navy truncate">{name || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Email</p>
                                    <p className="text-sm font-medium text-navy break-all">{email || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Member Since</p>
                                    <p className="text-sm font-medium text-navy">
                                        {stored?.createdAt
                                            ? new Date(stored.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })
                                            : 'Buildora'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone Card */}
                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                            <h3 className="text-base font-semibold text-rose-600">Danger Zone</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-sm font-medium text-rose-900">Deactivate Account</p>
                                <p className="text-sm text-rose-600/80 mt-1">You'll be logged out immediately.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDelOpen(true)}
                                className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-rose-50 transition-colors shadow-sm shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Profile Information Form Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 md:p-8 flex flex-col">
                        <div className="mb-8 border-b border-slate-100 pb-6">
                            <h2 className="text-lg font-semibold text-navy">Profile Information</h2>
                            <p className="text-sm text-slate-500 mt-1">Update your display name</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <form className="space-y-6 flex-1" onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="displayName">
                                        Display Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <input
                                            id="displayName"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-md text-navy text-sm focus:ring-1 focus:ring-navy focus:border-navy outline-none transition-all shadow-sm"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="emailAddress">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <input
                                            id="emailAddress"
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-500 text-sm cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">Email cannot be changed here.</p>
                                </div>

                                <div className="pt-6 sm:pt-8 flex justify-stretch sm:justify-end">
                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className="bg-navy text-white px-6 py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-navy-hover transition-colors shadow-sm disabled:opacity-60 w-full sm:w-auto"
                                    >
                                        {savingProfile ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Change Password Collapsible Section */}
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-colors">
                        <div
                            onClick={() => setPwOpen((v) => !v)}
                            className="p-4 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                        >
                            <div>
                                <h3 className="text-base font-semibold text-navy">Change Password</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {pwOpen ? 'Fill in the fields to update your password' : 'Click to update your password'}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 transition-transform duration-200',
                                    pwOpen && 'rotate-180 bg-slate-200'
                                )}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>

                        {pwOpen && (
                            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showOld ? 'text' : 'password'}
                                            value={oldPw}
                                            onChange={(e) => setOldPw(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pr-10 pl-3 py-2 bg-white border border-slate-300 rounded-md text-navy text-sm focus:ring-1 focus:ring-navy outline-none"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {eyeToggle(showOld, () => setShowOld((v) => !v))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1.5">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNew ? 'text' : 'password'}
                                                value={newPw}
                                                onChange={(e) => setNewPw(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pr-10 pl-3 py-2 bg-white border border-slate-300 rounded-md text-navy text-sm focus:ring-1 focus:ring-navy outline-none"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {eyeToggle(showNew, () => setShowNew((v) => !v))}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">Min 8 characters</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCon ? 'text' : 'password'}
                                                value={conPw}
                                                onChange={(e) => setConPw(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pr-10 pl-3 py-2 bg-white border border-slate-300 rounded-md text-navy text-sm focus:ring-1 focus:ring-navy outline-none"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {eyeToggle(showCon, () => setShowCon((v) => !v))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-stretch sm:justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={savePw}
                                        disabled={savingPw}
                                        className="bg-navy text-white px-5 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-navy-hover transition-colors shadow-sm disabled:opacity-60 w-full sm:w-auto"
                                    >
                                        {savingPw ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Updating…
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="w-4 h-4" /> Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Deactivate Account Confirmation Dialog */}
            <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
                <AlertDialogContent className="rounded-2xl w-[calc(100vw-2rem)] sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-500" /> Deactivate account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate your account immediately. You'll be logged out and cannot log back in.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deactivate}
                            disabled={deleting}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Deactivating…
                                </>
                            ) : (
                                'Yes, Deactivate'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardPageShell>
    );
}