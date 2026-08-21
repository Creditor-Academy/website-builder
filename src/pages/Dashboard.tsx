import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '@/layouts/DashboardLayout';
import { Users, Zap, Trash2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import { DashboardStatCard } from '@/components/dashboard/DashboardCard';
import { updateUserProfile, deactivateOwnAccount } from "../api/user";
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';


// OverviewCard component
const OverviewCard = ({ title, value, icon, description, iconBgClass, iconColorClass }) => (
    <DashboardStatCard className="hover:shadow-lg transition-all duration-300 group/overview-card">
        <div className="flex flex-row items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#45464d]">{title}</p>
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border border-[#c6c6cd] bg-[#f6f3f5] group-hover/overview-card:scale-105 transition-transform", iconBgClass, iconColorClass)}>{icon}</div>
        </div>
        <div className="text-3xl font-bold text-[#000000]">{value}</div>
        {description && <p className="text-xs text-[#76777d] mt-2">{description}</p>}
    </DashboardStatCard>
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

// ─── Dashboard ────────────────────────────────────────────────────────────────
// Thin switcher: renders the user or admin dashboard based on the mode
// shared by DashboardLayout via Outlet context.

const Dashboard = () => {
    const { isAdmin } = useOutletContext<DashboardOutletContext>();
    return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export { SettingsView, OverviewCard };
export default Dashboard;



