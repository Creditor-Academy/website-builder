import React, { useState, useEffect } from 'react';
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
  Globe2, LayoutGrid, ShieldCheck, User as UserIcon, Hash, FileText, Link, Clock, Edit, Copy, Eye, Trash2, MoreVertical, CheckCircle, CircleDotDashed, Ban, Search, Plus, ListFilter
} from 'lucide-react';
import WebsiteShimmer from '@/components/dashboard/WebsiteShimmer';
import GradientButton from '@/components/ui/GradientButton';

interface Website {
  id: string;
  name: string;
  domain: string;
  status: 'Draft' | 'Published' | 'Deleted';
  lastUpdated: string;
}

const dummyMyWebsites: Website[] = [
  { id: "web1", name: "My Personal Blog", domain: "myblog.athenalms.com", status: "Published", lastUpdated: "2023-10-26" },
  { id: "web2", name: "Portfolio Site", domain: "myporfolio.athenalms.com", status: "Draft", lastUpdated: "2023-11-15" },
];

const dummyAllWebsites: Website[] = [
  { id: "web1", name: "My Personal Blog", domain: "myblog.athenalms.com", status: "Published", lastUpdated: "2023-10-26" },
  { id: "web2", name: "Portfolio Site", domain: "myporfolio.athenalms.com", status: "Draft", lastUpdated: "2023-11-15" },
  { id: "web3", name: "Client Project X", domain: "projectx.athenalms.com", status: "Published", lastUpdated: "2023-12-01" },
  { id: "web4", name: "E-commerce Store", domain: "shop.athenalms.com", status: "Draft", lastUpdated: "2023-09-20" },
  { id: "web5", name: "Old Portfolio", domain: "old.athenalms.com", status: "Deleted", lastUpdated: "2023-08-01" },
];

export default function DashboardWebsites() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Simulate admin role toggle

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Draft' | 'Published' | 'Deleted'>('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const baseWebsites = isAdmin ? dummyAllWebsites : dummyMyWebsites;

      const filtered = baseWebsites.filter(website => {
        const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              website.domain.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || website.status === filterStatus;
        return matchesSearch && matchesStatus;
      });

      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'status') {
          return a.status.localeCompare(b.status);
        }
        // Default to 'recent' if sortBy is not 'name' or 'status'
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
      setWebsites(sorted);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [isAdmin, searchTerm, filterStatus, sortBy]);

  const handleEdit = (website: Website) => {
    setEditingWebsite(website);
    setIsEditStatusModalOpen(true);
  };

  const handleSaveStatus = (newStatus: 'Draft' | 'Published' | 'Deleted') => {
    if (editingWebsite) {
      setWebsites(prevWebsites =>
        prevWebsites.map(web =>
          web.id === editingWebsite.id ? { ...web, status: newStatus } : web
        )
      );
      setIsEditStatusModalOpen(false);
      setEditingWebsite(null);
      // Show toast notification
      toast({
        title: "Website Status Updated ✅",
        description: `Status for \"${editingWebsite.name}\" changed to ${newStatus}.`,
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      });
    }
    navigate(`/builder/${website.id}`);
  };

  const handleDelete = (website: Website) => {
    console.log("Delete website:", website);
    // In a real application, this would trigger a deletion confirmation and API call
  };

  const handleDuplicate = (website: Website) => {
    console.log("Duplicate website:", website);
    // In a real application, this would create a copy of the website
  };

  const handlePreview = (website: Website) => {
    console.log("Preview website:", website);
    // In a real application, this would open the website in a new tab
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
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Website Management</h2>
          <p className="text-slate-500 mt-1">Manage your deployed and draft websites.</p>
        </div>
        <div className="flex items-center gap-4">
          <GradientButton
            onClick={() => setIsAdmin(!isAdmin)}
            className="w-full md:w-auto"
            icon={isAdmin ? <ShieldCheck className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
          >
            Admin View ({isAdmin ? "ON" : "OFF"})
          </GradientButton>
          <GradientButton className="w-full md:w-auto" icon={<Plus className="w-5 h-5" />}>
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
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'Published' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Published' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Published')}
          >
            Published
          </Button>
          <Button
            variant={filterStatus === 'Draft' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Draft' ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Draft')}
          >
            Draft
          </Button>
          <Button
            variant={filterStatus === 'Deleted' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Deleted' ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Deleted')}
          >
            Deleted
          </Button>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11 rounded-full bg-white border-slate-200 
                                    shadow-md shadow-slate-200/50 focus:ring-2 focus:ring-blue-500/20 
                                    focus:border-blue-500 transition-all duration-300 hover:bg-slate-100 hover:text-indigo-700">
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
              // Shimmer loading effect
              Array.from({ length: 5 }).map((_, i) => <WebsiteShimmer key={i} />)
            ) : websites.length > 0 ? (
              // Display sorted and filtered websites
              websites.map((website) => (
                <TableRow key={website.id} className="group h-16 border-b border-slate-100 hover:bg-slate-50/70 transition-all duration-200">
                  <TableCell className="px-2 text-center"><input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" /></TableCell>
                  <TableCell className="font-medium text-slate-600 px-4 py-3">#{website.id}</TableCell>
                  <TableCell className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-xs">
                      {website.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{website.name}</p>
                      <p className="text-sm text-slate-500">{website.domain}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      className={
                        website.status === "Published"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80"
                          : website.status === "Draft"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100/80"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-100/80"
                      }
                    >
                      {website.status === "Published" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {website.status === "Draft" && <CircleDotDashed className="w-3 h-3 mr-1" />}
                      {website.status === "Deleted" && <Ban className="w-3 h-3 mr-1" />}
                      {website.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm px-4 py-3">{website.lastUpdated}</TableCell>
                  <TableCell className="text-right px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                        <DropdownMenuItem onClick={() => handleEdit(website)} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100 focus:text-indigo-700">
                          <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(website)} className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/5 focus:text-rose-600">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No websites found message
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No websites found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Status Dialog */}
      <Dialog open={isEditStatusModalOpen} onOpenChange={setIsEditStatusModalOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" /> Edit Website Status
            </DialogTitle>
            <DialogDescription>
              Make changes to the website status here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="md:text-right">
                Status
              </Label>
              <Select
                value={editingWebsite?.status || ''}
                onValueChange={(value: 'Draft' | 'Published' | 'Deleted') =>
                  setEditingWebsite(prev => prev ? { ...prev, status: value } : null)
                }
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
            <Button
              onClick={() => editingWebsite && handleSaveStatus(editingWebsite.status)}
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}