import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Plus, Globe, MoreVertical, Edit2, Trash2,
    Layout, Settings, LogOut, Clock, CheckCircle,
    FileText, Search, Sparkles, Zap, Files, Users, Activity, Menu, X, ShieldCheck,
    Building2, ShoppingBag, LayoutTemplate, ArrowRight, ListFilter, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import GradientButton from '@/components/ui/GradientButton';

// Import template assets
import business from "../assets/Bussiness.jpg";
import ecommerce from "../assets/Ecomm.jpg";
import portfolio from "../assets/Portfolio.jpg";
import school from "../assets/School.jpg";
import learning from "../assets/Learning.jpg";
import cta from "../assets/CTA.png";
import placeholder from "../assets/ui_showcase_1.png";

export const templatesList = [
    { id: 'blank', name: 'Blank Canvas', desc: 'Start from scratch with a clean slate', icon: FileText, color: 'bg-slate-100 text-slate-600', image: placeholder, category: 'starter', features: ['Complete creative freedom', 'No predefined structure', 'Perfect for custom designs'] },
    { id: 'business', name: 'Business', desc: 'Professional corporate layout for companies', icon: Building2, color: 'bg-blue-100 text-blue-600', image: business, category: 'business', features: ['Hero section', 'Services showcase', 'Contact forms', 'Professional design'] },
    { id: 'portfolio', name: 'Portfolio', desc: 'Showcase your creative work beautifully', icon: Layout, color: 'bg-purple-100 text-purple-600', image: portfolio, category: 'creative', features: ['Gallery layouts', 'Project showcases', 'About section', 'Contact portfolio'] },
    { id: 'ecommerce', name: 'E-commerce', desc: 'Modern online store with shopping features', icon: ShoppingBag, color: 'bg-green-100 text-green-600', image: ecommerce, category: 'business', features: ['Product catalog', 'Shopping cart', 'Payment integration', 'Product pages'] },
    { id: 'consultant', name: 'Consultant', desc: 'Expert advisory layout for professionals', icon: Users, color: 'bg-amber-100 text-amber-600', image: cta, category: 'professional', features: ['Services section', 'Testimonials', 'Booking forms', 'Expert profile'] },
    { id: 'agencies', name: 'Agencies', desc: 'Creative & marketing agency layout', icon: Globe, color: 'bg-indigo-100 text-indigo-600', image: learning, category: 'business', features: ['Growth metrics', 'Lead generation', 'Service tiers', 'Client logos'] },
    { id: 'coaching', name: 'Coaching', desc: 'Course & mentorship layout', icon: Sparkles, color: 'bg-rose-100 text-rose-600', image: school, category: 'professional', features: ['Curriculum overview', 'Student success', 'Enrollment flow', 'Mentor profile'] },
];

