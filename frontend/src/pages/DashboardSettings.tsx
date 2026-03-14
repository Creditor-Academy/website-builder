import React, { useState } from 'react';
import {
  Settings as SettingsIcon, User as UserIcon, Bell, Lock, Key, Mail, Save, XCircle, ChevronRight, LayoutGrid, AlertCircle, CheckCircle, ClipboardCheck
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

const SettingsNavItem = ({ icon, label, isActive, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 h-10 px-4 transition-all duration-200 ease-in-out ${
        isActive 
          ? 'bg-primary/5 text-primary font-semibold transform scale-[1.03]' 
          : 'text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900' 
      }`}
      onClick={onClick}
    >
      <span className={`transition-all duration-200 ease-in-out ${
        isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700' 
      }`}>{icon}</span>
      {label}
      {isActive && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
    </Button>
  );
};

export default function DashboardSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Dummy State for Settings
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [apiKey, setApiKey] = useState('sk_dummy_apikey_12345');

  const [showApiKeyConfirm, setShowApiKeyConfirm] = useState(false);

  const handleSaveChanges = (section: string) => {
    console.log(`Saving changes for ${section} section`);
    setTimeout(() => {
      toast({
        title: "Settings Updated ✅",
        description: `Your ${section} settings have been saved.`, 
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      });
    }, 500);
  };

  const handleGenerateApiKeyClick = () => {
    setShowApiKeyConfirm(true);
  };

  const confirmApiKeyGeneration = () => {
    const newKey = `sk_dummy_apikey_${Date.now()}`;
    setApiKey(newKey);
    setShowApiKeyConfirm(false);
    toast({
      title: "API Key Generated 🔑",
      description: "A new API key has been generated and the old one invalidated.",
      variant: "default",
      icon: <Key className="h-5 w-5 text-indigo-500" />,
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied 📋",
      description: "API Key copied to clipboard.",
      icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2"><UserIcon className="w-5 h-5" /> Profile Information</CardTitle>
                <CardDescription>Update your account's profile information and email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="mt-1" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveChanges('profile')}><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2"><Lock className="w-5 h-5" /> Update Password</CardTitle>
                <CardDescription>Ensure your account's using a long, random password to stay secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveChanges('password')}><Save className="w-4 h-4 mr-2" /> Save Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2"><Key className="w-5 h-5" /> Two-Factor Authentication</CardTitle>
                <CardDescription>Add additional security to your account using two-factor authentication.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-slate-500">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={(checked) => {
                  setTwoFactorEnabled(checked);
                  toast({
                    title: "Two-Factor Authentication 🔐",
                    description: `Two-factor authentication has been ${checked ? 'enabled' : 'disabled'}.`,
                    icon: <Lock className="h-5 w-5 text-slate-500" />,
                  });
                }} />
              </CardContent>
            </Card>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2"><Bell className="w-5 h-5" /> Email Notifications</CardTitle>
                <CardDescription>Manage your email notification preferences.</CardDescription>
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
                  <Button onClick={() => handleSaveChanges('notifications')}><Save className="w-4 h-4 mr-2" /> Save Notifications</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2"><LayoutGrid className="w-5 h-5" /> API Integrations</CardTitle>
                <CardDescription>Manage your API keys for third-party integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2 mt-1">
                    <Input id="apiKey" type="text" value={apiKey} readOnly className="flex-1" />
                    <Button variant="outline" onClick={handleCopyApiKey}>Copy</Button>
                    <Button variant="secondary" onClick={handleGenerateApiKeyClick}>Generate New</Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveChanges('integrations')}><Save className="w-4 h-4 mr-2" /> Save Integrations</Button>
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
    <div className="p-4 md:p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-slate-200 min-h-[calc(100vh-100px)]">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <SettingsIcon className="w-7 h-7 text-primary" /> Settings
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <aside className="lg:w-1/4 xl:w-1/5 space-y-2">
          <SettingsNavItem 
            icon={<UserIcon className="w-5 h-5" />} 
            label="Profile" 
            isActive={activeSection === 'profile'}
            onClick={() => setActiveSection('profile')}
          />
          <SettingsNavItem 
            icon={<Lock className="w-5 h-5" />} 
            label="Account" 
            isActive={activeSection === 'account'}
            onClick={() => setActiveSection('account')}
          />
          <SettingsNavItem 
            icon={<Bell className="w-5 h-5" />} 
            label="Notifications" 
            isActive={activeSection === 'notifications'}
            onClick={() => setActiveSection('notifications')}
          />
          <SettingsNavItem 
            icon={<Key className="w-5 h-5" />} 
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

      {/* API Key Generation Confirmation Dialog */}
      <AlertDialog open={showApiKeyConfirm} onOpenChange={setShowApiKeyConfirm}>
        <AlertDialogContent className="w-[90%] rounded-lg sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> Confirm API Key Generation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to generate a new API key? This will invalidate your current API key and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApiKeyGeneration}>Generate New Key</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
