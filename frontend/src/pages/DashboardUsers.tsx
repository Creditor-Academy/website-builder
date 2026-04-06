import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users, UserPlus, Search, Edit, UserX, UserCheck, UserCog,
  AlertTriangle, Clock, CalendarDays, ShieldCheck,
  User as UserIcon, CheckCircle, AlertCircle, XCircle,
  MoreVertical, Trash2, ListFilter, RefreshCw, Plus,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import UserShimmer from '@/components/dashboard/UserShimmer';
import institutionApi from '@/api/institution';
import GradientButton from '@/components/ui/GradientButton';
import { useSearchParams } from 'react-router-dom';
import { getUsers, updateUserRole, updateUserStatus, restoreUser, createUser } from '../api/user';

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  institution_id: string | null;
  institution?: { name: string };
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  lastLogin: string;
  deletedAt?: string | null;
}

interface Institution {
  id: string;
  name: string;
}

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  role: string;
  institution_id: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely extracts the users array from any backend response shape:
 *   res.data.data.users  /  res.data.data  /  res.data.users  /  res.data
 */
function extractUsers(responseData: any): any[] {
  if (!responseData) return [];
  // { data: { users: [...] } }
  if (Array.isArray(responseData?.data?.users)) return responseData.data.users;
  // { data: [...] }
  if (Array.isArray(responseData?.data)) return responseData.data;
  // { users: [...] }
  if (Array.isArray(responseData?.users)) return responseData.users;
  // [...]
  if (Array.isArray(responseData)) return responseData;
  return [];
}

/**
 * Safely extracts a single created/updated user from any backend response shape:
 *   res.data.data  /  res.data.user  /  res.data
 */
function extractUser(responseData: any): any {
  if (!responseData) return null;
  if (responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
    return responseData.data;
  }
  if (responseData?.user && typeof responseData.user === 'object') return responseData.user;
  if (typeof responseData === 'object' && responseData.id) return responseData;
  return null;
}

function mapApiUserToRow(u: any, organizations: Institution[]): UserRow {
  return {
    id: u.id,
    name: u.name || '',
    email: u.email || '',
    role: u.role === 'SUPER_ADMIN'
      ? 'Super Admin'
      : u.role === 'INSTITUTION_ADMIN'
      ? 'Inst. Admin'
      : u.role === 'ADMIN'
      ? 'Admin'
      : 'User',
    institution_id: u.institution_id ?? null,
    institution: u.institution ?? organizations.find(o => o.id === u.institution_id),
    // support both isActive / active / deleted_at / deletedAt
    status: (u.isActive === true || u.active === true)
      ? 'Active'
      : (u.deleted_at || u.deletedAt)
      ? 'Suspended'
      : 'Inactive',
    createdAt: u.created_at || u.createdAt
      ? new Date(u.created_at || u.createdAt).toISOString().split('T')[0]
      : '—',
    lastLogin: u.lastLoginAt
      ? new Date(u.lastLoginAt).toISOString().split('T')[0]
      : 'Never',
    deletedAt: u.deleted_at ?? u.deletedAt ?? null,
  };
}

