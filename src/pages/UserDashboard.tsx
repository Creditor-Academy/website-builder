import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import type { DashboardOutletContext } from '@/layouts/DashboardLayout';
import {
    Plus, Globe, MoreVertical, Trash2,
    CheckCircle, Search, Image as ImageIcon,
    ArrowRight, LayoutTemplate, ListFilter,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SiteThumbnail } from '@/components/dashboard/SiteThumbnail';
import { templatesList } from '@/lib/templates';
import templateApi from '@/api/templates';
import {
    DashboardPageShell,
    dashboardFilterPillClass,
    dashboardSearchInputClass,
    dashboardFilterScrollClass,
    dashboardToolbarClass,
} from '@/components/dashboard/DashboardPageShell';
import {
    DashboardCard,
    DashboardCardMedia,
    DashboardCardBody,
    DashboardCardTitle,
    DashboardCardDescription,
    DashboardCardFooter,
    DashboardCardBadge,
    DashboardCardHoverTint,
    DashboardCardPrimaryAction,
    DashboardCardSecondaryAction,
} from '@/components/dashboard/DashboardCard';

const WebsiteCard = ({ site, onDelete, onEdit, onViewMessages, dbTemplates = [] }: any) => {
    const activeTemplateId = site.templateId || site.sourceTemplateId || 'blank';
    const localTemplate = templatesList.find((t) => t.id === activeTemplateId);
    const dbTemplate = dbTemplates.find(
        (t: any) => t.id === activeTemplateId || t.id === site.sourceTemplateId
    ) || null;
    const thumbnailImage = localTemplate?.image || dbTemplate?.image || null;

    const deployments = site.builderMeta?.deployments || [];
    const latestDeployment = deployments.length > 0 ? deployments[deployments.length - 1] : null;
    const publishedUrl = latestDeployment?.url || site.publishedUrl || (site.subdomain ? `https://${site.subdomain}.buildora.lmsathena.com` : null);

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
                        <Globe className="w-12 h-12 text-[#76777d]" />
                        <p className="text-xs text-[#76777d] font-medium mt-2">Blank project</p>
                    </div>
                )}

                <DashboardCardBadge>{site.status || 'Draft'}</DashboardCardBadge>
                <DashboardCardHoverTint />
            </DashboardCardMedia>

            <DashboardCardBody>
                <div className="flex items-start justify-between gap-2 mb-1">
                    <DashboardCardTitle className="mb-1 flex-1 min-w-0">{site.name}</DashboardCardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 text-[#76777d] hover:text-[#1b1b1d] hover:bg-[#eae7e9] rounded-lg"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-lg p-2 border-[#c6c6cd] bg-[#fcf8fa]">
                            <DropdownMenuItem
                                className="rounded-lg gap-2 cursor-pointer focus:bg-[#eae7e9]"
                                onSelect={(e) => { e.preventDefault(); onEdit(); }}
                            >
                                Open Editor
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="rounded-lg gap-2 cursor-pointer text-[#ba1a1a] focus:bg-[#ffdad6] focus:text-[#93000a]"
                                onSelect={(e) => { e.preventDefault(); void onDelete(); }}
                            >
                                <Trash2 className="w-4 h-4" /> Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <DashboardCardDescription>
                    {publishedUrl && site.status === 'Published' ? (
                        <span className="truncate block" title={publishedUrl}>
                            {publishedUrl.replace(/^https?:\/\//, '')}
                        </span>
                    ) : (
                        <span>Last edited {format(new Date(site.lastEdited), 'MMM d, yyyy')}</span>
                    )}
                </DashboardCardDescription>

                <DashboardCardFooter>
                    <DashboardCardSecondaryAction
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewMessages();
                        }}
                    >
                        Messages
                    </DashboardCardSecondaryAction>
                    <DashboardCardPrimaryAction
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        Open Editor
                    </DashboardCardPrimaryAction>
                </DashboardCardFooter>
            </DashboardCardBody>
        </DashboardCard>
    );
};

