import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Plus, Globe, MoreVertical, Edit2, Trash2,
    Layout, Settings, LogOut, Clock, CheckCircle,
    FileText, Search, Sparkles, Zap, Files, Building2, ShoppingBag, Users,
    ArrowRight, ChevronLeft, Palette, Layers, MonitorPlay, Move, LayoutTemplate,
    Upload, Monitor, Link as LinkIcon, Activity, Menu, X, ShieldCheck, ListFilter
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

import { templatesList } from '@/lib/templates';

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

                <div className="p-4 mt-auto space-y-3">
                    <div className="bg-slate-700 rounded-2xl p-4 border border-slate-600">
                        <p className="text-xs font-semibold text-white mb-1">Free Plan</p>
                        <div className="w-full bg-slate-600 h-1.5 rounded-full mb-2">
                            <div className="bg-purple-500 h-full w-1/3 rounded-full" />
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
                ) : location.pathname === '/dashboard' && isAdmin ? (
                    <div className="relative min-h-screen bg-[#f8fafc] p-6 lg:p-10 overflow-hidden">
                        {/* Background Gradient Blobs */}
                        <div className="absolute top-[-200px] left-[-300px] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
                        <div className="absolute bottom-[-100px] right-[-200px] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
                        <div className="absolute top-[100px] right-[-100px] w-[400px] h-[400px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

                        {/* Top Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10 p-8 md:p-12 mb-10 bg-white/60 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 opacity-80 -z-10 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" />
                            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Welcome to Admin Panel</h2>
                            <p className="text-xl text-slate-700 max-w-2xl leading-relaxed">
                                Centralized control for managing all aspects of the Buildora platform, from users to deployments.
                            </p>
                            <div className="flex gap-4 mt-8">
                                <Button
                                    className="h-12 px-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
                                    onClick={() => navigate('/dashboard/users')}
                                >
                                    <Users className="w-5 h-5 mr-2" /> Manage Users
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 px-6 rounded-full bg-white/80 border-white/40 text-slate-700 hover:bg-white/90 hover:text-slate-900 shadow-lg shadow-slate-200/20"
                                    onClick={() => navigate('/dashboard/websites')}
                                >
                                    <Layout className="w-5 h-5 mr-2" /> View Websites
                                </Button>
                            </div>
                        </motion.div>

                        {/* Quick Action Pills */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative z-10 flex flex-wrap gap-3 mb-10"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate('/dashboard/users')}
                                className="cursor-pointer px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/20 text-slate-700 text-sm font-medium shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-200"
                            >
                                Users
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate('/dashboard/websites')}
                                className="cursor-pointer px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/20 text-slate-700 text-sm font-medium shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                            >
                                Websites
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate('/dashboard/templates')}
                                className="cursor-pointer px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/20 text-slate-700 text-sm font-medium shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-200"
                            >
                                Templates
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate('/dashboard/assets')}
                                className="cursor-pointer px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/20 text-slate-700 text-sm font-medium shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                            >
                                Assets
                            </motion.div>
                        </motion.div>

                        {/* Main Navigation Grid */}
                        <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Users Card */}
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)", borderColor: "rgba(168, 85, 247, 0.4)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onClick={() => navigate('/dashboard/users')}
                                className="relative group cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col items-start overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 w-16 h-16 bg-purple-100/70 text-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-2">User Management</h3>
                                <p className="relative z-10 text-slate-600 text-base leading-relaxed">
                                    Create, modify, and delete user accounts. Assign roles and permissions.
                                </p>
                                {/* Mini Visual Placeholder */}
                                <div className="relative z-10 w-full mt-6 bg-purple-100 rounded-full h-2.5">
                                    <div className="bg-purple-500 h-full rounded-full w-[70%]" />
                                </div>
                                <span className="relative z-10 text-xs text-slate-500 mt-2">70% active accounts</span>
                            </motion.div>

                            {/* Websites Card */}
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)", borderColor: "rgba(99, 102, 241, 0.4)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onClick={() => navigate('/dashboard/websites')}
                                className="relative group cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col items-start overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 w-16 h-16 bg-indigo-100/70 text-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                                    <Layout className="w-8 h-8" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-2">Website Projects</h3>
                                <p className="relative z-10 text-slate-600 text-base leading-relaxed">
                                    Oversee all created websites, their status, and configurations.
                                </p>
                                {/* Mini Visual Placeholder */}
                                <div className="relative z-10 w-full mt-6 bg-indigo-100 rounded-full h-2.5">
                                    <div className="bg-indigo-500 h-full rounded-full w-[90%]" />
                                </div>
                                <span className="relative z-10 text-xs text-slate-500 mt-2">90% projects published</span>
                            </motion.div>

                            {/* Templates Card */}
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)", borderColor: "rgba(16, 185, 129, 0.4)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onClick={() => navigate('/dashboard/templates')}
                                className="relative group cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col items-start overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 w-16 h-16 bg-emerald-100/70 text-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                                    <LayoutTemplate className="w-8 h-8" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-2">Template Library</h3>
                                <p className="relative z-10 text-slate-600 text-base leading-relaxed">
                                    Browse, add, and manage all available website templates.
                                </p>
                                {/* Mini Visual Placeholder */}
                                <div className="relative z-10 w-full mt-6 bg-emerald-100 rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-full rounded-full w-[80%]" />
                                </div>
                                <span className="relative z-10 text-xs text-slate-500 mt-2">80% templates actively used</span>
                            </motion.div>

                            {/* Assets Card */}
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)", borderColor: "rgba(59, 130, 246, 0.4)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onClick={() => navigate('/dashboard/assets')}
                                className="relative group cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col items-start overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 w-16 h-16 bg-blue-100/70 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                                    <Files className="w-8 h-8" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-2">Asset Library</h3>
                                <p className="relative z-10 text-slate-600 text-base leading-relaxed">
                                    Manage all uploaded images, videos, and various media files.
                                </p>
                                {/* Mini Visual Placeholder */}
                                <div className="relative z-10 w-full mt-6 bg-blue-100 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-full rounded-full w-[60%]" />
                                </div>
                                <span className="relative z-10 text-xs text-slate-500 mt-2">60% storage capacity used</span>
                            </motion.div>

                            {/* Deployment Monitoring Card */}
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)", borderColor: "rgba(244, 63, 94, 0.4)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onClick={() => navigate('/dashboard/deployment')}
                                className="relative group cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col items-start overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 w-16 h-16 bg-rose-100/70 text-rose-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-2">Deployment Status</h3>
                                <p className="relative z-10 text-slate-600 text-base leading-relaxed">
                                    Monitor the status and history of all website deployments.
                                </p>
                                {/* Mini Visual Placeholder */}
                                <div className="relative z-10 w-full mt-6 bg-rose-100 rounded-full h-2.5">
                                    <div className="bg-rose-500 h-full rounded-full w-[95%]" />
                                </div>
                                <span className="relative z-10 text-xs text-slate-500 mt-2">95% deployments successful</span>
                            </motion.div>

                            {/* Settings Card */}
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)", borderColor: "rgba(251, 191, 36, 0.4)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onClick={() => navigate('/dashboard/settings')}
                                className="relative group cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col items-start overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 w-16 h-16 bg-orange-100/70 text-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                                    <Settings className="w-8 h-8" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-2">System Settings</h3>
                                <p className="relative z-10 text-slate-600 text-base leading-relaxed">
                                    Configure global platform settings, integrations, and preferences.
                                </p>
                                {/* Mini Visual Placeholder */}
                                <div className="relative z-10 w-full mt-6 bg-orange-100 rounded-full h-2.5">
                                    <div className="bg-orange-500 h-full rounded-full w-[85%]" />
                                </div>
                                <span className="relative z-10 text-xs text-slate-500 mt-2">85% settings configured</span>
                            </motion.div>
                        </section>

                        {/* Right Side Feature Card (System Status) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative z-10 mt-6 bg-white/60 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-xl overflow-hidden md:col-span-full lg:col-span-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/10 to-teal-50/10 opacity-50 -z-10" />
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-sky-100/70 text-sky-600 rounded-xl flex items-center justify-center shadow-md">
                                    <MonitorPlay className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">System Status</h3>
                            </div>
                            <p className="text-slate-600 mb-6">Overview of core system health and performance metrics.</p>
                            <div className="flex items-center justify-around text-center">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle
                                            className="text-slate-200 stroke-current"
                                            strokeWidth="10"
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                        />
                                        <circle
                                            className="text-blue-500 stroke-current"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            strokeDasharray="251.2"
                                            strokeDashoffset="62.8" /* 25% of 251.2 */
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-600">75%</span>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-800">Uptime</p>
                                    <p className="text-sm text-slate-500">99.9% (last 30 days)</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
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
    const { assets, addAsset, deleteAsset } = useBuilderStore();
    const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [urlName, setUrlName] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            addAsset({
                name: file.name,
                url,
                type: file.type.startsWith('video') ? 'video' : 'image',
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            });
            if (e.target) e.target.value = '';
        }
    };

    const handleUrlUpload = () => {
        if (urlInput) {
            addAsset({
                name: urlName || 'Imported Asset',
                url: urlInput,
                type: urlInput.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image',
                size: 'External'
            });
            setUrlInput('');
            setUrlName('');
            setIsUrlDialogOpen(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Assets Management</h2>
                <p className="text-slate-500 mt-1">Manage your images, videos, and documents.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="aspect-square border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-white cursor-pointer transition-all group">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-slate-500 group-hover:text-primary">Upload</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 rounded-xl p-2">
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2.5" onSelect={() => fileInputRef.current?.click()}>
                            <Monitor className="w-4 h-4" /> From Disk
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2.5" onSelect={() => setIsUrlDialogOpen(true)}>
                            <LinkIcon className="w-4 h-4" /> From URL
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept="image/*,video/*"
                />

                {assets.map(asset => (
                    <div key={asset.id} className="group relative aspect-square bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer">
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAsset(asset.id);
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                            <p className="text-white text-sm font-bold truncate">{asset.name}</p>
                            <p className="text-white/70 text-[10px] uppercase font-black tracking-widest mt-0.5">{asset.size}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* URL Upload Dialog */}
            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle>Import via URL</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="url-name" className="text-sm font-medium">Asset Name</label>
                            <Input
                                id="url-name"
                                placeholder="E.g. Logo, Banner Image..."
                                value={urlName}
                                onChange={(e) => setUrlName(e.target.value)}
                                className="rounded-xl bg-slate-50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="url" className="text-sm font-medium">Image or Video URL</label>
                            <Input
                                id="url"
                                placeholder="https://example.com/image.png"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="rounded-xl bg-slate-50"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsUrlDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleUrlUpload} disabled={!urlInput} className="rounded-xl">Import Asset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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