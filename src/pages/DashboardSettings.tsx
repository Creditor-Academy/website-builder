import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, User as UserIcon, Bell, Lock, Key, Mail, Save, XCircle, ChevronRight, LayoutGrid, AlertCircle, CheckCircle, ClipboardCheck, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GradientButton from '@/components/ui/GradientButton';
import { getProfile, updateUserProfile, changePassword } from '@/api/user';

const SettingsNavItem = ({ icon, label, isActive, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 h-11 px-6 text-base 
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 rounded-full' 
          : 'bg-white text-slate-700 font-medium rounded-full border border-slate-300 shadow-sm hover:bg-slate-100 hover:text-indigo-700 hover:border-indigo-500 hover:border-2 transition-all duration-300 ease-in-out' 
        } transition-all duration-300 ease-in-out`}
      onClick={onClick}
    >
      <span className={`transition-all duration-300 ease-in-out ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-700'}`}>{icon}</span>
      {label}
      {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white" />}
    </Button>
  );
};

export default function DashboardSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Profile state — loaded from API
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Notification preferences (stored in localStorage until backend supports it)
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('pref_emailNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [smsNotifications, setSmsNotifications] = useState(() => {
    const saved = localStorage.getItem('pref_smsNotifications');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfileName(data.user?.name || '');
        setProfileEmail(data.user?.email || '');
      } catch {
        toast({ title: 'Failed to load profile', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaveProfile = async () => {
    if (!profileName.trim() || profileName.trim().length < 2) {
      toast({ title: 'Name must be at least 2 characters', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile(profileName.trim());
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved.',
        variant: 'themed',
        icon: <CheckCircle className="h-5 w-5 text-white" />,
      });
    } catch (err: any) {
      toast({ title: err?.message || 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast({ title: 'Current password is required', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: 'New password must be at least 8 characters', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast({
        title: 'Password Changed',
        description: 'Your password has been updated successfully.',
        variant: 'themed',
        icon: <Lock className="h-5 w-5 text-white" />,
      });
    } catch (err: any) {
      toast({ title: err?.message || 'Failed to change password', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('pref_emailNotifications', JSON.stringify(emailNotifications));
    localStorage.setItem('pref_smsNotifications', JSON.stringify(smsNotifications));
    toast({
      title: 'Notification Preferences Saved',
      variant: 'themed',
      icon: <CheckCircle className="h-5 w-5 text-white" />,
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <Card className="rounded-xl border border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2"><UserIcon className="w-5 h-5 text-slate-600" /> Profile Information</CardTitle>
                <CardDescription className="text-slate-500">Update your account's profile information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : (
                  <>
                <div>
                  <Label htmlFor="name" className="mb-1 font-medium text-slate-700">Name</Label>
                  <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1 pl-4 pr-4 w-full h-11 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/40 focus:outline-none transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1 font-medium text-slate-700">Email</Label>
                  <Input id="email" type="email" value={profileEmail} disabled className="mt-1 pl-4 pr-4 w-full h-11 rounded-full bg-slate-50 border-slate-200 shadow-md shadow-slate-200/50 text-slate-500 cursor-not-allowed" />
                  <p className="text-xs text-slate-400 mt-1 ml-1">Email cannot be changed.</p>
                </div>
                <div className="flex justify-end">
                  <GradientButton onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Profile
                  </GradientButton>
                </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-6">
            <Card className="rounded-xl border border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2"><Lock className="w-5 h-5 text-slate-600" /> Update Password</CardTitle>
                <CardDescription className="text-slate-500">Ensure your account's using a long, random password to stay secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="mb-1 font-medium text-slate-700">Current Password</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 pl-4 pr-4 w-full h-11 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/40 focus:outline-none transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="mb-1 font-medium text-slate-700">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 pl-4 pr-4 w-full h-11 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/40 focus:outline-none transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="confirmNewPassword" className="mb-1 font-medium text-slate-700">Confirm New Password</Label>
                  <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 pl-4 pr-4 w-full h-11 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/40 focus:outline-none transition-all duration-300" />
                </div>
                <div className="flex justify-end">
                  <GradientButton onClick={handleChangePassword} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Password
                  </GradientButton>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <Card className="rounded-xl border border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2"><Bell className="w-5 h-5 text-slate-600" /> Email Notifications</CardTitle>
                <CardDescription className="text-slate-500">Manage your email notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-slate-500">Receive updates about new features and products.</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-slate-500">Receive important alerts via SMS.</p>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
                <div className="flex justify-end">
                  <GradientButton onClick={handleSaveNotifications}><Save className="w-4 h-4 mr-2" /> Save Notifications</GradientButton>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            <Card className="rounded-xl border border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-slate-600" /> API Integrations</CardTitle>
                <CardDescription className="text-slate-500">API key management and third-party integrations coming soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <Key className="w-12 h-12 opacity-30" />
                  <p className="text-sm font-medium">API keys and integrations will be available in a future update.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <p className="text-slate-600">Select a settings category.</p>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6">
      <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumbs */}
      <div className="mb-4 text-xs whitespace-nowrap flex items-center flex-shrink-0">
        <span className="flex items-center whitespace-nowrap flex-shrink-0 min-w-[160px]">
          <a href="/dashboard" className="hover:underline text-slate-500">Dashboard</a>&nbsp;/&nbsp;<span className="font-semibold text-slate-700 flex items-center gap-1"><SettingsIcon className="w-4 h-4" /> Settings</span>
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
          <p className="text-slate-500 mt-1">Manage your account settings, preferences and integrations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <aside className="lg:w-1/4 xl:w-1/5 space-y-2">
          <SettingsNavItem
            icon={<UserIcon className="w-5 h-5 text-slate-600" />}
            label="Profile"
            isActive={activeSection === 'profile'}
            onClick={() => setActiveSection('profile')}
          />
          <SettingsNavItem
            icon={<Lock className="w-5 h-5 text-slate-600" />}
            label="Account"
            isActive={activeSection === 'account'}
            onClick={() => setActiveSection('account')}
          />
          <SettingsNavItem
            icon={<Bell className="w-5 h-5 text-slate-600" />}
            label="Notifications"
            isActive={activeSection === 'notifications'}
            onClick={() => setActiveSection('notifications')}
          />
          <SettingsNavItem
            icon={<Key className="w-5 h-5 text-slate-600" />}
            label="Integrations"
            isActive={activeSection === 'integrations'}
            onClick={() => setActiveSection('integrations')}
          />
        </aside>

        {/* Settings Content Area */}
        <div className="lg:flex-1">
          {renderSection()}
        </div>
      </div>
    </Card>
  </div>
  );
}
