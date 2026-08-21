import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
            } flex: {
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
        <button type="button" onClick={toggle} className="text-outline-variant hover:text-on-surface transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    const firstName = name.split(' ')[0] || 'User';

    return (
        <DashboardPageShell basePath={basePath} pageLabel="Profile">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }
                .aurora-bg {
                    background: radial-gradient(circle at 15% 50%, rgba(218, 226, 253, 0.4), transparent 50%),
                                radial-gradient(circle at 85% 30%, rgba(190, 198, 224, 0.3), transparent 50%);
                }
            `}</style>

            <div className="flex-1 min-h-screen relative aurora-bg -m-6 p-margin-desktop overflow-y-auto">
                {/* Page Header */}
                <div className="mb-lg">
                    <div className="flex items-center text-body-sm text-on-surface-variant mb-2">
                        <Link className="hover:text-primary transition-colors" to={basePath}>Dashboard</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary font-medium">Profile</span>
                    </div>
                    <h2 className="font-display-lg text-display-lg text-on-surface mb-2 flex items-center">
                        Hi, {loading ? '…' : firstName} 
                        <span className="material-symbols-outlined ml-3 text-[40px] text-on-surface-variant">person</span>
                    </h2>
                    <p className="font-body-base text-body-base text-on-surface-variant">
                        Manage your account, password and preferences.
                    </p>
                </div>

                {/* Profile Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                    
                    {/* Left Column: Info Cards */}
                    <div className="lg:col-span-4 flex flex-col space-y-gutter">
                        
                        {/* Role & Status Cards Row */}
                        <div className="grid grid-cols-2 gap-sm">
                            {/* Role Card */}
                            <div className="glass-card rounded-xl p-md">
                                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3 block">Role</span>
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined text-on-surface-variant mr-2">person_outline</span>
                                    <span className="font-body-base text-body-base font-medium">{roleLabel(role)}</span>
                                </div>
                            </div>

                            {/* Status Card */}
                            <div className="glass-card rounded-xl p-md">
                                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3 block">Status</span>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                    <span className="font-body-base text-body-base font-medium text-emerald-700">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Account Info Card */}
                        <div className="glass-card rounded-xl p-md relative overflow-hidden">
                            <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none">
                                <span className="material-symbols-outlined text-[160px]">account_circle</span>
                            </div>
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-6 block">
                                Account Info
                            </span>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-4 shrink-0">
                                        <span className="material-symbols-outlined text-on-surface-variant">person</span>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="font-body-sm text-body-sm text-on-surface-variant block mb-1">Name</span>
                                        <span className="font-body-base text-body-base font-medium text-on-surface truncate block">
                                            {name || '—'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-4 shrink-0">
                                        <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="font-body-sm text-body-sm text-on-surface-variant block mb-1">Email</span>
                                        <span className="font-body-base text-body-base font-medium text-on-surface break-all block">
                                            {email || '—'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-4 shrink-0">
                                        <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="font-body-sm text-body-sm text-on-surface-variant block mb-1">Member Since</span>
                                        <span className="font-body-base text-body-base font-medium text-on-surface block">
                                            {stored?.createdAt
                                                ? new Date(stored.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })
                                                : 'Buildora'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone Card */}
                        <div className="bg-error-container/30 border border-error/20 rounded-xl p-md mt-lg">
                            <div className="flex items-center text-error mb-4">
                                <span className="material-symbols-outlined mr-2">warning</span>
                                <span className="font-label-md text-label-md font-semibold">Danger Zone</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-label-md text-label-md font-semibold text-on-surface mb-1">Deactivate Account</h4>
                                    <p className="font-body-sm text-body-sm text-error/80">You'll be logged out immediately.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDelOpen(true)}
                                    className="flex items-center justify-center px-4 py-2 border border-error/30 rounded-lg text-error hover:bg-error-container transition-colors shrink-0 bg-white/50"
                                >
                                    <span className="material-symbols-outlined text-[18px] mr-2">delete</span>
                                    <span className="font-label-md text-label-md">Remove</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-8 flex flex-col space-y-gutter">
                        
                        {/* Profile Information Form */}
                        <div className="glass-card rounded-xl p-md lg:p-lg">
                            <div className="mb-8">
                                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">Profile Information</h3>
                                <p className="font-body-base text-body-base text-on-surface-variant">Update your display name</p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-outline-variant" />
                                </div>
                            ) : (
                                <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }} className="space-y-6">
                                    {/* Display Name Field */}
                                    <div>
                                        <label className="font-label-md text-label-md text-on-surface-variant block mb-2" htmlFor="displayName">
                                            Display Name
                                        </label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                                                person_outline
                                            </span>
                                            <input
                                                id="displayName"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed-dim transition-all"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label className="font-label-md text-label-md text-on-surface-variant block mb-2" htmlFor="emailAddress">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                                                mail
                                            </span>
                                            <input
                                                id="emailAddress"
                                                type="email"
                                                value={email}
                                                disabled
                                                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-slate-200 rounded-lg font-body-base text-body-base text-on-surface-variant cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="font-body-sm text-body-sm text-outline-variant mt-2">Email cannot be changed here.</p>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-lg text-body-base transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                                        >
                                            {savingProfile ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>
                                            ) : (
                                                <>Save Changes</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Change Password Accordion */}
                        <div className="glass-card rounded-xl overflow-hidden transition-colors">
                            <div
                                onClick={() => setPwOpen((v) => !v)}
                                className="p-md flex items-center justify-between cursor-pointer hover:bg-white/60 transition-colors group"
                            >
                                <div>
                                    <h3 className="font-label-md text-label-md font-semibold text-on-surface mb-1">Change Password</h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                        {pwOpen ? 'Fill in the fields to update your password' : 'Click to update your password'}
                                    </p>
                                </div>
                                <div className={cn(
                                    "w-8 h-8 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-slate-200 transition-all duration-200",
                                    pwOpen && "rotate-180 bg-slate-200"
                                )}>
                                    <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                                </div>
                            </div>

                            {pwOpen && (
                                <div className="p-md lg:p-lg border-t border-slate-200/50 bg-white/40 space-y-4">
                                    <div>
                                        <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showOld ? 'text' : 'password'}
                                                value={oldPw}
                                                onChange={(e) => setOldPw(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pr-10 pl-4 py-3 bg-white/50 border border-slate-200 rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed-dim"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {eyeToggle(showOld, () => setShowOld((v) => !v))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNew ? 'text' : 'password'}
                                                    value={newPw}
                                                    onChange={(e) => setNewPw(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full pr-10 pl-4 py-3 bg-white/50 border border-slate-200 rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed-dim"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {eyeToggle(showNew, () => setShowNew((v) => !v))}
                                                </div>
                                            </div>
                                            <p className="font-body-sm text-body-sm text-outline-variant mt-1">Min 8 characters</p>
                                        </div>

                                        <div>
                                            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showCon ? 'text' : 'password'}
                                                    value={conPw}
                                                    onChange={(e) => setConPw(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full pr-10 pl-4 py-3 bg-white/50 border border-slate-200 rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-primary-fixed-dim"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {eyeToggle(showCon, () => setShowCon((v) => !v))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={savePw}
                                            disabled={savingPw}
                                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-lg text-body-base transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                                        >
                                            {savingPw ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> Updating…</>
                                            ) : (
                                                <>Update Password</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Deactivate Account Confirmation Dialog */}
            <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
                <AlertDialogContent className="rounded-2xl w-[calc(100vw-2rem)] sm:max-w-lg bg-surface-container-lowest border-outline-variant">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-error">
                            <span className="material-symbols-outlined">warning</span> Deactivate account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-on-surface-variant">
                            This will deactivate your account immediately. You'll be logged out and cannot log back in.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting} className="rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deactivate}
                            disabled={deleting}
                            className="bg-error hover:bg-error/90 text-on-error rounded-lg"
                        >
                            {deleting ? (
                                <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Deactivating…</>
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