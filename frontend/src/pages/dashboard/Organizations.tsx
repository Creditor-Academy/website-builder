import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, Edit, Trash2, 
  MoreVertical, CheckCircle, AlertCircle, 
  XCircle, Users, Globe, Mail, 
  CalendarDays, ListFilter, FileText, BarChart3, TrendingUp, ShieldCheck, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import useBuilderStore from '@/store/useBuilderStore';
import institutionApi from '@/api/institution';
import GradientButton from '@/components/ui/GradientButton';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createUser } from '../../api/user';

interface Institution {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  users?: any[];
  websites?: any[];
  _count?: {
    users: number;
    websites: number;
  };
}

interface NewOrgForm {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const Organizations = () => {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrgForView, setSelectedOrgForView] = useState<Institution | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newOrg, setNewOrg] = useState<NewOrgForm>({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const res = await institutionApi.getDetailedList();
      setInstitutions(res.data.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!newOrg.name.trim()) errors.name = 'Organization name is required';
    if (!newOrg.email.trim() || !/\S+@\S+\.\S+/.test(newOrg.email)) errors.email = 'Valid email is required';
    if (!newOrg.password || newOrg.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const setField = (field: keyof NewOrgForm, value: string) => {
    setNewOrg(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);

      // ── Step 1: Create the institution (only name + email — no password field) ──
      let createdOrg: any = null;
      try {
        const orgRes = await institutionApi.create({
          name: newOrg.name.trim(),
          email: newOrg.email.trim(),
        });
        // Handle any response shape: { data: { id } } / { data: { data: { id } } } / { id }
        createdOrg =
          orgRes.data?.data?.id ? orgRes.data.data :
          orgRes.data?.id       ? orgRes.data      :
          null;

        console.log('[Org created]', createdOrg);
      } catch (orgErr: any) {
        const msg =
          orgErr?.response?.data?.message ||
          orgErr?.response?.data?.error ||
          `Organization creation failed (${orgErr?.response?.status ?? 'network error'})`;
        toast({ title: "Org creation failed", description: msg, variant: "destructive" });
        return;
      }

      if (!createdOrg?.id) {
        toast({
          title: "Org creation failed",
          description: "Server did not return an organization ID. Check your backend response shape.",
          variant: "destructive",
        });
        return;
      }

      // ── Step 2: Create the Institution Admin user linked to this org ──
      try {
        await createUser({
          name: `${newOrg.name.trim()} Admin`,
          email: newOrg.email.trim(),
          password: newOrg.password,
          role: 'INSTITUTION_ADMIN',
          institution_id: createdOrg.id,
        });
        console.log('[Admin user created for org]', createdOrg.id);
      } catch (userErr: any) {
        // Org was created — warn but don't block success
        const msg =
          userErr?.response?.data?.message ||
          userErr?.response?.data?.error ||
          `Admin user creation failed (${userErr?.response?.status ?? 'network error'})`;
        toast({
          title: "Organization created, but admin user failed",
          description: msg + " — you can add a user manually from the Users page.",
          variant: "destructive",
        });
        fetchInstitutions();
        setIsAddModalOpen(false);
        setNewOrg({ name: '', email: '', password: '' });
        setFormErrors({});
        return;
      }

      toast({
        title: "Organization created ✅",
        description: `${newOrg.name} has been added and an Institution Admin account was created.`,
      });

      setIsAddModalOpen(false);
      setNewOrg({ name: '', email: '', password: '' });
      setFormErrors({});
      fetchInstitutions();
    } catch (err: any) {
      console.error('[handleCreateOrg unexpected error]', err);
      toast({
        title: "Unexpected error",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!isSubmitting) {
      setIsAddModalOpen(open);
      if (!open) {
        setNewOrg({ name: '', email: '', password: '' });
        setFormErrors({});
        setShowPassword(false);
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await institutionApi.update(id, { status });
      toast({
        title: "Success",
        description: `Organization ${status.toLowerCase()} successfully`,
      });
      fetchInstitutions();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;
    try {
      await institutionApi.delete(id);
      toast({
        title: "Deleted",
        description: "Organization removed successfully",
      });
      fetchInstitutions();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  const filteredOrgs = institutions.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    org.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600" />
            Organizations
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage platform tenants, branding, and global intelligence.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={handleModalClose}>
          <DialogTrigger asChild>
            <GradientButton 
              className="flex items-center gap-2 px-6 py-6 h-auto shadow-lg shadow-indigo-200"
            >
              <Plus className="w-5 h-5" />
              Add Organization
            </GradientButton>
          </DialogTrigger>

          {/* ─── Add Organization Dialog ─────────────────────────────────── */}
          <DialogContent className="sm:max-w-lg rounded-[2rem] p-0 overflow-hidden bg-white border-slate-100 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-7">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-black text-white">New Organization</DialogTitle>
              <DialogDescription className="text-white/70 mt-1 text-sm">
                Create a new tenant. An Institution Admin account will be created automatically.
              </DialogDescription>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOrg}>
              <div className="px-8 py-6 space-y-4">

                {/* Organization Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Organization Name *
                  </label>
                  <Input
                    placeholder="e.g. Buildora Global"
                    value={newOrg.name}
                    onChange={e => setField('name', e.target.value)}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
                      formErrors.name && "border-rose-400 bg-rose-50"
                    )}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-500 font-medium">{formErrors.name}</p>
                  )}
                </div>

                {/* Admin Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@organization.com"
                    value={newOrg.email}
                    onChange={e => setField('email', e.target.value)}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
                      formErrors.email && "border-rose-400 bg-rose-50"
                    )}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-500 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* Admin Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={newOrg.password}
                      onChange={e => setField('password', e.target.value)}
                      disabled={isSubmitting}
                      className={cn(
                        "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all pr-12",
                        formErrors.password && "border-rose-400 bg-rose-50"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-xs text-rose-500 font-medium">{formErrors.password}</p>
                  )}
                  <p className="text-[11px] text-slate-400 font-medium">
                    This password will be used for the Institution Admin account linked to this organization.
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="px-8 pb-8 flex gap-3 justify-end border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleModalClose(false)}
                  disabled={isSubmitting}
                  className="rounded-xl h-11 px-6 border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl h-11 px-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all font-bold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Create Organization
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top duration-700">
        <Card className="rounded-2xl border-none shadow-lg shadow-slate-200/50 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white overflow-hidden relative group">
          <CardHeader className="pb-2">
             <CardTitle className="text-indigo-100/60 text-[10px] font-black uppercase tracking-[0.2em]">Platform Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mb-1">{institutions.length}</div>
            <p className="text-indigo-100/80 text-xs font-bold flex items-center gap-1">
              Active Organizations
            </p>
            <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-lg shadow-slate-200/50 bg-white overflow-hidden relative group border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">User Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900 mb-1">
              {institutions.reduce((acc, org) => acc + (org._count?.users || 0), 0)}
            </div>
            <p className="text-indigo-500 text-xs font-black flex items-center gap-1">
              Platform Users
            </p>
            <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-lg shadow-slate-200/50 bg-white overflow-hidden relative group border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Digital Footprint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900 mb-1">
              {institutions.reduce((acc, org) => acc + (org._count?.websites || 0), 0)}
            </div>
            <p className="text-blue-500 text-xs font-black flex items-center gap-1">
              Live Websites
            </p>
            <Globe className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-lg shadow-slate-200/50 bg-white overflow-hidden relative group border border-slate-100 border-l-4 border-amber-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900 mb-1">
              {institutions.filter(o => o.status === 'PENDING').length}
            </div>
            <p className="text-amber-500 text-xs font-black flex items-center gap-1">
              Pending Approvals
            </p>
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden p-0 border-none rounded-3xl shadow-2xl flex flex-col">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white relative shrink-0">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-3xl font-black flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-2xl">
                  <Building2 className="w-8 h-8 text-white/40" />
                </div>
                {selectedOrgForView?.name}
              </DialogTitle>
              <DialogDescription className="text-indigo-100 mt-2 text-lg opacity-80 font-medium">
                Organization Intelligence Report
              </DialogDescription>
            </DialogHeader>
            <Building2 className="absolute right-4 bottom-4 w-32 h-32 text-white/5 pointer-events-none" />
          </div>
          
          <div className="p-8 space-y-8 bg-slate-50 overflow-y-auto grow no-scrollbar">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Users className="w-6 h-6" /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Team Members</div>
                    <div className="text-2xl font-black text-slate-800 leading-none">{selectedOrgForView?.users?.length || 0}</div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Globe className="w-6 h-6" /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Digital Assets</div>
                    <div className="text-2xl font-black text-slate-800 leading-none">{selectedOrgForView?.websites?.length || 0}</div>
                  </div>
               </div>
            </div>

            <section>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-4 px-1">
                <Users className="w-6 h-6 text-indigo-600" />
                Member Hierarchy
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="font-bold py-4">Identity</TableHead>
                      <TableHead className="font-bold py-4 text-right">Access Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrgForView?.users?.map((user: any) => (
                      <TableRow key={user.id} className="border-slate-50 group hover:bg-slate-50/30">
                        <TableCell className="py-4">
                          <div className="font-bold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500 font-medium">{user.email}</div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Badge variant="outline" className="capitalize font-bold bg-slate-50 text-slate-600 py-1 px-3 border-none group-hover:bg-white transition-colors">
                            {user.role.toLowerCase().replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!selectedOrgForView?.users || selectedOrgForView.users.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-12 text-slate-400 font-medium">No team members identified</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-4 px-1">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Digital Assets
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {selectedOrgForView?.websites?.map((site: any) => (
                  <div key={site.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {site.name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <p className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{site.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Indexed on {new Date(site.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <Badge className={cn(
                      "capitalize rounded-full font-bold text-[10px] py-1 px-3 border-none",
                      site.status === 'PUBLISHED' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {site.status.toLowerCase()}
                    </Badge>
                  </div>
                ))}
                {(!selectedOrgForView?.websites || selectedOrgForView.websites.length === 0) && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium italic">No digital assets recorded</div>
                )}
              </div>
            </section>
          </div>
          <DialogFooter className="bg-white p-6 border-t border-slate-100 shrink-0 gap-3 flex-row justify-end items-center">
            <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-100" onClick={() => setIsViewModalOpen(false)}>Close Report</Button>
            <GradientButton className="h-12 px-8 rounded-xl shadow-lg shadow-indigo-100" onClick={() => navigate(`/dashboard/websites?org=${selectedOrgForView?.id}`)}>
              Manage Organization Property
            </GradientButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="rounded-2xl border-none shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search organizations..." 
                className="pl-10 h-10 bg-slate-50/50 border-slate-100 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-slate-600 border-slate-200">
                <ListFilter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="font-semibold text-slate-700">Organization</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Users</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Websites</TableHead>
                <TableHead className="font-semibold text-slate-700">Created</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-10 w-48 bg-slate-100 rounded" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-slate-100 rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-10 bg-slate-100 rounded mx-auto" /></TableCell>
                    <TableCell><div className="h-6 w-10 bg-slate-100 rounded mx-auto" /></TableCell>
                    <TableCell><div className="h-6 w-32 bg-slate-100 rounded" /></TableCell>
                    <TableCell><div className="h-10 w-10 bg-slate-100 rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Building2 className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No organizations found</p>
                      <p className="text-sm">Try searching for a different name or add a new one.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          {org.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{org.name}</div>
                          <div className="text-xs text-slate-500 font-medium">{org.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-full px-3 py-1 font-semibold text-[10px] uppercase tracking-wider border-none",
                        org.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700" : 
                        org.status === 'BLOCKED' ? "bg-rose-50 text-rose-700" : 
                        "bg-amber-50 text-amber-700"
                      )}>
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-700">
                      {org._count?.users || 0}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-700">
                      {org._count?.websites || 0}
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium text-sm whitespace-nowrap">
                      {new Date(org.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl font-bold bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 h-9 transition-all"
                          onClick={() => {
                            setSelectedOrgForView(org);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" /> View Report
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 shadow-sm border border-slate-100">
                              <MoreVertical className="w-4 h-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-slate-100 p-2">
                            <DropdownMenuItem 
                              className="gap-2 py-3 rounded-xl cursor-pointer font-semibold"
                              onClick={() => navigate(`/dashboard/websites?org=${org.id}`)}
                            >
                              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Globe className="w-4 h-4" /></div>
                              Manage Websites
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 py-3 rounded-xl cursor-pointer font-semibold"
                              onClick={() => navigate(`/dashboard/users?org=${org.id}`)}
                            >
                              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Users className="w-4 h-4" /></div>
                              Manage Users
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 py-3 rounded-xl cursor-pointer font-medium text-slate-600">
                              <Edit className="w-4 h-4" /> Edit Configuration
                            </DropdownMenuItem>
                            {org.status !== 'APPROVED' && (
                              <DropdownMenuItem 
                                className="gap-2 py-3 rounded-xl cursor-pointer text-emerald-600 focus:text-emerald-700 font-bold"
                                onClick={() => handleStatusUpdate(org.id, 'APPROVED')}
                              >
                                <CheckCircle className="w-4 h-4" /> Approve Tenant
                              </DropdownMenuItem>
                            )}
                            {org.status !== 'BLOCKED' && (
                              <DropdownMenuItem 
                                className="gap-2 py-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-700 font-bold"
                                onClick={() => handleStatusUpdate(org.id, 'BLOCKED')}
                              >
                                <AlertCircle className="w-4 h-4" /> Block Access
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 py-3 rounded-xl cursor-pointer text-rose-600 focus:text-rose-700 font-black"
                              onClick={() => handleDelete(org.id)}
                            >
                              <Trash2 className="w-4 h-4" /> Purge Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organizations;