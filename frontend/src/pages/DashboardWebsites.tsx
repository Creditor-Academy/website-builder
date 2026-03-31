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
import { Card } from "@/components/ui/card";
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
  Globe2, LayoutGrid, ShieldCheck, User as UserIcon, Hash, FileText, Link, Clock, Edit, Copy, Eye, Trash2, MoreVertical, CheckCircle, CircleDotDashed, Ban, Search, ListFilter
} from 'lucide-react';
import WebsiteShimmer from '@/components/dashboard/WebsiteShimmer';
import GradientButton from '@/components/ui/GradientButton';
import { useToast } from '@/components/ui/use-toast';
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
  const { websites, fetchWebsites } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const [isAdminView, setIsAdminView] = useState(false);

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Draft' | 'Published' | 'Deleted'>('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const loadWebsites = async () => {
      setIsLoading(true);
      try {
        await fetchWebsites(orgId || undefined, isAdminView && isSuperAdmin);
      } finally {
        setIsLoading(false);
      }
    };
    loadWebsites();
  }, [fetchWebsites, orgId, isAdminView, isSuperAdmin]);

  const filteredWebsites = useMemo(() => {
    if (!websites) return [];

    let filtered = websites.filter((website: any) => {
      const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (website.domain && website.domain.toLowerCase().includes(searchTerm.toLowerCase()));

      // Normalize status check
      const status = website.status?.toLowerCase() || 'draft';
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'Published' && (status === 'published' || status === 'active')) ||
        (filterStatus === 'Draft' && (status === 'draft')) ||
        (filterStatus === 'Deleted' && (status === 'deleted'));

      return matchesSearch && matchesStatus;
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
      domain: website.domain || `${website.id.slice(0, 8)}.buildora.app`,
      status: website.status || 'Draft',
      lastUpdated: formatDate(website.lastEdited)
    });
    setIsEditStatusModalOpen(true);
  };

  const handleSaveStatus = async (newStatus: string) => {
    if (editingWebsite) {
      toast({
        title: "Feature Coming Soon! 🛠️",
        description: `Backend update for website status is being implemented.`,
        variant: "default",
      });
      setIsEditStatusModalOpen(false);
      setEditingWebsite(null);
    }
  };

  const handleDelete = (website: any) => {
    console.log("Delete website:", website);
  };

  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> / <span className="font-semibold text-slate-700">Websites</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {orgId ? `Organization Websites` : 'Website Management'}
          </h2>
          <p className="text-slate-500 mt-1">
            {orgId ? `Managing websites for specific organization` : 'Manage your deployed and draft websites.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isSuperAdmin && (
            <GradientButton
              onClick={() => {
                setIsAdminView(prev => {
                  const newAdminState = !prev;
                  toast({
                    title: newAdminState ? "Admin View Activated! 🛡️" : "User View Activated! 👤",
                    description: newAdminState ? "You are now viewing all websites across the platform." : "You are now viewing your assigned websites.",
                    variant: "themed",
                    icon: newAdminState ? <ShieldCheck className="h-6 w-6 text-white stroke-2" /> : <UserIcon className="h-6 w-6 text-white stroke-2" />,
                  });
                  return newAdminState;
                });
              }}
              className="w-full md:w-auto"
              icon={isAdminView ? <ShieldCheck className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
            >
              Admin View ({isAdminView ? "ON" : "OFF"})
            </GradientButton>
          )}
          <GradientButton
            className="w-full md:w-auto"
            icon={<Plus className="w-5 h-5" />}
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
          >
            New Website
          </GradientButton>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search websites by name or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 w-full h-11 rounded-full bg-white border-slate-200 
                       shadow-md shadow-slate-200/50 focus:ring-2 focus:ring-blue-500/20 
                       focus:border-blue-500 transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Published', 'Draft', 'Deleted'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              className={`rounded-full h-10 px-4 text-sm font-semibold 
                          ${filterStatus === status ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}
                          transition-all duration-200`}
              onClick={() => setFilterStatus(status as any)}
            >
              {status}
            </Button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11 rounded-full bg-white border-slate-200 
                                    shadow-md shadow-slate-200/50 focus:ring-2 focus:ring-blue-500/20 
                                    focus:border-blue-500 transition-all duration-300 hover:bg-slate-100">
            <ListFilter className="h-4 w-4 text-slate-400 mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] px-2 text-center"><input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" /></TableHead>
              <TableHead className="w-[80px] px-4 py-3 text-slate-500">ID</TableHead>
              <TableHead className="min-w-[200px] px-4 py-3 text-slate-500">Website</TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">Status</TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Last Updated
                </span>
              </TableHead>
              <TableHead className="text-right min-w-[120px] px-4 py-3 text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <WebsiteShimmer key={i} />)
            ) : filteredWebsites.length > 0 ? (
              filteredWebsites.map((website: any) => (
                <TableRow key={website.id} className="group h-16 border-b border-slate-100 hover:bg-slate-50/70 transition-all duration-200">
                  <TableCell className="px-2 text-center"><input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" /></TableCell>
                  <TableCell className="font-medium text-slate-600 px-4 py-3">#{website.id.slice(0, 8)}</TableCell>
                  <TableCell className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100/50">
                      {website.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none">{website.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="bg-slate-50 text-[10px] font-mono font-medium text-slate-500 py-0 px-2 h-5 border-slate-100">
                          {website.id}
                        </Badge>
                      </div>
                      {isSuperAdmin && website.institution && (
                        <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1 tracking-wider">{website.institution.name}</p>
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
                  <TableCell className="text-slate-500 text-sm px-4 py-3">
                    {formatDate(website.lastEdited)}
                  </TableCell>
                  <TableCell className="text-right px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                        <DropdownMenuItem onClick={() => handleEdit(website)} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                          <Edit className="w-4 h-4" /> Edit Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/builder/${website.id}`)} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                          <LayoutGrid className="w-4 h-4" /> Open Editor
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(website)} className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/5">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
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
    </Card>
  );
}