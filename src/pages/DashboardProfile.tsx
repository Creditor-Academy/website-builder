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
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</span>}
                <Input
                    type={type} value={value}
                    onChange={e => onChange?.(e.target.value)}
                    disabled={disabled} placeholder={placeholder}
                    className={cn(
                        'h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium',
                        'focus-visible:ring-2 focus-visible:ring-purple-400/30 focus:border-purple-400 focus:bg-white transition-all',
                        icon && 'pl-9', right && 'pr-10',
                        disabled && 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-100',
                    )}
                />
                {right && <span className="absolute right-3 top-1/2 -translate-y-1/2">{right}</span>}
            </div>
            {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
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
        <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    return (
        <div className="bg-[#f7f7fb] min-h-full">

            {/* ── Banner ── */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#e8e4f9] via-[#ede8fb] to-[#dde8fb] px-8 py-7 flex items-center justify-between">
                <div className="absolute top-3 right-60 w-4 h-4 rounded-full bg-purple-300/50 pointer-events-none" />
                <div className="absolute top-9 right-40 w-2.5 h-2.5 rounded-full bg-blue-300/40 pointer-events-none" />
                <div className="absolute bottom-3 right-52 w-3 h-3 rounded-full bg-indigo-300/30 pointer-events-none" />
                <div>
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5">
                        <button onClick={() => navigate('/dashboard')} className="hover:text-purple-600 transition-colors">Dashboard</button>
                        <span className="mx-1.5 text-purple-300">/</span>
                        <span className="text-purple-600">Profile</span>
                    </p>
                    <h1 className="text-2xl font-black text-slate-800">
                        Hi, {loading ? '…' : (name.split(' ')[0] || 'there')} 👋
                    </h1>
                    <p className="text-slate-500 text-xs font-medium mt-0.5">
                        Manage your account, password and preferences.
                    </p>
                </div>
                {/* Avatar */}
                <div className="shrink-0 flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-700">{name}</p>
                        <p className="text-[11px] text-slate-400">{email}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-purple-300/40 border-4 border-white/80">
                        {loading ? '…' : getInitials(name || 'U')}
                    </div>
                </div>
            </div>

            {/* ── Two-column grid ── */}
            <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

                {/* LEFT col */}
                <div className="lg:col-span-2 flex flex-col gap-4">

                    {/* Role + Status pills */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-purple-50 rounded-2xl px-4 py-3 border border-purple-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                            <span className="inline-flex items-center gap-1 text-xs font-black text-purple-700">
                                <Shield className="w-3 h-3" />{roleLabel(role)}
                            </span>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active
                            </span>
                        </div>
                    </div>

                    {/* Account info card — text left, image as faded bg right */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
                        {/* faded image — absolutely positioned right side */}
                        <img
                            src={accountImg}
                            alt=""
                            className="absolute right-0 bottom-0 w-[130px] object-contain select-none pointer-events-none opacity-20"
                            draggable={false}
                        />
                        {/* info rows — always on left */}
                        <div className="relative z-10 px-5 pt-5 pb-5 space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Info</p>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                    <User className="w-3 h-3 text-purple-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-semibold">Name</p>
                                    <p className="text-xs font-bold text-slate-800 truncate">{name || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <Mail className="w-3 h-3 text-blue-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-semibold">Email</p>
                                    <p className="text-xs font-bold text-slate-800 truncate">{email || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                    <Calendar className="w-3 h-3 text-indigo-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-semibold">Member Since</p>
                                    <p className="text-xs font-bold text-slate-800">
                                        {stored?.createdAt
                                            ? new Date(stored.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })
                                            : 'Buildora'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger zone — proper card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 pt-4 pb-2">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                </div>
                                <p className="text-[13px] font-bold text-slate-800">Danger Zone</p>
                            </div>
                            <div className="flex items-center justify-between gap-3 bg-rose-50/60 border border-rose-100 rounded-xl px-4 py-3 mb-3">
                                <div>
                                    <p className="text-xs font-semibold text-slate-700">Deactivate Account</p>
                                    <p className="text-[11px] text-slate-400">You'll be logged out immediately.</p>
                                </div>
                                <button
                                    onClick={() => setDelOpen(true)}
                                    className="shrink-0 inline-flex items-center gap-1 h-8 px-3 rounded-xl border border-rose-200 bg-white text-rose-600 text-[11px] font-bold hover:bg-rose-100 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT col */}
                <div className="lg:col-span-3 flex flex-col gap-4">

                    {/* Single card: Profile Info + divider + Change Password */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                        {/* ── Profile info section ── */}
                        <div>
                            <p className="text-[13px] font-bold text-slate-800">Profile Information</p>
                            <p className="text-[11px] text-slate-400 mb-3 mt-0.5">Update your display name</p>
                            {loading ? (
                                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-300" /></div>
                            ) : (
                                <div className="space-y-2.5">
                                    <Field label="Display Name" value={name} onChange={setName}
                                        placeholder="Your full name" icon={<User className="w-3.5 h-3.5" />} />
                                    <Field label="Email Address" value={email} disabled
                                        placeholder="email@example.com" icon={<Mail className="w-3.5 h-3.5" />}
                                        hint="Email cannot be changed here." />
                                    <div className="flex justify-end pt-2 pb-1">
                                        <button onClick={saveProfile} disabled={savingProfile}
                                            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-300/30 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
                                            {savingProfile
                                                ? <><Loader2 className="w-3 h-3 animate-spin" />Saving…</>
                                                : <><CheckCircle2 className="w-3 h-3" />Save Changes</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Divider ── */}
                        <div className="border-t border-slate-100 mt-6 mb-5" />

                        {/* ── Change password — collapsible ── */}
                        <div>
                            <button
                                onClick={() => setPwOpen(v => !v)}
                                className="w-full flex items-center justify-between group"
                            >
                                <div className="text-left">
                                    <p className="text-[13px] font-bold text-slate-800">Change Password</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {pwOpen ? 'Fill in the fields to update your password' : 'Click to update your password'}
                                    </p>
                                </div>
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ml-3
                                    ${pwOpen ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                    <ChevronDown className="w-4 h-4" />
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
                                            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-sm active:scale-[0.98] transition-all disabled:opacity-60">
                                            {savingPw
                                                ? <><Loader2 className="w-3 h-3 animate-spin" />Updating…</>
                                                : <><KeyRound className="w-3 h-3" />Update Password</>}
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
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" /> Deactivate account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate your account immediately. You'll be logged out and cannot log back in.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deactivate} disabled={deleting}
                            className="bg-rose-600 hover:bg-rose-700 text-white">
                            {deleting ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Deactivating…</> : 'Yes, Deactivate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
