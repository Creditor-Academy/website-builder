import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '@/layouts/DashboardLayout';
import {
    Plus, Globe, Trash2,
    CheckCircle, Search,
    ArrowRight, LayoutTemplate, Menu, ListFilter,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
    DashboardCard,
    DashboardCardMedia,
    DashboardCardBody,
    DashboardCardTitle,
    DashboardCardDescription,
    DashboardCardFooter,
    DashboardCardBadge,
    DashboardCardOverlay,
    DashboardCardHoverTint,
    DashboardCardPrimaryAction,
    DashboardCardSecondaryAction,
    dashboardCardActionSecondaryClass,
    dashboardCardActionDangerClass,
} from '@/components/dashboard/DashboardCard';
import { templatesList } from '@/lib/templates';
import templateApi from '@/api/templates';
import { updateUserProfile } from "../api/user";

const WebsiteCard = ({ site, onDelete, onEdit, onViewMessages, dbTemplates = [] }: any) => {
    const activeTemplateId = site.templateId || site.sourceTemplateId || 'blank';
    const localTemplate = templatesList.find((t) => t.id === activeTemplateId);
    const dbTemplate = dbTemplates.find(
        (t: any) => t.id === activeTemplateId || t.id === site.sourceTemplateId
    ) || null;
    const thumbnailImage = localTemplate?.image || dbTemplate?.image || null;
    const rawCategory = dbTemplate?.category || localTemplate?.category;
    const category = rawCategory && rawCategory !== 'All' ? rawCategory : (site.status || 'Project');
    const description =
        dbTemplate?.description
        || localTemplate?.desc
        || (site.lastEdited
            ? `Last edited ${format(new Date(site.lastEdited), 'MMM d, p')}`
            : 'A website project ready to customize in the editor.');

    return (
        <DashboardCard interactive onClick={onEdit}>
            <DashboardCardMedia>
                {site?.pages?.[0]?.sections?.length > 0 ? (
                    <SiteThumbnail site={site} className="absolute inset-0 w-full h-full" />
                ) : thumbnailImage ? (
                    <img
                        src={thumbnailImage}
                        alt={site.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#eae7e9]">
                        <LayoutTemplate className="w-12 h-12 text-[#76777d]" />
                        <p className="text-xs text-[#76777d] font-medium mt-2">{category}</p>
                    </div>
                )}

                <DashboardCardBadge>{category}</DashboardCardBadge>
                <DashboardCardHoverTint />
                <DashboardCardOverlay>
                    <Button
                        className={dashboardCardActionSecondaryClass}
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    >
                        Edit
                    </Button>
                    <Button
                        className={dashboardCardActionDangerClass}
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </DashboardCardOverlay>
            </DashboardCardMedia>

            <DashboardCardBody>
                <DashboardCardTitle>{site.name}</DashboardCardTitle>
                <DashboardCardDescription>{description}</DashboardCardDescription>
                <DashboardCardFooter>
                    <DashboardCardSecondaryAction
                        onClick={(e) => { e.stopPropagation(); onViewMessages(); }}
                    >
                        Configure
                    </DashboardCardSecondaryAction>
                    <DashboardCardPrimaryAction
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    >
                        Open Editor
                    </DashboardCardPrimaryAction>
                </DashboardCardFooter>
            </DashboardCardBody>
        </DashboardCard>
    );
};

const EmptyState = ({ onAction }) => (
    <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white p-12 text-center transition-all hover:border-primary/20 hover:bg-slate-50/50">
        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6">
            <Globe className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Your creative journey starts here</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Every great brand starts with a single page. Build yours with our visual canvas.
        </p>
        <Button size="lg" className="mt-6 rounded-full px-8 gap-2 shadow-lg shadow-primary/20" onClick={onAction}>
            <Plus className="w-5 h-5" /> Create Your First Site
        </Button>
    </div>
);

// ΓöÇΓöÇΓöÇ UserDashboard ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const UserDashboard = () => {
    const navigate = useNavigate();
    const websites = useBuilderStore((state) => state.websites) ?? [];
    const fetchWebsites = useBuilderStore((state) => state.fetchWebsites);
    const createWebsite = useBuilderStore((state) => state.createWebsite);
    const deleteWebsite = useBuilderStore((state) => state.deleteWebsite);
    const isMobile = useIsMobile();
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || 'null');
        } catch {
            return null;
        }
    })();
    const {
        isAdmin = false,
        setIsSidebarOpen = () => {},
        userName = 'User',
        setUserName = () => {},
    } = useOutletContext<DashboardOutletContext>() || {};
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

    // Γ£à Listen for userUpdated event (userName itself is kept in sync by DashboardLayout)
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

    const siteList = Array.isArray(websites) ? websites : [];

    const filteredWebsites = React.useMemo(() => {
        let tempWebsites = siteList.filter((site) =>
            site.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filterStatus === 'all') {
            tempWebsites = tempWebsites.filter((site) => site.status?.toLowerCase() !== 'deleted');
        } else {
            tempWebsites = tempWebsites.filter((site) => site.status?.toLowerCase() === filterStatus.toLowerCase());
        }

        if (sortBy === 'recent') {
            tempWebsites.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
        } else if (sortBy === 'name') {
            tempWebsites.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        return tempWebsites;
    }, [siteList, searchQuery, sortBy, filterStatus]);

    const handleCreateSite = async () => {
        if (!newSiteName.trim() || isCreatingSite) return;
        try {
            setIsCreatingSite(true);
            const id = await createWebsite(newSiteName, selectedTemplate);
            setIsDialogOpen(false);
            setNewSiteName('');
            setSelectedTemplate('blank');
            navigate(`/builder/${id}`);
        } catch (err: any) {
            toast({
                title: 'Could not create site',
                description: err?.message || 'Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsCreatingSite(false);
        }
    };

    return (
        <>
            {/* ΓöÇΓöÇ User dashboard header ΓöÇΓöÇ */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <Button variant="ghost" size="icon" className="lg:hidden -ml-2"
                            onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                    )}
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Good day, {userName.split(' ')[0]}
                        </h2>
                        <p className="text-slate-400 text-sm mt-0.5">
                            {siteList.filter((w) => w.status?.toLowerCase() !== 'deleted').length} active projects
                        </p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogTrigger asChild>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm active:scale-[0.98] transition-all shrink-0"
                        >
                            <Plus className="w-4 h-4" /> New Project
                        </button>
                    </DialogTrigger>
                        <DialogContent className="sm:max-w-5xl rounded-[2rem] p-0 overflow-hidden bg-white border-slate-100 shadow-2xl">
                            <DialogTitle className="sr-only">Create New Website</DialogTitle>
                            <div className="flex flex-col md:flex-row h-[700px] w-full">
                                <div className="w-full md:w-1/3 bg-white p-10 flex flex-col pt-12 border-r border-slate-100 relative z-10 shadow-xl rounded-l-[2rem]">
                                    <div>
                                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                            <LayoutTemplate className="w-7 h-7" />
                                        </div>
                                        <h2 className="text-[2rem] font-black text-slate-900 tracking-tight mb-3 leading-none">Create a Project</h2>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                                            Give your masterpiece a name and select a starting template to kick things off.
                                        </p>
                                    </div>
                                    <div className="mt-4 space-y-4 flex-1">
                                        <div className="relative group/input-wrapper">
                                            <label className="text-xs font-bold text-slate-800 mb-2 block uppercase tracking-wider">Project Name</label>
                                            <Input
                                                placeholder="e.g., My Awesome Site"
                                                value={newSiteName}
                                                onChange={(e) => setNewSiteName(e.target.value)}
                                                className="h-14 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-slate-900 shadow-inner"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-8 border-t border-slate-100">
                                        <Button
                                            onClick={handleCreateSite}
                                            disabled={!newSiteName.trim() || isCreatingSite}
                                            className="w-full h-14 font-bold text-lg flex items-center justify-center gap-2 group/button-create-site active:scale-[0.98] rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 transition-all">
                                            {isCreatingSite ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> Creating...
                                                </>
                                            ) : (
                                                <>Start Building
                                                <ArrowRight className="w-5 h-5 group-hover/button-create-site:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="w-full md:w-2/3 bg-slate-50 p-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Select a Template</h3>
                                        <span className="text-xs font-bold text-slate-500 px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm uppercase tracking-wider">
                                            {dbTemplates.length} options
                                        </span>
                                    </div>



                                    {/* DB Templates */}
                                    {dbTemplates.length > 0 && (
                                        <>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Custom Templates</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                                                {dbTemplates.map((tpl) => (
                                                    <div
                                                        key={tpl.id}
                                                        onClick={() => setSelectedTemplate(tpl.id)}
                                                        className={cn(
                                                            "group/template-dialog-card cursor-pointer rounded-[1.5rem] overflow-hidden transition-all duration-300 relative border-[3px] bg-white flex flex-col",
                                                            selectedTemplate === tpl.id
                                                                ? "border-blue-500 shadow-[0_10px_40px_rgba(59,130,246,0.15)] scale-[1.02]"
                                                                : "border-transparent border-slate-200 hover:border-blue-300 hover:shadow-xl opacity-80 hover:opacity-100"
                                                        )}
                                                    >
                                                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                                            {tpl.image ? (
                                                                <img
                                                                    src={tpl.image}
                                                                    alt={tpl.name}
                                                                    className={cn("w-full h-full object-cover transition-transform duration-700", selectedTemplate === tpl.id ? "scale-105" : "group-hover/template-dialog-card:scale-105")}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                                                                    <LayoutTemplate className="w-12 h-12 text-indigo-200" />
                                                                    <p className="text-xs text-indigo-300 font-medium mt-2">{tpl.category || 'Template'}</p>
                                                                </div>
                                                            )}
                                                            <AnimatePresence>
                                                                {selectedTemplate === tpl.id && (
                                                                    <motion.div
                                                                        initial={{ scale: 0, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        exit={{ scale: 0, opacity: 0 }}
                                                                        className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                                                                    >
                                                                        <CheckCircle className="w-5 h-5 text-white" />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover/template-dialog-card:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                                <p className="text-white font-semibold text-sm drop-shadow-md">{tpl.description || ''}</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 flex items-center gap-4 bg-white relative z-10 border-t border-slate-100">
                                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm", selectedTemplate === tpl.id ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500")}>
                                                                <LayoutTemplate className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className={cn("font-bold text-lg transition-colors leading-tight", selectedTemplate === tpl.id ? "text-slate-900" : "text-slate-700")}>{tpl.name}</h4>
                                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{tpl.category || 'Custom'}</p>
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

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-10 w-full h-12 bg-white border-slate-200 rounded-full shadow-md shadow-slate-200/50 focus:ring-primary/20 focus:shadow-lg focus:shadow-slate-300/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[160px] h-12 rounded-full bg-white border-slate-200 shadow-md shadow-slate-200/50 focus:ring-primary/20 focus:shadow-lg focus:shadow-slate-300/50 transition-all flex items-center justify-between px-4">
                        <ListFilter className="w-4 h-4 text-slate-400" />
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    {['all', 'draft', 'published', 'deleted'].map((status) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'outline'}
                            className={cn(
                                "rounded-full h-10 px-4 text-sm font-semibold capitalize",
                                filterStatus === status
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700",
                                "transition-all duration-200"
                            )}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {siteList.filter((w) => w.status?.toLowerCase() !== 'deleted').length === 0 ? (
                <EmptyState onAction={() => setIsDialogOpen(true)} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            )}
        </>
    );
};

export { WebsiteCard, EmptyState };
export default UserDashboard;
