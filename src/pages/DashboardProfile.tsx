import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Lock, Eye, EyeOff, Loader2,
    AlertTriangle, Trash2, Mail, User,
    CheckCircle2, KeyRound, Calendar, ChevronDown,
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
import accountImg from '@/assets/account.png';

function getInitials(name: string) {
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
function roleLabel(role: string) {
    return (role || 'USER').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function Field({
    label, value, onChange, disabled, type = 'text', placeholder, hint, icon, right,
}: {
    label: string; value: string; onChange?: (v: string) => void;
    disabled?: boolean; type?: string; placeholder?: string; hint?: string;
    icon?: React.ReactNode; right?: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#787778] uppercase tracking-widest">{label}</label>
            <div className="relative">
                {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#787778] pointer-events-none">{icon}</span>}
                <Input
                    type={type} value={value}
                    onChange={e => onChange?.(e.target.value)}
                    disabled={disabled} placeholder={placeholder}
                    className={cn(
                        'h-10 rounded-lg border-[#E8E8E8] bg-[#F4F4F5] text-[#0F172A] text-sm font-medium',
                        'focus-visible:ring-2 focus-visible:ring-[#0F172A]/15 focus:border-[#0F172A] focus:bg-white transition-all',
                        icon && 'pl-9', right && 'pr-10',
                        disabled && 'bg-[#F4F4F5] text-[#787778] cursor-not-allowed border-[#E8E8E8]',
                    )}
                />
                {right && <span className="absolute right-3 top-1/2 -translate-y-1/2">{right}</span>}
            </div>
            {hint && <p className="text-[10px] text-[#787778] mt-0.5">{hint}</p>}
        </div>
    );
}

export default function DashboardProfile() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const stored = JSON.parse(localStorage.getItem('user') || 'null');

    const [name,  setName]  = useState(stored?.name  || '');
    const [email]           = useState(stored?.email || '');
    const [role]            = useState(stored?.role  || 'USER');
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);

    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [conPw, setConPw] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showCon, setShowCon] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    const [delOpen,   setDelOpen]   = useState(false);
    const [deleting,  setDeleting]  = useState(false);
    const [pwOpen,    setPwOpen]    = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const d = await getProfile();
                const u = d?.user || d;
                if (u?.name) setName(u.name);
            } catch { /* use localStorage */ }
            finally { setLoading(false); }
        })();
    }, []);

    const saveProfile = async () => {
        if (name.trim().length < 2) { toast({ title: 'Name too short', variant: 'destructive' }); return; }
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
        } finally { setSavingProfile(false); }
    };

    const savePw = async () => {
        if (!oldPw) { toast({ title: 'Enter current password', variant: 'destructive' }); return; }
        if (newPw.length < 8) { toast({ title: 'Minimum 8 characters', variant: 'destructive' }); return; }
        if (newPw !== conPw) { toast({ title: "Passwords don't match", variant: 'destructive' }); return; }
        setSavingPw(true);
        try {
            await changePassword(oldPw, newPw);
            setOldPw(''); setNewPw(''); setConPw('');
            toast({ title: 'Password changed ✓' });
        } catch (e: any) {
            toast({ title: 'Failed', description: e?.message, variant: 'destructive' });
        } finally { setSavingPw(false); }
    };

    const deactivate = async () => {
        setDeleting(true);
        try {
            await deactivateOwnAccount();
            localStorage.removeItem('user');
            navigate('/');
        } catch (e: any) {
            toast({ title: 'Failed', description: e?.message, variant: 'destructive' });
        } finally { setDeleting(false); setDelOpen(false); }
    };

    const eye = (show: boolean, toggle: () => void) => (
        <button type="button" onClick={toggle} className="text-[#787778] hover:text-[#747781] transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    return (
        <div className="admin-page">

            {/* Hero + role/status: banner left, cards right */}
            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
                <div className="relative flex min-h-[160px] items-center overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7 lg:min-h-[180px]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/[0.07] to-transparent skew-x-[-12deg] origin-bottom-right" />

                    <div className="relative z-10 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                                Hi, {loading ? '…' : (name.split(' ')[0] || 'there')}
                            </h1>
                            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                Manage your account, password and preferences.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-white">{loading ? '…' : name}</p>
                                <p className="text-[11px] text-slate-400">{email}</p>
                            </div>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-bold text-white">
                                {loading ? '…' : getInitials(name || 'U')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col justify-between rounded-3xl border border-[#E8E8E8] bg-[#F4F4F5] p-5 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#787778]">Role</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                            <Shield className="h-4 w-4 shrink-0" />
                            {loading ? '…' : roleLabel(role)}
                        </span>
                    </div>
                    <div className="flex flex-col justify-between rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#787778]">Status</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Two-column grid ── */}
            <div className="grid grid-cols-1 items-start gap-5 px-0 py-0 lg:grid-cols-5">

                {/* LEFT col */}
                <div className="flex flex-col gap-4 lg:col-span-2">

                    {/* Account info card — text left, image as faded bg right */}
                    <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
                        {/* faded image — absolutely positioned right side */}
                        <img
                            src={accountImg}
                            alt=""
                            className="pointer-events-none absolute bottom-0 right-0 w-[130px] select-none object-contain opacity-20"
                            draggable={false}
                        />
                        {/* info rows — always on left */}
                        <div className="relative z-10 space-y-3 px-5 pb-5 pt-5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#787778]">Account Info</p>
                            <div className="flex items-center gap-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F5]">
                                    <User className="h-3 w-3 text-[#0F172A]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-[#787778]">Name</p>
                                    <p className="truncate text-xs font-bold text-[#0F172A]">{name || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F5]">
                                    <Mail className="h-3 w-3 text-[#747781]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-[#787778]">Email</p>
                                    <p className="truncate text-xs font-bold text-[#0F172A]">{email || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F5]">
                                    <Calendar className="h-3 w-3 text-[#747781]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-[#787778]">Member Since</p>
                                    <p className="text-xs font-bold text-[#0F172A]">
                                        {stored?.createdAt
                                            ? new Date(stored.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })
                                            : 'Buildora'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger zone — proper card */}
                    <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
                        <div className="px-5 pb-2 pt-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-50">
                                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                                </div>
                                <p className="text-[13px] font-bold text-[#0F172A]">Danger Zone</p>
                            </div>
                            <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3">
                                <div>
                                    <p className="text-xs font-semibold text-[#0F172A]">Deactivate Account</p>
                                    <p className="text-[11px] text-[#787778]">You'll be logged out immediately.</p>
                                </div>
                                <button
                                    onClick={() => setDelOpen(true)}
                                    className="inline-flex h-8 shrink-0 items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-100"
                                >
                                    <Trash2 className="h-3 w-3" />Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT col */}
                <div className="flex flex-col gap-4 lg:col-span-3">

                    {/* Single card: Profile Info + divider + Change Password */}
                    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

                        {/* ── Profile info section ── */}
                        <div>
                            <p className="text-[13px] font-bold text-[#0F172A]">Profile Information</p>
                            <p className="mb-3 mt-0.5 text-[11px] text-[#787778]">Update your display name</p>
                            {loading ? (
                                <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-slate-300" /></div>
                            ) : (
                                <div className="space-y-2.5">
                                    <Field label="Display Name" value={name} onChange={setName}
                                        placeholder="Your full name" icon={<User className="w-3.5 h-3.5" />} />
                                    <Field label="Email Address" value={email} disabled
                                        placeholder="email@example.com" icon={<Mail className="w-3.5 h-3.5" />}
                                        hint="Email cannot be changed here." />
                                    <div className="flex justify-end pb-1 pt-2">
                                        <button onClick={saveProfile} disabled={savingProfile}
                                            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0F172A] px-4 text-xs font-bold text-white shadow-none transition-colors hover:bg-[#1E293B] disabled:opacity-60">
                                            {savingProfile
                                                ? <><Loader2 className="h-3 w-3 animate-spin" />Saving…</>
                                                : <><CheckCircle2 className="h-3 w-3" />Save Changes</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Divider ── */}
                        <div className="mb-5 mt-6 border-t border-[#E8E8E8]" />

                        {/* ── Change password — collapsible ── */}
                        <div>
                            <button
                                onClick={() => setPwOpen(v => !v)}
                                className="group flex w-full items-center justify-between"
                            >
                                <div className="text-left">
                                    <p className="text-[13px] font-bold text-[#0F172A]">Change Password</p>
                                    <p className="mt-0.5 text-[11px] text-[#787778]">
                                        {pwOpen ? 'Fill in the fields to update your password' : 'Click to update your password'}
                                    </p>
                                </div>
                                <div className={`ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200
                                    ${pwOpen ? 'rotate-180 bg-[#F4F4F5] text-[#0F172A]' : 'bg-[#F4F4F5] text-[#787778] group-hover:bg-slate-200'}`}>
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </button>

                            {pwOpen && (
                                <div className="mt-3 space-y-2.5">
                                    <Field label="Current Password" value={oldPw} onChange={setOldPw}
                                        type={showOld ? 'text' : 'password'} placeholder="••••••••"
                                        icon={<Lock className="w-3.5 h-3.5" />} right={eye(showOld, () => setShowOld(v => !v))} />
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <Field label="New Password" value={newPw} onChange={setNewPw}
                                            type={showNew ? 'text' : 'password'} placeholder="••••••••"
                                            hint="Min 8 characters"
                                            icon={<Lock className="w-3.5 h-3.5" />} right={eye(showNew, () => setShowNew(v => !v))} />
                                        <Field label="Confirm Password" value={conPw} onChange={setConPw}
                                            type={showCon ? 'text' : 'password'} placeholder="••••••••"
                                            icon={<Lock className="w-3.5 h-3.5" />} right={eye(showCon, () => setShowCon(v => !v))} />
                                    </div>
                                    <div className="flex justify-end pt-1">
                                        <button onClick={savePw} disabled={savingPw}
                                            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0F172A] px-4 text-xs font-bold text-white shadow-none transition-colors hover:bg-[#1E293B] disabled:opacity-60">
                                            {savingPw
                                                ? <><Loader2 className="h-3 w-3 animate-spin" />Updating…</>
                                                : <><KeyRound className="h-3 w-3" />Update Password</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Deactivate confirm ── */}
            <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
                <AlertDialogContent className="rounded-3xl sm:rounded-3xl border-0 shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-500" /> Deactivate account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate your account immediately. You'll be logged out and cannot log back in.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting} className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deactivate} disabled={deleting}
                            className="rounded-xl bg-rose-600 text-white hover:bg-rose-700">
                            {deleting ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Deactivating…</> : 'Yes, Deactivate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