// ─── AddUserDialog ─────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: 'USER',             label: 'User' },
  { value: 'INSTITUTION_ADMIN', label: 'Institution Admin' },
  { value: 'ADMIN',            label: 'Admin' },
];

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (user: UserRow) => void;
  organizations: Institution[];
  isSuperAdmin: boolean;
  defaultInstitutionId?: string;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  onUserCreated,
  organizations,
  isSuperAdmin,
  defaultInstitutionId = '',
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState<NewUserForm>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    institution_id: defaultInstitutionId,
  });
  const [errors, setErrors] = useState<Partial<NewUserForm>>({});
  const [loading, setLoading] = useState(false);

  // Reset form whenever dialog opens
  useEffect(() => {
    if (open) {
      setForm({ name: '', email: '', password: '', role: 'USER', institution_id: defaultInstitutionId });
      setErrors({});
    }
  }, [open, defaultInstitutionId]);

  const validate = (): Partial<NewUserForm> => {
    const e: Partial<NewUserForm> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min. 6 characters';
    if (!form.role) e.role = 'Role is required';
    return e;
  };

  const set = (field: keyof NewUserForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    try {
      setLoading(true);

      // Build payload — omit empty institution_id
      const payload: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };
      if (form.institution_id) payload.institution_id = form.institution_id;

      const res = await createUser(payload);

      // ✅ Safely extract user from any response shape
      const raw = extractUser(res.data);
      if (!raw) throw new Error('No user data returned from server');

      const newRow = mapApiUserToRow(raw, organizations);

      toast({
        title: 'User created ✅',
        description: `${form.name} has been added successfully.`,
      });

      onUserCreated(newRow);
      onOpenChange(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create user. Please try again.';
      toast({ title: 'Creation failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-lg rounded-[2rem] p-0 overflow-hidden bg-white border-slate-100 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-7">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-black text-white">Add New User</DialogTitle>
          <DialogDescription className="text-white/70 mt-1 text-sm">
            Create a new user account on the platform.
          </DialogDescription>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name *</label>
            <Input
              placeholder="e.g., Jane Smith"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              disabled={loading}
              className={cn(
                "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
                errors.name && "border-rose-400 bg-rose-50"
              )}
            />
            {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
            <Input
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              disabled={loading}
              className={cn(
                "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
                errors.email && "border-rose-400 bg-rose-50"
              )}
            />
            {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password *</label>
            <Input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              disabled={loading}
              className={cn(
                "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
                errors.password && "border-rose-400 bg-rose-50"
              )}
            />
            {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role *</label>
            <Select value={form.role} onValueChange={v => set('role', v)} disabled={loading}>
              <SelectTrigger className={cn(
                "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
                errors.role && "border-rose-400"
              )}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
                {ROLE_OPTIONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-rose-500 font-medium">{errors.role}</p>}
          </div>

          {/* Organization — Super Admin only */}
          {isSuperAdmin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Organization</label>
              <Select value={form.institution_id || '__none__'} onValueChange={v => set('institution_id', v === '__none__' ? '' : v)} disabled={loading}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all">
                  <SelectValue placeholder="Platform (None)" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
                  <SelectItem value="__none__">Platform (None)</SelectItem>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex gap-3 justify-end border-t border-slate-100 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl h-11 px-6 border-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl h-11 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create User
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DashboardUsers() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const orgFilter = searchParams.get('org');

  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Institution[]>([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<UserRow | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive' | 'Suspended'>('all');
  const [sortBy, setSortBy] = useState('recent');

  // ─── Fetch users ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUsersData = async () => {
      setIsLoading(true);
      try {
        const res = await getUsers({ institution_id: orgFilter || undefined });

        // ✅ Defensive extraction — handles any response shape
        const raw = extractUsers(res.data);
        setUsers(raw.map((u: any) => mapApiUserToRow(u, organizations)));
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrgs = async () => {
      if (!isSuperAdmin) return;
      try {
        const res = await institutionApi.list();
        setOrganizations(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch organizations", err);
      }
    };

    fetchOrgs().then(() => fetchUsersData());
  }, [toast, isSuperAdmin, orgFilter]);

  // ─── Edit user ──────────────────────────────────────────────────────────────
  const handleEditClick = (user: UserRow) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const original = users.find(u => u.id === editingUser.id);
      if (!original) return;

      if (original.role !== editingUser.role) {
        // Map display role back to API role
        const roleMap: Record<string, string> = {
          'Admin': 'ADMIN',
          'Inst. Admin': 'INSTITUTION_ADMIN',
          'Super Admin': 'SUPER_ADMIN',
          'User': 'USER',
        };
        const backendRole = roleMap[editingUser.role] ?? editingUser.role;
        await updateUserRole(editingUser.id, backendRole);
      }

      setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
      setIsEditModalOpen(false);
      setEditingUser(null);
      toast({ title: "User updated ✨", description: `${editingUser.name} has been updated.` });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleSelectChange = (id: keyof UserRow, value: string) => {
    if (editingUser) setEditingUser({ ...editingUser, [id]: value });
  };

  // ─── Deactivate user ────────────────────────────────────────────────────────
  const handleDeactivateClick = (user: UserRow) => {
    setUserToDeactivate(user);
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!userToDeactivate) return;
    try {
      await updateUserStatus(userToDeactivate.id, false);
      setUsers(prev => prev.map(u =>
        u.id === userToDeactivate.id ? { ...u, status: 'Inactive' } : u
      ));
      setIsDeactivateDialogOpen(false);
      setUserToDeactivate(null);
      toast({ title: "User deactivated ⛔", description: `${userToDeactivate.name} has been deactivated.` });
    } catch (error: any) {
      toast({
        title: "Deactivation failed",
        description: error?.response?.data?.message || "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  // ─── Restore user ───────────────────────────────────────────────────────────
  const handleRestoreClick = async (user: UserRow) => {
    try {
      await restoreUser(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Active', deletedAt: null } : u));
      toast({ title: "User restored 🟢", description: `${user.name} is now active.` });
    } catch (error: any) {
      toast({
        title: "Restore failed",
        description: error?.response?.data?.message || "Failed to restore user",
        variant: "destructive",
      });
    }
  };

  // ─── Add user callback ──────────────────────────────────────────────────────
  const handleUserCreated = (newRow: UserRow) => {
    setUsers(prev => [newRow, ...prev]);
  };

  // ─── Filter & sort ──────────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'role') return a.role.localeCompare(b.role);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> /{' '}
        <span className="font-semibold text-slate-700">Users</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Users Management</h2>
          <p className="text-slate-500 mt-1">Manage your users and permissions.</p>
        </div>
        <GradientButton
          onClick={() => setIsAddUserModalOpen(true)}
          className="w-full md:w-auto h-11"
          icon={<UserPlus className="w-5 h-5" />}
        >
          Add User
        </GradientButton>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 w-full h-11 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'Active', 'Inactive', 'Suspended'] as const).map(s => (
            <Button
              key={s}
              variant={filterStatus === s ? 'default' : 'outline'}
              className={cn(
                "rounded-full h-10 px-4 text-sm font-semibold transition-all duration-200",
                filterStatus === s
                  ? s === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : s === 'Active'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : s === 'Inactive'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                    : 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'
              )}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'All Users' : s}
            </Button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-2 focus:ring-blue-500/20 transition-all">
            <ListFilter className="h-4 w-4 text-slate-400 mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="role">Role</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] px-2 text-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
              </TableHead>
              <TableHead className="min-w-[200px] px-4 py-3 text-slate-500">User</TableHead>
              <TableHead className="min-w-[100px] px-4 py-3 text-slate-500">Role</TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 text-slate-500">Organization</TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">Status</TableHead>
              <TableHead className="min-w-[140px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-slate-400" /> Created At
                </span>
              </TableHead>
              <TableHead className="min-w-[140px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Last Login
                </span>
              </TableHead>
              <TableHead className="text-right px-4 py-3 text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <UserShimmer key={i} />)
            ) : sortedUsers.length > 0 ? (
              sortedUsers.map(user => (
                <TableRow key={user.id} className="h-16 border-b border-slate-100 hover:bg-slate-50/70 transition-all">
                  <TableCell className="px-2 text-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                        {user.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge className={cn(
                      user.role.includes("Admin")
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-100/80"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100/80"
                    )}>
                      {user.role.includes("Admin") && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {user.role === "User" && <UserIcon className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">
                      {user.institution?.name || (user.institution_id === null ? 'Platform' : '—')}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge className={cn(
                      user.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80'
                        : user.status === 'Inactive'
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-100/80'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-100/80'
                    )}>
                      {user.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {user.status === 'Inactive' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {user.status === 'Suspended' && <XCircle className="w-3 h-3 mr-1" />}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm px-4 py-3">{user.createdAt}</TableCell>
                  <TableCell className="text-slate-500 text-sm px-4 py-3">{user.lastLogin}</TableCell>
                  <TableCell className="text-right px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                        <DropdownMenuItem onClick={() => handleEditClick(user)} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                          <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status !== 'Active' ? (
                          <DropdownMenuItem onClick={() => handleRestoreClick(user)} className="rounded-lg gap-2 cursor-pointer focus:bg-emerald-50 focus:text-emerald-600">
                            <UserCheck className="w-4 h-4" /> Restore User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleDeactivateClick(user)} className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                            <UserX className="w-4 h-4" /> Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/5 focus:text-rose-700">
                          <Trash2 className="w-4 h-4" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── Add User Dialog ─────────────────────────────────────────────────── */}
      <AddUserDialog
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        onUserCreated={handleUserCreated}
        organizations={organizations}
        isSuperAdmin={isSuperAdmin}
        defaultInstitutionId={currentUser?.institution_id || ''}
      />

      {/* ─── Edit User Dialog ────────────────────────────────────────────────── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" /> Edit User
            </DialogTitle>
            <DialogDescription>
              Make changes to the user profile. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right text-sm">Name</Label>
              <Input
                id="edit-name"
                value={editingUser?.name || ''}
                onChange={e => editingUser && setEditingUser({ ...editingUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right text-sm">Email</Label>
              <Input
                id="edit-email"
                value={editingUser?.email || ''}
                onChange={e => editingUser && setEditingUser({ ...editingUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">Role</Label>
              <Select
                value={editingUser?.role || ''}
                onValueChange={v => handleSelectChange('role', v)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Inst. Admin">Inst. Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">Status</Label>
              <Select
                value={editingUser?.status || ''}
                onValueChange={v => handleSelectChange('status', v)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Deactivate Confirm Dialog ───────────────────────────────────────── */}
      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent className="w-[90%] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate{' '}
              <span className="font-semibold">{userToDeactivate?.name}</span>'s account.
              They can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm}>Deactivate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}