const EmptyState = ({ onAction }: { onAction: () => void }) => (
    <div className="h-64 flex flex-col items-center justify-center gap-4 border border-dashed border-[#c6c6cd] rounded-lg bg-[#f6f3f5]">
        <Globe className="w-12 h-12 text-[#76777d]" />
        <div className="text-center px-8">
            <p className="text-[#1b1b1d] text-base font-semibold">Your creative journey starts here</p>
            <p className="text-[#45464d] text-sm font-medium mt-1">
                Every great brand starts with a single page. Build yours with our visual canvas.
            </p>
        </div>
        <Button
            onClick={onAction}
            className="rounded-lg bg-[#131b2e] text-white px-6 h-10 text-sm font-semibold shadow-md hover:bg-[#252f4a]"
        >
            <Plus className="w-4 h-4 mr-2" /> Create Your First Site
        </Button>
    </div>
);

// ─── UserDashboard ────────────────────────────────────────────────────────────

const UserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
    const { websites, fetchWebsites, createWebsite, deleteWebsite } = useBuilderStore();
    const { isAdmin, userName } = useOutletContext<DashboardOutletContext>();

    const { toast } = useToast();

    const [newSiteName, setNewSiteName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [sortBy, setSortBy] = useState('recent');
    const [filterStatus, setFilterStatus] = useState('all');

    const [dbTemplates, setDbTemplates] = useState<any[]>([]);
    const [isCreatingSite, setIsCreatingSite] = useState(false);

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

    const handleDialogClose = (open: boolean) => {
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

    const activeCount = websites.filter(w => w.status?.toLowerCase() !== 'deleted').length;
    const userFirstName = (userName || 'User').split(' ')[0];

    return (
        <DashboardPageShell
            basePath={basePath}
            title="My Projects"
            pageLabel="Projects"
            description={`Good day, ${userFirstName} — you have ${activeCount} active project${activeCount === 1 ? '' : 's'}.`}
            actions={
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            className="flex items-center justify-center gap-2 bg-[#000000] hover:bg-[#000000]/90 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" /> New Project
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-5xl rounded-2xl sm:rounded-[2rem] p-0 overflow-hidden bg-[#fcf8fa] border-[#c6c6cd] shadow-2xl max-h-[95vh]">
                        <DialogTitle className="sr-only">Create New Website</DialogTitle>
                        <div className="flex flex-col md:flex-row max-h-[95vh] md:h-[700px] w-full overflow-hidden">
                            <div className="w-full md:w-1/3 bg-[#fcf8fa] p-6 sm:p-10 flex flex-col pt-8 sm:pt-12 border-b md:border-b-0 md:border-r border-[#c6c6cd] relative z-10 shadow-xl md:rounded-l-[2rem] shrink-0">
                                <div>
                                    <div className="w-14 h-14 bg-[#dedfeb] text-[#131b2e] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <LayoutTemplate className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-2xl sm:text-[2rem] font-black text-[#000000] tracking-tight mb-3 leading-none">
                                        Create a Project
                                    </h2>
                                    <p className="text-[#45464d] font-medium text-sm leading-relaxed mb-10">
                                        Give your masterpiece a name and select a starting template to kick things off.
                                    </p>
                                </div>
                                <div className="mt-4 space-y-4 flex-1">
                                    <div>
                                        <label className="text-xs font-bold text-[#1b1b1d] mb-2 block uppercase tracking-wider">
                                            Project Name
                                        </label>
                                        <Input
                                            placeholder="e.g., My Awesome Site"
                                            value={newSiteName}
                                            onChange={(e) => setNewSiteName(e.target.value)}
                                            className="h-12 sm:h-14 bg-white border-[#c6c6cd] rounded-xl px-4 focus:ring-2 focus:ring-black/20 focus:border-black transition-all font-medium text-[#000000]"
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                        />
                                    </div>
                                </div>
                                <div className="mt-auto pt-8 border-t border-[#c6c6cd]">
                                    <Button
                                        onClick={handleCreateSite}
                                        disabled={!newSiteName.trim() || isCreatingSite}
                                        className="w-full h-12 sm:h-14 font-bold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] rounded-lg bg-[#000000] hover:bg-[#000000]/90 text-white shadow-lg transition-all"
                                    >
                                        {isCreatingSite ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
                                        ) : (
                                            <>Start Building <ArrowRight className="w-5 h-5" /></>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 bg-[#f6f3f5] p-4 sm:p-10 overflow-y-auto flex-1 min-h-0">
                                <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
                                    <h3 className="text-lg sm:text-xl font-bold text-[#000000] tracking-tight">
                                        Select a Template
                                    </h3>
                                    <span className="text-xs font-bold text-[#45464d] px-3 sm:px-4 py-1.5 bg-white rounded-full border border-[#c6c6cd] shadow-sm uppercase tracking-wider shrink-0">
                                        {dbTemplates.length} options
                                    </span>
                                </div>

                                {dbTemplates.length > 0 ? (
                                    <>
                                        <p className="text-xs font-bold text-[#76777d] uppercase tracking-wider mb-4">
                                            Custom Templates
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-20">
                                            {dbTemplates.map((tpl) => (
                                                <DashboardCard
                                                    key={tpl.id}
                                                    interactive
                                                    onClick={() => setSelectedTemplate(tpl.id)}
                                                    className={cn(
                                                        selectedTemplate === tpl.id && 'ring-2 ring-[#131b2e] scale-[1.02]'
                                                    )}
                                                >
                                                    <DashboardCardMedia aspect className="h-auto aspect-[4/3]">
                                                        {tpl.image ? (
                                                            <img
                                                                src={tpl.image}
                                                                alt={tpl.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#eae7e9]">
                                                                <LayoutTemplate className="w-12 h-12 text-[#76777d]" />
                                                                <p className="text-xs text-[#45464d] font-medium mt-2">
                                                                    {tpl.category || 'Template'}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {tpl.category && (
                                                            <DashboardCardBadge>{tpl.category}</DashboardCardBadge>
                                                        )}
                                                        <AnimatePresence>
                                                            {selectedTemplate === tpl.id && (
                                                                <motion.div
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    exit={{ scale: 0, opacity: 0 }}
                                                                    className="absolute top-4 left-4 w-8 h-8 bg-[#131b2e] rounded-full flex items-center justify-center shadow-lg z-10"
                                                                >
                                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </DashboardCardMedia>
                                                    <DashboardCardBody className="p-4">
                                                        <DashboardCardTitle className="text-lg">{tpl.name}</DashboardCardTitle>
                                                        {tpl.description && (
                                                            <p className="text-[14px] text-[#45464d] line-clamp-2 mt-1">
                                                                {tpl.description}
                                                            </p>
                                                        )}
                                                    </DashboardCardBody>
                                                </DashboardCard>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-[#76777d]">
                                        <ImageIcon className="w-12 h-12 mb-3 opacity-40" />
                                        <p className="text-sm">No templates available — start from a blank project.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        >
            <div className={dashboardToolbarClass}>
                <div className="relative flex-1 w-full min-w-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" />
                    <Input
                        placeholder="Search projects..."
                        className={dashboardSearchInputClass}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 rounded-lg bg-white border-[#c6c6cd]">
                        <ListFilter className="w-4 h-4 text-[#76777d]" />
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg bg-white border-[#c6c6cd]">
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>

                <div className={dashboardFilterScrollClass}>
                    {['all', 'draft', 'published', 'deleted'].map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFilterStatus(status)}
                            className={dashboardFilterPillClass(filterStatus === status)}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {activeCount === 0 ? (
                <EmptyState onAction={() => setIsDialogOpen(true)} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredWebsites.map((site) => (
                        <WebsiteCard
                            key={site.id}
                            site={site}
                            dbTemplates={dbTemplates}
                            onDelete={async () => {
                                await deleteWebsite(site.id);
                                toast({ title: 'Project deleted', description: `"${site.name}" was moved to deleted.` });
                            }}
                            onEdit={() => navigate(`/builder/${site.id}`)}
                            onViewMessages={() => navigate(`${basePath}/messages?websiteId=${site.id}`)}
                        />
                    ))}
                </div>
            )}
        </DashboardPageShell>
    );
};

export { WebsiteCard, EmptyState };
export default UserDashboard;
