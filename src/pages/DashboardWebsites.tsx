import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Globe2, LayoutGrid, ShieldCheck, User as UserIcon, Hash, FileText, Link, Clock, Edit, Copy, Eye, Trash2, MoreVertical, CheckCircle, CircleDotDashed, Ban, Search, ListFilter, Plus, Building2, RotateCcw
} from 'lucide-react';
import WebsiteShimmer from '@/components/dashboard/WebsiteShimmer';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import useBuilderStore from '@/store/useBuilderStore';

interface Website {
  id: string;
  name: string;
  domain: string;
  status: string;
  lastUpdated: string;
  institution?: { name: string };
  updated_at?: string;
  lastEdited?: string;
}

export default function DashboardWebsites() {
  const navigate = useNavigate();
  const { search } = window.location;
  const orgId = new URLSearchParams(search).get('org');

  const { toast } = useToast();
  const { websites, fetchWebsites, deleteWebsite, restoreWebsite } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isInstitutionAdmin = currentUser.role === 'INSTITUTION_ADMIN';
  const isAdminRole = isSuperAdmin || currentUser.role === 'ADMIN' || isInstitutionAdmin;
  const [isAdminView, setIsAdminView] = useState(isSuperAdmin || isInstitutionAdmin); // SUPER_ADMIN and INSTITUTION_ADMIN default to admin view

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Draft' | 'Published' | 'Deleted'>('all');
  const [sortBy, setSortBy] = useState('recent');

  // Institution filter for super admin
  const [institutionFilter, setInstitutionFilter] = useState<string>('all');
  const availableInstitutions = useMemo(() => {
    const orgs: { id: string; name: string }[] = [];
    const seen = new Set<string>();
    websites?.forEach((w: any) => {
      if (w.institution?.name && w.institution_id && !seen.has(w.institution_id)) {
        seen.add(w.institution_id);
        orgs.push({ id: w.institution_id, name: w.institution.name });
      }
    });
    return orgs;
  }, [websites]);

  useEffect(() => {
    const loadWebsites = async () => {
      setIsLoading(true);
      try {
        await fetchWebsites(orgId || undefined, isAdminView && isAdminRole);
      } finally {
        setIsLoading(false);
      }
    };
    loadWebsites();
  }, [fetchWebsites, orgId, isAdminView, isAdminRole]);

  const filteredWebsites = useMemo(() => {
    if (!websites) return [];

    const filtered = websites.filter((website: any) => {
      const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (website.domain && website.domain.toLowerCase().includes(searchTerm.toLowerCase()));

      // Normalize status check
      const status = website.status?.toLowerCase() || 'draft';
      const matchesStatus = (filterStatus === 'all' && status !== 'deleted') ||
        (filterStatus === 'Published' && (status === 'published' || status === 'active')) ||
        (filterStatus === 'Draft' && (status === 'draft')) ||
        (filterStatus === 'Deleted' && (status === 'deleted'));

      // Institution filter (super admin)
      const matchesInstitution = institutionFilter === 'all' ||
        (institutionFilter === 'none' && !website.institution_id) ||
        website.institution_id === institutionFilter;

      return matchesSearch && matchesStatus && matchesInstitution;
    });

    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'status') {
        return (a.status || '').localeCompare(b.status || '');
      }
      const dateA = new Date(a.lastEdited || 0).getTime();
      const dateB = new Date(b.lastEdited || 0).getTime();
      return dateB - dateA;
    });
  }, [websites, searchTerm, filterStatus, sortBy]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '---';
      return date.toISOString().split('T')[0];
    } catch (err) {
      return '---';
    }
  };

  const handleEdit = (website: any) => {
    setEditingWebsite({
      id: website.id,
      name: website.name,
      domain: website.domain || `${website.id.slice(0, 8)}.buildora.lmsathena.com`,
      status: website.status || 'Draft',
      lastUpdated: formatDate(website.lastEdited)
    });
    setIsEditStatusModalOpen(true);
  };

  const handleSaveStatus = async (newStatus: string) => {
    if (editingWebsite) {
      try {
        await useBuilderStore.getState().updateWebsite(editingWebsite.id, { status: newStatus.toUpperCase() as any });
        toast({
          title: "Status Updated",
          description: `Website status successfully changed to ${newStatus}.`,
          variant: "default",
        });
        await fetchWebsites(orgId || undefined, isAdminView && isAdminRole);
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "Could not update the website status.",
          variant: "destructive",
        });
      }
      setIsEditStatusModalOpen(false);
      setEditingWebsite(null);
    }
  };

  const handleDelete = async (website: any) => {
    if (window.confirm(`Are you sure you want to delete the website "${website.name}"? This action cannot be undone.`)) {
      try {
        await deleteWebsite(website.id);
        toast({
          title: "Website Deleted",
          description: `${website.name} has been moved to Deleted.`,
          variant: "default",
        });
        // No re-fetch needed — store already marks it as DELETED optimistically.
        // Switch to Deleted tab so the user can see it there.
        setFilterStatus('Deleted');
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Could not delete the website.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRestore = async (website: any) => {
    try {
      await restoreWebsite(website.id);
      toast({
        title: "Website Restored",
        description: `${website.name} has been restored to Draft.`,
        variant: "default",
      });
      setFilterStatus('all');
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "Could not restore the website.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="admin-page">
      {/* Header bar — match Templates / Assets */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              {orgId ? 'Organization Websites' : 'Website Management'}
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              {orgId ? 'Managing websites for specific organization' : 'Manage your deployed and draft websites.'}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap md:justify-end md:gap-2.5">
            {isAdminRole && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdminView(prev => {
                    const newAdminState = !prev;
                    toast({
                      title: newAdminState ? "Admin View Activated! 🛡️" : "User View Activated! 👤",
                      description: newAdminState
                        ? (isSuperAdmin ? "You are now viewing all websites across the platform." : "You are now viewing all websites in your organization.")
                        : "You are now viewing your own websites.",
                      variant: "themed",
                      icon: newAdminState ? <ShieldCheck className="h-6 w-6 text-white stroke-2" /> : <UserIcon className="h-6 w-6 text-white stroke-2" />,
                    });
                    return newAdminState;
                  });
                }}
                className="h-10 w-full min-w-0 rounded-full border-white/15 bg-white/5 px-3 text-xs font-semibold text-slate-200 shadow-none hover:scale-100 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-100 md:h-11 md:w-auto md:px-5 md:text-sm"
              >
                {isAdminView ? <ShieldCheck className="mr-1.5 h-4 w-4 shrink-0" /> : <UserIcon className="mr-1.5 h-4 w-4 shrink-0" />}
                <span className="truncate">{isInstitutionAdmin ? 'Org View' : 'Admin View'} ({isAdminView ? 'ON' : 'OFF'})</span>
              </Button>
            )}

            {isSuperAdmin && isAdminView && availableInstitutions.length > 0 && (
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger className="h-10 w-full min-w-0 rounded-full border-white/15 bg-white/5 text-xs text-slate-200 hover:bg-white/10 md:h-11 md:w-[180px] md:text-sm">
                  <Building2 className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                  <SelectValue placeholder="All Orgs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  <SelectItem value="none">No Organization</SelectItem>
                  {availableInstitutions.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={async () => {
                try {
                  const id = await useBuilderStore.getState().createWebsite('My New Website', 'blank', orgId || undefined);
                  navigate(`/builder/${id}`);
                } catch (err) {
                  toast({
                    title: "Error",
                    description: "Failed to create website",
                    variant: "destructive"
                  });
                }
              }}
              className="col-span-2 h-10 w-full rounded-full bg-white px-4 text-xs font-semibold text-[#0F172A] shadow-none hover:scale-100 hover:bg-slate-100 hover:text-[#0F172A] active:scale-100 md:col-auto md:h-11 md:w-auto md:px-5 md:text-sm"
            >
              <Plus className="mr-1.5 h-4 w-4 shrink-0" />
              New Website
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
          <Input
            placeholder="Search websites by name or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-full border-[#E5E7EB] bg-white pl-9 text-sm text-[#0F172A] shadow-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {['all', 'Published', 'Draft', 'Deleted'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              className={cn(
                'h-8 rounded-full border px-3 text-xs font-semibold shadow-none transition-colors hover:scale-100 active:scale-100 sm:h-9 sm:px-3.5 sm:text-[13px]',
                filterStatus === status
                  ? 'border-[#0F172A] bg-[#0F172A] text-white hover:bg-[#1E293B] hover:text-white'
                  : 'border-[#E5E7EB] bg-white text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              )}
              onClick={() => setFilterStatus(status as any)}
            >
              {status}
            </Button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-9 w-full rounded-full border-[#E5E7EB] bg-white shadow-sm md:w-[180px]">
            <ListFilter className="mr-2 h-4 w-4 text-[#787778]" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#E8E8E8] bg-white shadow-lg">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
        <Table className="w-full overflow-hidden">
          <TableHeader className="border-b border-[#E8E8E8] bg-[#F4F4F5]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] px-2 text-center"><input type="checkbox" className="form-checkbox h-4 w-4 rounded text-[#0F172A]" /></TableHead>
              <TableHead className="w-[80px] px-4 py-3 text-[#747781]">ID</TableHead>
              <TableHead className="min-w-[200px] px-4 py-3 text-[#747781]">Website</TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-[#747781]">Status</TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 text-[#747781]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#787778]" /> Last Updated
                </span>
              </TableHead>
              <TableHead className="text-right min-w-[120px] px-4 py-3 text-[#747781]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <WebsiteShimmer key={i} />)
            ) : filteredWebsites.length > 0 ? (
              filteredWebsites.map((website: any) => (
                <TableRow key={website.id} className="group h-16 border-b border-[#E8E8E8] hover:bg-[#F4F4F5]/70 transition-all duration-200">
                  <TableCell className="px-2 text-center"><input type="checkbox" className="form-checkbox h-4 w-4 text-[#0F172A] rounded" /></TableCell>
                  <TableCell className="font-medium text-[#747781] px-4 py-3">#{website.id.slice(0, 8)}</TableCell>
                  <TableCell className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#0F172A] flex items-center justify-center font-bold text-sm border border-[#E5E7EB]/50">
                      {website.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A] leading-none">{website.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="bg-[#F4F4F5] text-[10px] font-mono font-medium text-[#747781] py-0 px-2 h-5 border-[#E8E8E8]">
                          {website.id}
                        </Badge>
                      </div>
                      {isAdminView && website.institution && (
                        <p className="text-[10px] text-[#747781] font-bold uppercase mt-1 tracking-wider">
                          <Building2 className="w-3 h-3 inline mr-0.5" />{website.institution.name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      className={
                        website.status?.toLowerCase() === "published" || website.status?.toLowerCase() === "active"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80"
                          : website.status?.toLowerCase() === "draft"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-100/80"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-100/80"
                      }
                    >
                      {(website.status?.toLowerCase() === "published" || website.status?.toLowerCase() === "active") && <CheckCircle className="w-3 h-3 mr-1" />}
                      {website.status?.toLowerCase() === "draft" && <CircleDotDashed className="w-3 h-3 mr-1" />}
                      {(website.status?.toLowerCase() === "deleted" || website.status?.toLowerCase() === "inactive") && <Ban className="w-3 h-3 mr-1" />}
                      {website.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#747781] text-sm px-4 py-3">
                    {formatDate(website.lastEdited)}
                  </TableCell>
                  <TableCell className="text-right px-4 py-3">
                    {website.status?.toLowerCase() === 'deleted' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(website)}
                          className="h-8 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs gap-1.5 shadow-none"
                          variant="ghost"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-[#F4F4F5]">
                              <MoreVertical className="h-4 w-4 text-[#747781]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-[#E8E8E8] shadow-lg">
                            <DropdownMenuItem onClick={() => handleRestore(website)} className="rounded-lg gap-2 cursor-pointer focus:bg-emerald-50 text-emerald-700">
                              <RotateCcw className="w-4 h-4" /> Restore
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(website)} className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/5">
                              <Trash2 className="w-4 h-4" /> Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-[#F4F4F5]">
                          <MoreVertical className="h-4 w-4 text-[#747781]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-[#E8E8E8] shadow-lg">
                        <DropdownMenuItem onClick={() => handleEdit(website)} className="rounded-lg gap-2 cursor-pointer focus:bg-[#F4F4F5]">
                          <Edit className="w-4 h-4" /> Edit Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/builder/${website.id}`)} className="rounded-lg gap-2 cursor-pointer focus:bg-[#F4F4F5]">
                          <LayoutGrid className="w-4 h-4" /> Open Editor
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(website)} className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/5">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-[#747781]">
                  No websites found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditStatusModalOpen} onOpenChange={setIsEditStatusModalOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" /> Edit Website Status
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="md:text-right">Status</Label>
              <Select
                value={editingWebsite?.status || ''}
                onValueChange={(value) => setEditingWebsite(prev => prev ? { ...prev, status: value } : null)}
              >
                <SelectTrigger className="col-span-1 md:col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => editingWebsite && handleSaveStatus(editingWebsite.status)}>
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}