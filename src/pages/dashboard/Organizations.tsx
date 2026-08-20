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
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  templates?: any[];
  _count?: {
    users: number;
    websites: number;
    templates: number;
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
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'BLOCKED'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrgForView, setSelectedOrgForView] = useState<Institution | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newOrg, setNewOrg] = useState<NewOrgForm>({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Edit Configuration state ───────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrgForEdit, setSelectedOrgForEdit] = useState<Institution | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', status: '' });
  const [editErrors, setEditErrors] = useState<{ name?: string; email?: string }>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInstitutions();
    fetchTotalUsers();
  }, []);

  const fetchTotalUsers = async () => {
    try {
      // Use the stats API — it returns accurate platform-wide counts
      const { default: statsApi } = await import('../../api/stats');
      const res = await statsApi.getDashboardStats({ adminView: true });
      const data = res.data?.data || res.data;
      const total = data?.totalUsers ?? data?.total_users ?? null;
      if (total !== null) {
        setTotalUsers(Number(total));
        return;
      }
    } catch {
      // stats API failed — fall back to users API
    }

    // Fallback: GET /users and count the array
    try {
      const { getUsers } = await import('../../api/user');
      const res = await getUsers({ limit: 1000, page: 1 });
      const arr =
        res.data?.data?.users ||
        res.data?.data ||
        res.data?.users ||
        (Array.isArray(res.data) ? res.data : []);
      const paginationTotal =
        res.data?.data?.total ??
        res.data?.total ??
        res.data?.meta?.total ??
        res.data?.pagination?.total ?? null;
      setTotalUsers(paginationTotal !== null ? Number(paginationTotal) : arr.length);
    } catch (err) {
      console.error('Failed to fetch total users count:', err);
      setTotalUsers(null);
    }
  };

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

  // ── Open edit modal pre-filled with org data ───────────────────────────────
  const handleEditClick = (org: Institution) => {
    setSelectedOrgForEdit(org);
    setEditForm({ name: org.name, email: org.email, status: org.status });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const handleEditField = (field: 'name' | 'email' | 'status', value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setEditErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateEditForm = () => {
    const errors: { name?: string; email?: string } = {};
    if (!editForm.name.trim()) errors.name = 'Organization name is required';
    if (!editForm.email.trim() || !/\S+@\S+\.\S+/.test(editForm.email)) errors.email = 'Valid email is required';
    return errors;
  };

  const handleSaveEdit = async () => {
    if (!selectedOrgForEdit) return;
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) { setEditErrors(errors); return; }

    setIsSavingEdit(true);
    try {
      await institutionApi.update(selectedOrgForEdit.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        status: editForm.status,
      });
      setInstitutions(prev =>
        prev.map(o =>
          o.id === selectedOrgForEdit.id
            ? { ...o, name: editForm.name.trim(), email: editForm.email.trim(), status: editForm.status }
            : o
        )
      );
      setIsEditModalOpen(false);
      setSelectedOrgForEdit(null);
      toast({ title: 'Organization updated ✅', description: `${editForm.name} has been updated successfully.` });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to update organization.';
      toast({ title: 'Update failed', description: msg, variant: 'destructive' });
    } finally {
      setIsSavingEdit(false);
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

  const filteredOrgs = institutions.filter(org => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || org.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page space-y-6 animate-in fade-in duration-500">
      {/* Header bar — match Templates / Assets */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              Organizations
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Manage platform tenants, branding, and global intelligence.
            </p>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={handleModalClose}>
            <DialogTrigger asChild>
              <Button className="h-10 w-full rounded-full bg-white px-5 text-xs font-semibold text-[#0F172A] shadow-none hover:scale-100 hover:bg-slate-100 hover:text-[#0F172A] active:scale-100 md:h-11 md:w-auto md:text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </DialogTrigger>

          {/* ─── Add Organization Dialog ─────────────────────────────────── */}
          <DialogContent className="sm:max-w-lg rounded-3xl sm:rounded-3xl border-0 p-0 overflow-hidden bg-white shadow-xl gap-0">
            {/* Header */}
            <div className="bg-[#0F172A] px-8 py-7">
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
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Organization Name *
                  </label>
                  <Input
                    placeholder="e.g. Buildora Global"
                    value={newOrg.name}
                    onChange={e => setField('name', e.target.value)}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 rounded-xl bg-[#F4F4F5] border-[#E8E8E8] focus:bg-white transition-all",
                      formErrors.name && "border-rose-400 bg-rose-50"
                    )}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-500 font-medium">{formErrors.name}</p>
                  )}
                </div>

                {/* Admin Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Admin Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@organization.com"
                    value={newOrg.email}
                    onChange={e => setField('email', e.target.value)}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12 rounded-xl bg-[#F4F4F5] border-[#E8E8E8] focus:bg-white transition-all",
                      formErrors.email && "border-rose-400 bg-rose-50"
                    )}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-500 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* Admin Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
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
                        "h-12 rounded-xl bg-[#F4F4F5] border-[#E8E8E8] focus:bg-white transition-all pr-12",
                        formErrors.password && "border-rose-400 bg-rose-50"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787778] hover:text-[#747781] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-xs text-rose-500 font-medium">{formErrors.password}</p>
                  )}
                  <p className="text-[11px] text-[#787778] font-medium">
                    This password will be used for the Institution Admin account linked to this organization.
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="px-8 pb-8 flex gap-3 justify-end border-t border-[#E8E8E8] pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleModalClose(false)}
                  disabled={isSubmitting}
                  className="rounded-xl h-11 px-6 border-[#E8E8E8] shadow-none hover:bg-gray-100 hover:scale-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl h-11 px-8 bg-[#0F172A] text-white shadow-none hover:bg-[#1E293B] hover:scale-100 transition-colors font-bold"
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
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-5 text-white shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Platform Reach</p>
          <p className="mt-2 text-4xl font-bold">{institutions.length}</p>
          <p className="mt-1 text-xs font-semibold text-white/70">Active Organizations</p>
          <Building2 className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-5 text-white shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">User Base</p>
          <p className="mt-2 text-4xl font-bold">
            {totalUsers !== null
              ? totalUsers
              : institutions.reduce((acc, org) => acc + Math.max(org._count?.users || 0, org.users?.length || 0), 0)}
          </p>
          <p className="mt-1 text-xs font-semibold text-white/70">Platform Users</p>
          <Users className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-5 text-white shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Digital Footprint</p>
          <p className="mt-2 text-4xl font-bold">
            {institutions.reduce((acc, org) => acc + (org._count?.websites || 0), 0)}
          </p>
          <p className="mt-1 text-xs font-semibold text-white/70">Live Websites</p>
          <Globe className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-5 text-white shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Compliance</p>
          <p className="mt-2 text-4xl font-bold">
            {institutions.filter(o => o.status === 'PENDING').length}
          </p>
          <p className="mt-1 text-xs font-semibold text-amber-300/90">Pending Approvals</p>
          <ShieldCheck className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
        </div>
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-xl sm:max-w-2xl sm:rounded-3xl">
          <div className="relative shrink-0 bg-[#0F172A] px-5 py-4 text-white">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Building2 className="h-4 w-4 text-white/70" />
                </div>
                {selectedOrgForView?.name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs font-medium text-white/50">
                Organization Intelligence Report
              </DialogDescription>
            </DialogHeader>
            <Building2 className="pointer-events-none absolute bottom-2 right-3 h-20 w-20 text-white/5" />
          </div>

          <div className="grow space-y-4 overflow-y-auto bg-[#F4F4F5] p-4 no-scrollbar sm:p-5">
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#0F172A] p-3 text-white shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">Team Members</p>
                  <p className="text-lg font-bold leading-none">{selectedOrgForView?.users?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#0F172A] p-3 text-white shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">Digital Assets</p>
                  <p className="text-lg font-bold leading-none">{selectedOrgForView?.websites?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#0F172A] p-3 text-white shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">Templates</p>
                  <p className="text-lg font-bold leading-none">{selectedOrgForView?.templates?.length || 0}</p>
                </div>
              </div>
            </div>

            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                <Users className="h-3.5 w-3.5 text-[#747781]" />
                Member Hierarchy
              </h3>
              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <Table>
                  <TableHeader className="bg-[#F4F4F5]">
                    <TableRow className="border-[#E8E8E8] hover:bg-transparent">
                      <TableHead className="py-2.5 text-xs font-semibold text-[#747781]">Identity</TableHead>
                      <TableHead className="py-2.5 text-right text-xs font-semibold text-[#747781]">Access Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrgForView?.users?.map((user: any) => (
                      <TableRow key={user.id} className="border-[#E8E8E8] hover:bg-[#F8FAFC]">
                        <TableCell className="py-2.5">
                          <div className="text-sm font-semibold text-[#0F172A]">{user.name}</div>
                          <div className="text-[11px] text-[#747781]">{user.email}</div>
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Badge variant="outline" className="border-none bg-[#F4F4F5] px-2.5 py-0.5 text-[10px] font-semibold capitalize text-[#747781]">
                            {user.role.toLowerCase().replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!selectedOrgForView?.users || selectedOrgForView.users.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={2} className="py-8 text-center text-sm text-[#787778]">No team members identified</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>

            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                <BarChart3 className="h-3.5 w-3.5 text-[#747781]" />
                Digital Assets
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {selectedOrgForView?.websites?.map((site: any) => (
                  <div key={site.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F5] text-xs font-bold text-[#0F172A]">
                        {site.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{site.name}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#787778]">
                          Indexed on {new Date(site.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={cn(
                      'rounded-full border-none px-2.5 py-0.5 text-[10px] font-semibold capitalize',
                      site.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F4F4F5] text-[#747781]'
                    )}>
                      {site.status.toLowerCase()}
                    </Badge>
                  </div>
                ))}
                {(!selectedOrgForView?.websites || selectedOrgForView.websites.length === 0) && (
                  <div className="rounded-xl border border-dashed border-[#E8E8E8] bg-white py-8 text-center text-sm italic text-[#787778]">
                    No digital assets recorded
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                <FileText className="h-3.5 w-3.5 text-[#747781]" />
                Organization Templates
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {selectedOrgForView?.templates?.filter((t: any) => !t.deletedAt).map((tmpl: any) => (
                  <div key={tmpl.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F5] text-xs font-bold text-[#0F172A]">
                        {tmpl.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{tmpl.name}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#787778]">
                          {tmpl.category} • Created {new Date(tmpl.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="rounded-full border-none bg-[#F4F4F5] px-2.5 py-0.5 text-[10px] font-semibold capitalize text-[#747781]">
                      {tmpl.scope?.toLowerCase() || 'institution'}
                    </Badge>
                  </div>
                ))}
                {(!selectedOrgForView?.templates || selectedOrgForView.templates.filter((t: any) => !t.deletedAt).length === 0) && (
                  <div className="rounded-xl border border-dashed border-[#E8E8E8] bg-white py-8 text-center text-sm italic text-[#787778]">
                    No templates created for this organization
                  </div>
                )}
              </div>
            </section>
          </div>
          <DialogFooter className="shrink-0 flex-row items-center justify-end gap-2 border-t border-[#E8E8E8] bg-white px-4 py-3">
            <Button
              variant="ghost"
              className="h-9 rounded-xl px-4 text-xs font-semibold text-[#747781] shadow-none hover:scale-100 hover:bg-[#F4F4F5] hover:text-[#0F172A]"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close Report
            </Button>
            <Button
              className="h-9 rounded-xl bg-[#0F172A] px-4 text-xs font-semibold text-white shadow-none hover:scale-100 hover:bg-[#1E293B]"
              onClick={() => navigate(`/admin/websites?org=${selectedOrgForView?.id}`)}
            >
              Manage Organization Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="overflow-hidden">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
            <Input
              placeholder="Search organizations..."
              className="h-9 w-full rounded-full border-[#E5E7EB] bg-white pl-9 text-sm text-[#0F172A] shadow-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(['ALL', 'APPROVED', 'PENDING', 'BLOCKED'] as const).map(status => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'h-8 rounded-full border px-3 text-xs font-semibold shadow-none transition-colors hover:scale-100 active:scale-100 sm:h-9 sm:px-3.5 sm:text-[13px]',
                  filterStatus === status
                    ? 'border-[#0F172A] bg-[#0F172A] text-white hover:bg-[#1E293B] hover:text-white'
                    : 'border-[#E5E7EB] bg-white text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                )}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                {status !== 'ALL' && (
                  <span className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    filterStatus === status ? 'bg-white/20' : 'bg-[#F4F4F5] text-[#747781]'
                  )}>
                    {institutions.filter(o => o.status === status).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-[#F4F4F5]">
              <TableRow className="border-[#E8E8E8] hover:bg-transparent">
                <TableHead className="font-semibold text-[#747781]">Organization</TableHead>
                <TableHead className="font-semibold text-[#747781]">Status</TableHead>
                <TableHead className="text-center font-semibold text-[#747781]">Users</TableHead>
                <TableHead className="text-center font-semibold text-[#747781]">Websites</TableHead>
                <TableHead className="text-center font-semibold text-[#747781]">Templates</TableHead>
                <TableHead className="font-semibold text-[#747781]">Created</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-10 w-48 bg-[#F4F4F5] rounded" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-[#F4F4F5] rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-10 bg-[#F4F4F5] rounded mx-auto" /></TableCell>
                    <TableCell><div className="h-6 w-10 bg-[#F4F4F5] rounded mx-auto" /></TableCell>
                    <TableCell><div className="h-6 w-10 bg-[#F4F4F5] rounded mx-auto" /></TableCell>
                    <TableCell><div className="h-6 w-32 bg-[#F4F4F5] rounded" /></TableCell>
                    <TableCell><div className="h-10 w-10 bg-[#F4F4F5] rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-[#787778]">
                      <Building2 className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No organizations found</p>
                      <p className="text-sm">Try searching for a different name or add a new one.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id} className="group border-[#E8E8E8] transition-colors hover:bg-[#F8FAFC]">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F5] text-xs font-bold text-[#0F172A]">
                          {org.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold leading-tight text-[#0F172A]">{org.name}</div>
                          <div className="text-[11px] font-medium text-[#747781]">{org.email}</div>
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
                    <TableCell className="text-center font-semibold text-[#0F172A]">
                      {Math.max(org._count?.users || 0, org.users?.length || 0)}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#0F172A]">
                      {org._count?.websites || 0}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#0F172A]">
                      {org._count?.templates || 0}
                    </TableCell>
                    <TableCell className="text-[#747781] font-medium text-sm whitespace-nowrap">
                      {new Date(org.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-full border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#0F172A] shadow-none transition-colors hover:scale-100 hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A] hover:shadow-none active:scale-100"
                          onClick={() => {
                            setSelectedOrgForView(org);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <FileText className="mr-1.5 h-3.5 w-3.5" /> View Report
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full border border-[#E5E7EB] bg-white shadow-none hover:scale-100 hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A] hover:shadow-none active:scale-100"
                            >
                              <MoreVertical className="h-3.5 w-3.5 text-[#747781]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-[#E8E8E8] p-2">
                            <DropdownMenuItem 
                              className="gap-2 py-3 rounded-xl cursor-pointer font-semibold"
                              onClick={() => navigate(`/admin/websites?org=${org.id}`)}
                            >
                              <div className="p-1.5 bg-[#F4F4F5] rounded-lg text-[#0F172A]"><Globe className="w-4 h-4" /></div>
                              Manage Websites
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 py-3 rounded-xl cursor-pointer font-semibold"
                              onClick={() => navigate(`/admin/users?org=${org.id}`)}
                            >
                              <div className="p-1.5 bg-[#F4F4F5] rounded-lg text-[#0F172A]"><Users className="w-4 h-4" /></div>
                              Manage Users
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 py-3 rounded-xl cursor-pointer font-medium text-[#747781]"
                              onClick={() => handleEditClick(org)}
                            >
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
        </div>
      </div>
      {/* ─── Edit Configuration Dialog ──────────────────────────────────────── */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => { if (!isSavingEdit) setIsEditModalOpen(open); }}>
        <DialogContent className="sm:max-w-lg rounded-3xl sm:rounded-3xl border-0 p-0 overflow-hidden bg-white shadow-xl gap-0">
          {/* Header */}
          <div className="bg-[#0F172A] px-8 py-7">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-black text-white">Edit Configuration</DialogTitle>
            <DialogDescription className="text-white/70 mt-1 text-sm">
              Update the details and status for <span className="font-bold text-white">{selectedOrgForEdit?.name}</span>.
            </DialogDescription>
          </div>

          {/* Form */}
          <div className="px-8 py-6 space-y-4">

            {/* Organization Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Organization Name *</label>
              <Input
                placeholder="e.g. Buildora Global"
                value={editForm.name}
                onChange={e => handleEditField('name', e.target.value)}
                disabled={isSavingEdit}
                className={cn(
                  "h-12 rounded-xl bg-[#F4F4F5] border-[#E8E8E8] focus:bg-white transition-all",
                  editErrors.name && "border-rose-400 bg-rose-50"
                )}
              />
              {editErrors.name && <p className="text-xs text-rose-500 font-medium">{editErrors.name}</p>}
            </div>

            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Admin Email *</label>
              <Input
                type="email"
                placeholder="admin@organization.com"
                value={editForm.email}
                onChange={e => handleEditField('email', e.target.value)}
                disabled={isSavingEdit}
                className={cn(
                  "h-12 rounded-xl bg-[#F4F4F5] border-[#E8E8E8] focus:bg-white transition-all",
                  editErrors.email && "border-rose-400 bg-rose-50"
                )}
              />
              {editErrors.email && <p className="text-xs text-rose-500 font-medium">{editErrors.email}</p>}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Status</label>
              <select
                value={editForm.status}
                onChange={e => handleEditField('status', e.target.value)}
                disabled={isSavingEdit}
                className="w-full h-12 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB] px-3 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
              >
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex gap-3 justify-end border-t border-[#E8E8E8] pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSavingEdit}
              className="rounded-xl h-11 px-6 border-[#E8E8E8]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSavingEdit}
              className="rounded-xl h-11 px-8 bg-[#0F172A] text-white shadow-none transition-colors font-bold"
            >
              {isSavingEdit ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Save Changes
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Organizations;