// OverviewCard component
const OverviewCard = ({ title, value, icon, description, iconBgClass, iconColorClass }) => (
    <Card className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4">
            <CardTitle className="text-base font-semibold text-slate-700">{title}</CardTitle>
            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", iconBgClass, iconColorClass)}>{icon}</div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-slate-900">{value}</div>
            {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
        </CardContent>
    </Card>
);

// NavItem — supports router Link + active state
const NavItem = ({ icon, label, to, activeColor = 'text-white', hoverBg = 'hover:bg-slate-700', hoverText = 'hover:text-white', defaultText = 'text-slate-300' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = location.pathname === to;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent default button behavior
        navigate(to);
    };

    return (
        <Button
            variant="ghost"
            className={`w-full justify-start gap-2 py-2 px-3 text-sm transition-all duration-300 group rounded-full
                ${isActive ? `bg-gradient-to-r from-purple-600 to-indigo-600 ${activeColor} font-semibold shadow-lg shadow-purple-500/30` : `${defaultText} ${hoverText} ${hoverBg}`}
            `}
            onClick={handleClick}
        >
            <span className={`transition-colors duration-300 ${isActive ? activeColor : `${defaultText} ${hoverText}`}`}>{icon}</span>
            {label}
        </Button>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { websites, createWebsite, deleteWebsite } = useBuilderStore();
    const isMobile = useIsMobile();

    // FIX: Removed duplicate useState declarations for isDialogOpen, newSiteName, searchQuery
    const [newSiteName, setNewSiteName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'name'
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'draft', 'published'

    const adminRoutes = [
        '/dashboard/users',
        '/dashboard/websites',
        '/dashboard/deployment',
        '/dashboard/settings',
    ];

    useEffect(() => {
        if (!isAdmin && adminRoutes.includes(location.pathname)) {
            navigate('/dashboard');
        }
    }, [isAdmin, location.pathname, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
    };

    const handleDialogClose = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setNewSiteName('');
            setSelectedTemplate('blank');
        }
    };

    const filteredWebsites = React.useMemo(() => {
        let tempWebsites = websites.filter(site =>
            site.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filterStatus !== 'all') {
            tempWebsites = tempWebsites.filter(site => site.status.toLowerCase() === filterStatus);
        }

        if (sortBy === 'recent') {
            tempWebsites.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
        } else if (sortBy === 'name') {
            tempWebsites.sort((a, b) => a.name.localeCompare(b.name));
        }

        return tempWebsites;
    }, [websites, searchQuery, sortBy, filterStatus]);

    const handleCreateSite = () => {
        if (newSiteName.trim()) {
            const id = createWebsite(newSiteName, selectedTemplate);
            setIsDialogOpen(false);
            setNewSiteName('');
            setSelectedTemplate('blank');
            navigate(`/builder/${id}`);
        }
    };

    return (
        <div className="h-screen bg-[#f8fafc] flex font-sans selection:bg-primary/10 relative overflow-hidden">
            <Helmet>
                <title>Dashboard | Buildora</title>
            </Helmet>

            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-purple-900 to-indigo-950 border-r border-slate-700 flex flex-col justify-between z-50 rounded-tr-3xl rounded-br-3xl",
                    "lg:static lg:flex",
                    isMobile ? "transition-transform duration-300 ease-in-out" : "",
                    isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
                )}
            >
                <div className="p-4 shrink-0">
                    <div className="flex items-center gap-2.5 px-2">
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">
                            Buildora
                        </h1>
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto lg:hidden text-white hover:bg-slate-700 hover:text-white"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                <nav className="flex-1 px-4 py-1 space-y-0.5 overflow-y-auto ">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-1">Main Menu</p>
                    {!isAdmin && (
                        <NavItem icon={<Globe className="w-4 h-4" />} label="Dashboard" to="/dashboard" />
                    )}
                    <NavItem icon={<Layout className="w-4 h-4" />} label="Templates" to="/dashboard/templates" />
                    <NavItem icon={<FileText className="w-4 h-4" />} label="Assets" to="/dashboard/assets" />
                    {isAdmin && (
                        <div className="pt-1">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-1">System</p>
                            <NavItem icon={<Users className="w-4 h-4" />} label="Users" to="/dashboard/users" activeColor="text-white" />
                            <NavItem icon={<Layout className="w-4 h-4" />} label="Websites" to="/dashboard/websites" activeColor="text-white" />
                            <NavItem icon={<Activity className="w-4 h-4" />} label="Deployment Monitoring" to="/dashboard/deployment" activeColor="text-white" />
                            <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" to="/dashboard/settings" activeColor="text-white" />
                        </div>
                    )}
                </nav>

                <div className="p-4 space-y-2 shrink-0">
                    <div className="bg-white/5 rounded-2xl p-3 border border-slate-700 backdrop-blur-sm">
                        <p className="text-xs font-semibold text-slate-100 mb-1">Free Plan</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mb-1">
                            <div className="bg-indigo-400 h-full w-1/3 rounded-full" />
                        </div>
                        <p className="text-[10px] text-slate-400">3 of 10 projects used</p>
                    </div>

                    <GradientButton
                        className="w-full justify-start py-2 px-3 text-sm"
                        onClick={() => setIsAdmin(!isAdmin)}
                        icon={isAdmin
                            ? <ShieldCheck className="w-4 h-4 text-purple-400" />
                            : <Users className="w-4 h-4" />
                        }
                    >
                        {isAdmin ? "Admin Mode On" : "Switch to Admin Mode"}
                    </GradientButton>

                    <div
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                        onClick={handleLogout}
                    >
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm">JD</div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-800 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">John Doe</p>
                            <p className="text-xs text-slate-400 truncate">Pro Plan</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
                        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">

                {location.pathname === '/dashboard' && !isAdmin ? (
                    <>
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                            <div className="flex items-center gap-4">
                                {isMobile && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden"
                                        onClick={() => setIsSidebarOpen(true)}
                                    >
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                )}
                                <div>
                                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Project Hub</h2>
                                    <p className="text-lg text-slate-600 flex items-center gap-2 mt-1">
                                        Welcome back! You have <span className="text-indigo-600 font-medium">{websites.length} active projects</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                    <DialogTrigger asChild>
                                        <GradientButton className="h-12 px-6 text-base w-auto" icon={<Plus className="w-5 h-5" />}> 
                                            New Project
                                        </GradientButton>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-5xl rounded-[2.5rem] p-0 overflow-hidden bg-slate-50 border-slate-200">
                                        <DialogTitle className="sr-only">Create New Website</DialogTitle>
                                        <div className="flex flex-col md:flex-row h-[700px] w-full">

                                            {/* Left: Form */}
                                            <div className="w-full md:w-1/3 bg-white p-10 flex flex-col pt-12 border-r border-slate-100 relative z-10 shadow-2xl">
                                                <div>
                                                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                                        <LayoutTemplate className="w-7 h-7" />
                                                    </div>
                                                    <h2 className="text-[2rem] font-black text-slate-900 tracking-tight mb-3 leading-none">Create a Project</h2>
                                                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                                                        Give your masterpiece a name and select a starting template to kick things off.
                                                    </p>
                                                </div>
                                                <div className="mt-4 space-y-4 flex-1">
                                                    <div className="relative group">
                                                        <label className="text-xs font-bold text-slate-800 mb-2 block uppercase tracking-wider">Project Name</label>
                                                        <Input
                                                            placeholder="e.g., My Awesome Site"
                                                            value={newSiteName}
                                                            onChange={(e) => setNewSiteName(e.target.value)}
                                                            className="h-14 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 shadow-inner"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-auto pt-8 border-t border-slate-100">
                                                    <GradientButton
                                                        onClick={handleCreateSite}
                                                        disabled={!newSiteName.trim()}
                                                        className="w-full h-14 font-bold text-lg flex items-center justify-center group active:scale-[0.98]"
                                                        icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                                    >
                                                        Start Building 
                                                    </GradientButton>
                                                </div>
                                            </div>

                                            {/* Right: Templates Gallery */}
                                            <div className="w-full md:w-2/3 bg-slate-50 p-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Select a Template</h3>
                                                    <span className="text-xs font-bold text-slate-500 px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm uppercase tracking-wider">
                                                        {templatesList.length} options
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                                                    {templatesList.map((tpl) => (
                                                        <div
                                                            key={tpl.id}
                                                            onClick={() => setSelectedTemplate(tpl.id)}
                                                            className={cn(
                                                                "group cursor-pointer rounded-[1.5rem] overflow-hidden transition-all duration-300 relative border-[3px] bg-white flex flex-col",
                                                                selectedTemplate === tpl.id
                                                                    ? "border-blue-500 shadow-[0_10px_40px_rgba(59,130,246,0.15)] scale-[1.02]"
                                                                    : "border-transparent border-slate-200 hover:border-blue-300 hover:shadow-xl opacity-80 hover:opacity-100"
                                                            )}
                                                        >
                                                            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                                                <img
                                                                    src={tpl.image}
                                                                    alt={tpl.name}
                                                                    className={cn("w-full h-full object-cover transition-transform duration-700", selectedTemplate === tpl.id ? "scale-105" : "group-hover:scale-105")}
                                                                />
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
                                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                                    <p className="text-white font-semibold text-sm drop-shadow-md">{tpl.desc}</p>
                                                                </div>
                                                            </div>
                                                            <div className="p-6 flex items-center gap-4 bg-white relative z-10 border-t border-slate-100">
                                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm", selectedTemplate === tpl.id ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500")}>
                                                                    <tpl.icon className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <h4 className={cn("font-bold text-lg transition-colors leading-tight", selectedTemplate === tpl.id ? "text-slate-900" : "text-slate-700")}>{tpl.name}</h4>
                                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{tpl.category}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-sm border-2 border-slate-300 shadow-sm">
                                    JD
                                </div>
                            </div>
                        </header>

                        {/* Overview Cards */}
                        <section className="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
                            <OverviewCard
                                title="Total Websites"
                                value="1,234"
                                description="+20.1% from last month"
                                icon={<Globe className="w-5 h-5" />}
                                iconBgClass="bg-gradient-to-br from-purple-600 to-indigo-600"
                                iconColorClass="text-white"
                            />
                            {isAdmin && (
                                <OverviewCard
                                    title="Active Users"
                                    value="250"
                                    description="+15% from last month"
                                    icon={<Users className="w-5 h-5" />}
                                    iconBgClass="bg-blue-100"
                                    iconColorClass="text-blue-600"
                                />
                            )}
                            <OverviewCard
                                title="Templates Available"
                                value="42"
                                description="New templates added frequently"
                                icon={<Layout className="w-5 h-5" />}
                                iconBgClass="bg-gradient-to-br from-emerald-600 to-teal-600"
                                iconColorClass="text-white"
                            />
                            {isAdmin && (
                                <OverviewCard
                                    title="Deployments Today"
                                    value="78"
                                    description="Successfully deployed websites"
                                    icon={<Activity className="w-5 h-5" />}
                                    iconBgClass="bg-rose-100"
                                    iconColorClass="text-rose-600"
                                />
                            )}
                        </section>

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
                                <Button
                                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                                    className={`rounded-full h-10 px-4 text-sm font-semibold
                                                ${filterStatus === 'all' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                                                transition-all duration-200`}
                                    onClick={() => setFilterStatus('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filterStatus === 'draft' ? 'default' : 'outline'}
                                    className={`rounded-full h-10 px-4 text-sm font-semibold
                                                ${filterStatus === 'draft' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                                                transition-all duration-200`}
                                    onClick={() => setFilterStatus('draft')}
                                >
                                    Draft
                                </Button>
                                <Button
                                    variant={filterStatus === 'published' ? 'default' : 'outline'}
                                    className={`rounded-full h-10 px-4 text-sm font-semibold
                                                ${filterStatus === 'published' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                                                transition-all duration-200`}
                                    onClick={() => setFilterStatus('published')}
                                >
                                    Published
                                </Button>
                            </div>
                        </div>

                        {/* Website Cards */}
                        {websites.length === 0 ? (
                            <EmptyState onAction={() => setIsDialogOpen(true)} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredWebsites.map((site, index) => (
                                    <WebsiteCard
                                        key={site.id}
                                        site={site}
                                        index={index}
                                        onDelete={() => deleteWebsite(site.id)}
                                        onEdit={() => navigate(`/builder/${site.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <Outlet key={location.pathname} />
                )}
            </main>
        </div>
    );
};

// --- WebsiteCard ---
const WebsiteCard = ({ site, index, onDelete, onEdit }) => {
    const template = templatesList.find(t => t.id === site.templateId);

    return (
        <Card className="group border border-slate-200 bg-white rounded-3xl overflow-hidden flex flex-col shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
                {template && template.id !== 'blank' ? (
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 p-4">
                        <img src={template.image} alt={site.name} className="w-full h-full object-cover rounded-2xl border border-slate-200 shadow-sm" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ) : (
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 p-4">
                        <div className="w-full h-full border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden">
                            <div className="h-6 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                                <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                                <div className="flex gap-2 pt-2">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50" />
                                    <div className="h-8 w-8 rounded-lg bg-slate-50" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                )}

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <Button size="sm" onClick={onEdit} className="bg-white text-slate-900 hover:bg-white/90 rounded-full shadow-lg">
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                </div>
            </div>

            <CardHeader className="p-6 pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                            {site.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {format(new Date(site.lastEdited), 'MMM d, p')}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                            <DropdownMenuItem onClick={onEdit} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                                <Edit2 className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                                <Files className="w-4 h-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onDelete} className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                <Trash2 className="w-4 h-4" /> Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardFooter className="p-6 pt-3 mt-auto flex justify-between items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${site.status === 'Published'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${site.status === 'Published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {site.status}
                </div>
                <Button variant="link" className="text-indigo-600 p-0 h-auto text-sm font-bold group-hover:underline underline-offset-4" onClick={onEdit}>
                    Open Editor →
                </Button>
            </CardFooter>
        </Card>
    );
};

// --- EmptyState ---
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

// --- AssetsView ---
const AssetsView = () => {
    const assets = [
        { id: '1', name: 'Hero bg.jpg', type: 'image', size: '1.2 MB', date: '2024-03-01', url: business },
        { id: '2', name: 'Product 1.png', type: 'image', size: '0.8 MB', date: '2024-03-02', url: ecommerce },
        { id: '3', name: 'Logo.svg', type: 'image', size: '0.1 MB', date: '2024-03-05', url: portfolio },
        { id: '4', name: 'Profile.jpg', type: 'image', size: '0.4 MB', date: '2024-03-06', url: school },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Assets Management</h2>
                <p className="text-slate-500 mt-1">Manage your images, videos, and documents.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                <div className="aspect-square border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-white cursor-pointer transition-all group">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-primary">Upload</span>
                </div>
                {assets.map(asset => (
                    <div key={asset.id} className="group relative aspect-square bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer">
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                            <p className="text-white text-sm font-bold truncate">{asset.name}</p>
                            <p className="text-white/70 text-[10px] uppercase font-black tracking-widest mt-0.5">{asset.size}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SettingsView ---
const SettingsView = () => {
    const [name, setName] = useState('John Doe');
    const [email] = useState('john@example.com');
    const { toast } = useToast();

    return (
        <div className="max-w-4xl space-y-12 animate-in fade-in duration-500 pb-32">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your profile, security, and account preferences.</p>
            </div>

            <section className="bg-white border rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Profile Information</h3>
                        <p className="text-sm text-slate-500">Update your personal details.</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <Input value={email} disabled className="h-14 rounded-2xl bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-60" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Email cannot be changed directly.</p>
                    </div>
                </div>
                <Button className="rounded-2xl px-10 h-14 font-bold text-white shadow-xl shadow-primary/20" onClick={() => toast({ title: "Profile updated", description: "Name updated successfully." })}>
                    Save Changes
                </Button>
            </section>

            <section className="bg-white border rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Security</h3>
                        <p className="text-sm text-slate-500">Manage your password.</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Password</label>
                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all shadow-inner" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">New Password</label>
                            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all shadow-inner" />
                        </div>
                    </div>
                    <Button className="rounded-2xl px-10 h-14 font-bold" variant="secondary" onClick={() => toast({ title: "Password changed", description: "Password updated successfully." })}>
                        Update Password
                    </Button>
                </div>
            </section>

            <section className="bg-rose-50 border border-rose-100 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Danger Zone</h3>
                        <p className="text-sm text-rose-600">Irreversible account actions.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-rose-100/50">
                    <div className="space-y-1">
                        <p className="font-black text-slate-900 text-lg">Deactivate Account</p>
                        <p className="text-sm text-slate-500 max-w-md font-medium">Temporarily disable your profile and all websites.</p>
                    </div>
                    <Button variant="destructive" className="rounded-2xl font-black h-14 px-8 shadow-lg shadow-rose-200" onClick={() => {
                        if (confirm("Are you sure you want to deactivate your account?")) {
                            window.location.href = "/";
                        }
                    }}>
                        Deactivate Profile
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;