import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UserCircle, Bell, Puzzle, Lock, Mail, Eye, EyeOff,
    Loader2, CheckCircle2, ChevronDown, Save,
    Smartphone, Volume2, Zap, Shield,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getProfile, updateUserProfile, changePassword } from '@/api/user';
import Loading from '@/components/Common/LoadingUI';

// ── Reusable field ─────────────────────────────────────────────────────────
function Field({ label, value, onChange, disabled, type = 'text', placeholder, hint, icon, right }: {
    label: string; value: string; onChange?: (v: string) => void;
    disabled?: boolean; type?: string; placeholder?: string; hint?: string;
    icon?: React.ReactNode; right?: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</span>}
                <Input type={type} value={value} onChange={e => onChange?.(e.target.value)}
                    disabled={disabled} placeholder={placeholder}
                    className={cn(
                        'h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium',
                        'focus-visible:ring-2 focus-visible:ring-purple-400/30 focus:border-purple-400 focus:bg-white transition-all',
                        icon && 'pl-10', right && 'pr-11',
                        disabled && 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-100',
                    )}
                />
                {right && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</span>}
            </div>
            {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
        </div>
    );
}

// ── Toggle row ─────────────────────────────────────────────────────────────
function ToggleRow({ icon, title, subtitle, checked, onChange, accent = 'purple' }: {
    icon: React.ReactNode; title: string; subtitle: string;
    checked: boolean; onChange: (v: boolean) => void; accent?: string;
}) {
    const accentMap: Record<string, string> = {
        purple: 'bg-purple-50 text-purple-500',
        blue: 'bg-blue-50 text-blue-500',
        emerald: 'bg-emerald-50 text-emerald-500',
    };
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/60 hover:bg-slate-50 border border-slate-100 transition-all">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', accentMap[accent] ?? accentMap.purple)}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    );
}

// ── Save button ────────────────────────────────────────────────────────────
function SaveBtn({ onClick, loading, label = 'Save Changes' }: { onClick: () => void; loading: boolean; label?: string }) {
    return (
        <button onClick={onClick} disabled={loading}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-purple-300/30 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><CheckCircle2 className="w-4 h-4" />{label}</>}
        </button>
    );
}

// ── Main ───────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'profile', label: 'Profile', icon: <UserCircle className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Puzzle className="w-4 h-4" /> },
];

