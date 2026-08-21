import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '@/layouts/DashboardLayout';
import {
    Plus, Globe, MoreVertical, Edit2, Trash2,
    Clock, CheckCircle, Search, Files,
    ArrowRight, LayoutTemplate, Menu, ListFilter,
    Loader2, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { SiteThumbnail } from '@/components/dashboard/SiteThumbnail';
import { templatesList } from '@/lib/templates';
import templateApi from '@/api/templates';
import { updateUserProfile } from "../api/user";

const WebsiteCard = ({ site, index, onDelete, onEdit, onViewMessages, dbTemplates = [] }: any) => {
    // templateId might be a local key ('business') or a DB UUID; sourceTemplateId is always a DB UUID
    const activeTemplateId = site.templateId || site.sourceTemplateId || 'blank';
    const localTemplate = templatesList.find((t) => t.id === activeTemplateId);
    // Also check sourceTemplateId in DB templates
    const dbTemplate = dbTemplates.find(
        (t: any) => t.id === activeTemplateId || t.id === site.sourceTemplateId
    ) || null;
    const thumbnailImage = localTemplate?.image || dbTemplate?.image || null;

    const deployments = site.builderMeta?.deployments || [];
    const latestDeployment = deployments.length > 0 ? deployments[deployments.length - 1] : null;
    const publishedUrl = latestDeployment?.url || site.publishedUrl || (site.subdomain ? `https://${site.subdomain}.buildora.lmsathena.com` : null);
    return (
        <Card className="group/website-card flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-colors hover:border-[#CBD5E1]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-[#F4F4F5]">
                {/* Live preview — scaled real section render */}
                {site?.pages?.[0]?.sections?.length > 0 ? (
                    <SiteThumbnail site={site} className="absolute inset-0 w-full h-full" />
                ) : thumbnailImage ? (
                    <img
                        src={thumbnailImage}
                        alt={site.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                ) : (
                    <div
                        className="absolute inset-0 flex flex-col"
                        style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
                    >
                        <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-slate-200/60 bg-white/60 px-4">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8E8E8] bg-white shadow-sm">
                                <svg className="h-7 w-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="w-3/4 space-y-2">
                                <div className="h-2.5 w-full rounded-full bg-slate-200/80" />
                                <div className="mx-auto h-2 w-2/3 rounded-full bg-slate-200/60" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Soft hover: light overlay + Edit */}
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#0F172A]/0 opacity-0 transition-all duration-200 group-hover/website-card:bg-[#0F172A]/10 group-hover/website-card:opacity-100">
                    <Button
                        size="sm"
                        onClick={onEdit}
                        className="pointer-events-auto h-8 rounded-full border border-[#E5E7EB] bg-white px-3.5 text-xs font-semibold text-[#0F172A] shadow-[0_2px_6px_rgba(15,23,42,0.1)] hover:bg-[#F8FAFC] hover:scale-100"
                    >
                        <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
                </div>
            </div>

            <CardHeader className="p-5 pb-2 sm:p-6 sm:pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                        <CardTitle className="truncate text-lg font-bold leading-tight tracking-tight text-[#0F172A] sm:text-xl">
                            {site.name}
                        </CardTitle>
                        {publishedUrl && site.status === 'Published' && (
                            <a
                                href={publishedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 flex w-full max-w-[200px] items-center gap-1.5 truncate break-all text-xs font-medium text-[#0F172A]/70 hover:text-[#0F172A] hover:underline"
                                title={publishedUrl}
                            >
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{publishedUrl.replace('https://', '')}</span>
                            </a>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-[#747781]">
                            <Clock className="h-3 w-3 flex-shrink-0 text-[#787778]" />
                            {format(new Date(site.lastEdited), 'MMM d, p')}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-[#787778] hover:bg-[#F4F4F5] hover:text-[#0F172A] hover:scale-100"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#E8E8E8] bg-white p-2 shadow-lg">
                            <DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2 rounded-lg focus:bg-[#F4F4F5]">
                                <Edit2 className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg focus:bg-[#F4F4F5]">
                                <Files className="h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-2 rounded-lg text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                <Trash2 className="h-4 w-4" /> Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 p-5 pt-2 sm:p-6 sm:pt-3">
                <div
                    className={cn(
                        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider',
                        site.status === 'Published'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                            : 'border-amber-100 bg-amber-50 text-amber-700'
                    )}
                >
                    <div className={cn('h-1.5 w-1.5 rounded-full', site.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {site.status}
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="link"
                        className="h-auto p-0 text-sm font-semibold text-[#747781] hover:text-[#0F172A]"
                        onClick={onViewMessages}
                    >
                        Messages
                    </Button>
                    <Button
                        variant="link"
                        className="h-auto p-0 text-sm font-bold text-[#0F172A] underline-offset-4 hover:underline"
                        onClick={onEdit}
                    >
                        Open Editor →
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

const EmptyState = ({ onAction }) => (
    <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white p-12 text-center shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F4F4F5]">
            <Globe className="h-8 w-8 text-[#0F172A]" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
            Your creative journey starts here
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#747781]">
            Every great brand starts with a single page. Build yours with our visual canvas.
        </p>
        <Button
            size="lg"
            className="mt-6 gap-2 rounded-full bg-[#0F172A] px-8 text-white shadow-none hover:bg-[#1E293B] hover:scale-100 active:scale-100"
            onClick={onAction}
        >
            <Plus className="h-5 w-5" /> Create Your First Site
        </Button>
    </div>
);

// ─── UserDashboard ────────────────────────────────────────────────────────────

const UserDashboard = () => {
    const navigate = useNavigate();
    const { websites, fetchWebsites, createWebsite, deleteWebsite } = useBuilderStore();
    const isMobile = useIsMobile();
    const user = JSON.parse(localStorage.getItem("user") || 'null');
    // Sidebar / admin-mode state lives in DashboardLayout and is shared via Outlet context
    const { isAdmin, setIsSidebarOpen, userName, setUserName } = useOutletContext<DashboardOutletContext>();
    const [tempUserName, setTempUserName] = useState(user?.name || 'User');
    const [tempUserEmail] = useState(user?.email || '');

    const { toast } = useToast();

    const [newSiteName, setNewSiteName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [filterStatus, setFilterStatus] = useState('all');

    // DB templates for New Project dialog
    const [dbTemplates, setDbTemplates] = useState<any[]>([]);
    const [isCreatingSite, setIsCreatingSite] = useState(false);

    // ✅ Listen for userUpdated event (userName itself is kept in sync by DashboardLayout)
    useEffect(() => {
        const handleUserUpdated = (e) => {
            setTempUserName(e.detail.name);
        };
        window.addEventListener("userUpdated", handleUserUpdated);
        return () => window.removeEventListener("userUpdated", handleUserUpdated);
    }, []);

    useEffect(() => {
        fetchWebsites(undefined, isAdmin);
    }, [isAdmin, fetchWebsites]);

    // Fetch DB templates
    useEffect(() => {
        templateApi.getWebsiteTemplates()
            .then(res => {
                const raw = res.data?.data || res.data || [];
                const flat: any[] = Array.isArray(raw) ? raw : Object.values(raw).flat();
                setDbTemplates(flat.filter((t: any) => !t.deletedAt));
            })
            .catch(() => setDbTemplates([]));
    }, []);

    const handleProfileSave = async () => {
        try {
            setIsUpdatingProfile(true);
            await updateUserProfile(tempUserName);

            const updatedUser = { ...user, name: tempUserName };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUserName(tempUserName);

            setIsUserProfileDialogOpen(false);
            toast({ title: "Profile updated", description: "Your name has been updated successfully." });
        } catch (error) {
            console.error("Profile update failed:", error);
            toast({
                title: "Update failed",
                description: error?.response?.data?.message || "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleDialogClose = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setNewSiteName('');
            setSelectedTemplate('blank');
        }
    };

    const filteredWebsites = React.useMemo(() => {
        if (!websites) return [];
        let tempWebsites = websites.filter(site =>
            site.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filterStatus === 'all') {
            tempWebsites = tempWebsites.filter(site => site.status?.toLowerCase() !== 'deleted');
        } else {
            tempWebsites = tempWebsites.filter(site => site.status?.toLowerCase() === filterStatus.toLowerCase());
        }

        if (sortBy === 'recent') {
            tempWebsites.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
        } else if (sortBy === 'name') {
            tempWebsites.sort((a, b) => a.name.localeCompare(b.name));
        }

        return tempWebsites;
    }, [websites, searchQuery, sortBy, filterStatus]);

    const handleCreateSite = async () => {
        const name = newSiteName.trim();
        if (!name || isCreatingSite) return;

        if (name.length < 2) {
            toast({
                title: 'Name too short',
                description: 'Project name must be at least 2 characters.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsCreatingSite(true);
            const id = await createWebsite(name, selectedTemplate);
            setIsDialogOpen(false);
            setNewSiteName('');
            setSelectedTemplate('blank');
            navigate(`/builder/${id}`);
        } catch (err: any) {
            const apiMessage =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.[0]?.message ||
                (Array.isArray(err?.response?.data?.errors)
                    ? err.response.data.errors.map((e: any) => e.message || e).join(', ')
                    : null) ||
                err?.message ||
                'Please try again.';
            toast({
                title: 'Could not create site',
                description: apiMessage,
                variant: 'destructive',
            });
        } finally {
            setIsCreatingSite(false);
        }
    };

    return (
        <div className="admin-page space-y-6">
            {/* Header bar — match admin Templates style */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />

                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
                    <div className="flex min-w-0 items-center gap-3">
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-3xl text-white/80 hover:bg-white/10 hover:text-white hover:scale-100"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        )}
                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                                Good day,{' '}
                                <span className="font-semibold text-white">{userName.split(' ')[0]}</span>
                            </h2>
                            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                {websites.filter(w => w.status?.toLowerCase() !== 'deleted').length} active projects
                            </p>
                        </div>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                onClick={() => setIsDialogOpen(true)}
                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#0F172A] shadow-none transition-colors hover:bg-slate-100 md:h-11 md:w-auto md:text-sm"
                            >
                                <Plus className="h-4 w-4" /> New Project
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-5xl rounded-3xl sm:rounded-3xl border-0 p-0 overflow-hidden bg-white shadow-xl gap-0">
                            <DialogTitle className="sr-only">Create New Website</DialogTitle>
                            <div className="flex flex-col md:flex-row h-[700px] w-full">
                                <div className="w-full md:w-1/3 bg-white p-10 flex flex-col pt-12 border-r border-[#E8E8E8] relative z-10 rounded-l-3xl">
                                    <div>
                                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F4F4F5] text-[#0F172A]">
                                            <LayoutTemplate className="h-7 w-7" />
                                        </div>
                                        <h2 className="mb-3 text-[2rem] font-bold leading-none tracking-tight text-[#0F172A]">Create a Project</h2>
                                        <p className="mb-10 text-sm font-medium leading-relaxed text-[#747781]">
                                            Give your masterpiece a name and select a starting template to kick things off.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex-1 space-y-4">
                                        <div>
                                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">Project Name</label>
                                            <Input
                                                placeholder="e.g., My Awesome Site"
                                                value={newSiteName}
                                                onChange={(e) => setNewSiteName(e.target.value)}
                                                minLength={2}
                                                maxLength={100}
                                                className="h-12 rounded-xl border-[#E8E8E8] bg-[#F4F4F5] px-4 font-medium text-[#0F172A] focus:border-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#0F172A]/10"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                            />
                                            {newSiteName.trim().length > 0 && newSiteName.trim().length < 2 && (
                                                <p className="mt-2 text-xs text-red-500">Name must be at least 2 characters.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-auto border-t border-[#E8E8E8] pt-8">
                                        <Button
                                            onClick={handleCreateSite}
                                            disabled={newSiteName.trim().length < 2 || isCreatingSite}
                                            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] text-base font-bold text-white shadow-none hover:bg-[#1E293B] hover:scale-100 disabled:opacity-50"
                                        >
                                            {isCreatingSite ? (
                                                <><Loader2 className="h-5 w-5 animate-spin" /> Creating...</>
                                            ) : (
                                                <>Start Building <ArrowRight className="h-5 w-5" /></>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="w-full md:w-2/3 overflow-y-auto bg-[#F4F4F5] p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <div className="mb-8 flex items-center justify-between">
                                        <h3 className="text-xl font-bold tracking-tight text-[#0F172A]">Select a Template</h3>
                                        <span className="rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#747781]">
                                            {dbTemplates.length} options
                                        </span>
                                    </div>

                                    {dbTemplates.length > 0 && (
                                        <>
                                            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#787778]">Custom Templates</p>
                                            <div className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-2">
                                                {dbTemplates.map((tpl) => (
                                                    <div
                                                        key={tpl.id}
                                                        onClick={() => setSelectedTemplate(tpl.id)}
                                                        className={cn(
                                                            'group/template-dialog-card relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white transition-colors',
                                                            selectedTemplate === tpl.id
                                                                ? 'border-[#0F172A] shadow-md'
                                                                : 'border-[#E8E8E8] hover:border-[#CBD5E1]'
                                                        )}
                                                    >
                                                        <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F4F5]">
                                                            {tpl.image ? (
                                                                <img
                                                                    src={tpl.image}
                                                                    alt={tpl.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full flex-col items-center justify-center bg-[#F4F4F5]">
                                                                    <LayoutTemplate className="h-12 w-12 text-slate-300" />
                                                                    <p className="mt-2 text-xs font-medium text-slate-400">{tpl.category || 'Template'}</p>
                                                                </div>
                                                            )}
                                                            <AnimatePresence>
                                                                {selectedTemplate === tpl.id && (
                                                                    <motion.div
                                                                        initial={{ scale: 0, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        exit={{ scale: 0, opacity: 0 }}
                                                                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A] shadow-lg"
                                                                    >
                                                                        <CheckCircle className="h-5 w-5 text-white" />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                        <div className="relative z-10 flex items-center gap-4 border-t border-[#E8E8E8] bg-white p-5">
                                                            <div className={cn(
                                                                'flex h-11 w-11 items-center justify-center rounded-2xl',
                                                                selectedTemplate === tpl.id ? 'bg-[#0F172A] text-white' : 'bg-[#F4F4F5] text-[#747781]'
                                                            )}>
                                                                <LayoutTemplate className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-base font-bold leading-tight text-[#0F172A]">{tpl.name}</h4>
                                                                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#787778]">{tpl.category || 'Custom'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
                    <Input
                        placeholder="Search projects..."
                        className="h-9 w-full rounded-full border-[#E5E7EB] bg-white pl-9 text-sm text-[#0F172A] shadow-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 w-full rounded-full border-[#E5E7EB] bg-white shadow-sm md:w-[160px]">
                        <ListFilter className="mr-2 h-4 w-4 text-[#787778]" />
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#E8E8E8] bg-white shadow-lg">
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {['all', 'draft', 'published', 'deleted'].map((status) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'outline'}
                            className={cn(
                                'h-8 rounded-full border px-3 text-xs font-semibold capitalize shadow-none transition-colors hover:scale-100 active:scale-100 sm:h-9 sm:px-3.5 sm:text-[13px]',
                                filterStatus === status
                                    ? 'border-[#0F172A] bg-[#0F172A] text-white hover:bg-[#1E293B] hover:text-white'
                                    : 'border-[#E5E7EB] bg-white text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                            )}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {websites.filter(w => w.status?.toLowerCase() !== 'deleted').length === 0 ? (
                <EmptyState onAction={() => setIsDialogOpen(true)} />
            ) : (
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F3F4F6] p-4 sm:p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredWebsites.map((site, index) => (
                            <WebsiteCard
                                key={site.id}
                                site={site}
                                index={index}
                                dbTemplates={dbTemplates}
                                onDelete={() => deleteWebsite(site.id)}
                                onEdit={() => navigate(`/builder/${site.id}`)}
                                onViewMessages={() => navigate(`/dashboard/messages?websiteId=${site.id}`)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export { WebsiteCard, EmptyState };
export default UserDashboard;