export default function DashboardSettings() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [tab, setTab] = useState('profile');

    // Profile
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [loadingP, setLoadingP] = useState(true);
    const [savingP, setSavingP] = useState(false);

    // Password collapsible
    const [pwOpen, setPwOpen] = useState(false);
    const [curPw, setCurPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [conPw, setConPw] = useState('');
    const [showCur, setShowCur] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showCon, setShowCon] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    // Notifications
    const [emailN, setEmailN] = useState(() => { try { return JSON.parse(localStorage.getItem('pref_emailNotifications') ?? 'true'); } catch { return true; } });
    const [smsN, setSmsN] = useState(() => { try { return JSON.parse(localStorage.getItem('pref_smsNotifications') ?? 'false'); } catch { return false; } });
    const [savingN, setSavingN] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const d = await getProfile();
                const u = d?.user || d;
                setProfileName(u?.name || '');
                setProfileEmail(u?.email || '');
            } catch { /* silent */ }
            finally { setLoadingP(false); }
        })();
    }, []);

    const saveProfile = async () => {
        if (profileName.trim().length < 2) { toast({ title: 'Name too short', variant: 'destructive' }); return; }
        setSavingP(true);
        try {
            await updateUserProfile(profileName.trim());
            const stored = JSON.parse(localStorage.getItem('user') || 'null');
            if (stored) {
                localStorage.setItem('user', JSON.stringify({ ...stored, name: profileName.trim() }));
                window.dispatchEvent(new CustomEvent('userUpdated', { detail: { name: profileName.trim() } }));
            }
            toast({ title: 'Profile saved ✓' });
        } catch (e: any) { toast({ title: 'Failed', description: e?.message, variant: 'destructive' }); }
        finally { setSavingP(false); }
    };

    const savePw = async () => {
        if (!curPw) { toast({ title: 'Current password required', variant: 'destructive' }); return; }
        if (newPw.length < 8) { toast({ title: 'Min 8 characters', variant: 'destructive' }); return; }
        if (newPw !== conPw) { toast({ title: "Passwords don't match", variant: 'destructive' }); return; }
        setSavingPw(true);
        try {
            await changePassword(curPw, newPw);
            setCurPw(''); setNewPw(''); setConPw(''); setPwOpen(false);
            toast({ title: 'Password changed ✓' });
        } catch (e: any) { toast({ title: 'Failed', description: e?.message, variant: 'destructive' }); }
        finally { setSavingPw(false); }
    };

    const saveNotif = () => {
        localStorage.setItem('pref_emailNotifications', JSON.stringify(emailN));
        localStorage.setItem('pref_smsNotifications', JSON.stringify(smsN));
        toast({ title: 'Preferences saved ✓' });
    };

    const eye = (show: boolean, toggle: () => void) => (
        <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    return (
        <div className="bg-dashboard min-h-full">

            {/* ── Banner ── */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#e8e4f9] via-[#ede8fb] to-[#dde8fb] px-8 py-7">
                <div className="absolute top-3 right-60 w-4 h-4 rounded-full bg-purple-300/50 pointer-events-none" />
                <div className="absolute top-9 right-40 w-2.5 h-2.5 rounded-full bg-blue-300/40 pointer-events-none" />
                <div className="absolute bottom-3 right-52 w-3 h-3 rounded-full bg-indigo-300/30 pointer-events-none" />
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5">
                    <button onClick={() => navigate('/dashboard')} className="hover:text-purple-600 transition-colors">Dashboard</button>
                    <span className="mx-1.5 text-purple-300">/</span>
                    <span className="text-purple-600">Settings</span>
                </p>
                <h1 className="text-2xl font-black text-slate-800">Settings</h1>
                <p className="text-slate-500 text-xs font-medium mt-0.5">Manage your account settings and preferences.</p>
            </div>

            {/* ── Tab bar ── */}
            <div className="px-6 pt-5">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 inline-flex gap-1">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                'flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                                tab === t.id
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-300/40'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            )}
                        >
                            <span className={tab === t.id ? 'text-white' : 'text-slate-400'}>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="px-6 py-5 max-w-2xl">

                {/* ── Profile tab ── */}
                {tab === 'profile' && (
                    <div className="space-y-4">
                        {/* Profile info card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <UserCircle className="w-4 h-4 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Profile Information</p>
                                    <p className="text-[11px] text-slate-400">Update your display name and email</p>
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                {loadingP ? (
                                    <Loading label="Loading profile" />
                                ) : (
                                    <div className="space-y-4">
                                        <Field label="Display Name" value={profileName} onChange={setProfileName}
                                            placeholder="Your full name" icon={<UserCircle className="w-4 h-4" />} />
                                        <Field label="Email Address" value={profileEmail} disabled
                                            placeholder="email@example.com" icon={<Mail className="w-4 h-4" />}
                                            hint="Email cannot be changed here." />
                                        <div className="flex justify-end pt-1">
                                            <SaveBtn onClick={saveProfile} loading={savingP} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Change password card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setPwOpen(v => !v)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-800">Change Password</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {pwOpen ? 'Fill in fields to update your password' : 'Click to update your password'}
                                        </p>
                                    </div>
                                </div>
                                <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0',
                                    pwOpen ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-slate-100 text-slate-400')}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            {pwOpen && (
                                <div className="px-6 pb-5 space-y-4 border-t border-slate-50 pt-4">
                                    <Field label="Current Password" value={curPw} onChange={setCurPw}
                                        type={showCur ? 'text' : 'password'} placeholder="••••••••"
                                        icon={<Lock className="w-4 h-4" />} right={eye(showCur, () => setShowCur(v => !v))} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="New Password" value={newPw} onChange={setNewPw}
                                            type={showNew ? 'text' : 'password'} placeholder="••••••••" hint="Min 8 characters"
                                            icon={<Lock className="w-4 h-4" />} right={eye(showNew, () => setShowNew(v => !v))} />
                                        <Field label="Confirm Password" value={conPw} onChange={setConPw}
                                            type={showCon ? 'text' : 'password'} placeholder="••••••••"
                                            icon={<Lock className="w-4 h-4" />} right={eye(showCon, () => setShowCon(v => !v))} />
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={savePw} disabled={savingPw}
                                            className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold shadow-sm active:scale-[0.98] transition-all disabled:opacity-60">
                                            {savingPw ? <><Loader2 className="w-4 h-4 animate-spin" />Updating…</> : <><Lock className="w-4 h-4" />Update Password</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Notifications tab ── */}
                {tab === 'notifications' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Notification Preferences</p>
                                <p className="text-[11px] text-slate-400">Control what notifications you receive</p>
                            </div>
                        </div>
                        <div className="px-6 py-5 space-y-3">
                            <ToggleRow
                                icon={<Mail className="w-4 h-4" />}
                                title="Email Notifications"
                                subtitle="Receive product updates and news via email"
                                checked={emailN} onChange={setEmailN} accent="purple"
                            />
                            <ToggleRow
                                icon={<Smartphone className="w-4 h-4" />}
                                title="SMS Notifications"
                                subtitle="Get important alerts sent to your phone"
                                checked={smsN} onChange={setSmsN} accent="blue"
                            />
                            <div className="flex justify-end pt-2">
                                <SaveBtn onClick={saveNotif} loading={savingN} label="Save Preferences" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Integrations tab ── */}
                {tab === 'integrations' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Puzzle className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">API & Integrations</p>
                                <p className="text-[11px] text-slate-400">Connect third-party tools and manage API keys</p>
                            </div>
                        </div>
                        <div className="px-6 py-12 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                                <Zap className="w-7 h-7 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">Coming Soon</p>
                                <p className="text-[12px] text-slate-400 mt-1 max-w-xs">
                                    API key management and third-party integrations will be available in a future update.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-full">
                                <Shield className="w-3 h-3" /> Secured & Coming Soon
                            </span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
