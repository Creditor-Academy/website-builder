import React, { useState, useEffect } from 'react'; // Temp comment to force re-compilation
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom'; // Added Link, useLocation, and Outlet
import { Helmet } from 'react-helmet-async';
import {
    Plus, Globe, MoreVertical, Edit2, Play, Trash2,
    Layout, Settings, LogOut, Clock, CheckCircle,
    FileText, Search, Sparkles, Zap, Files, Users, Activity, Menu, X, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

// New OverviewCard component for dashboard statistics
const OverviewCard = ({ title, value, icon, description }) => (
    <Card className="rounded-xl border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
                {title}
            </CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </CardContent>
    </Card>
);

// Modified NavItem to support `to` prop and active state via `useLocation`
const NavItem = ({ icon, label, to, activeColor = 'text-primary', hoverBg = 'hover:bg-blue-50', hoverText = 'hover:text-slate-600', defaultText = 'text-slate-600' }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-11 transition-all duration-200 group 
                ${isActive ? `bg-primary/5 ${activeColor} font-semibold` : `${defaultText} ${hoverText} ${hoverBg}`}
            }`}
            asChild
        >
            <Link to={to}>
                <span className={`transition-colors duration-200 ${isActive ? activeColor : `${defaultText} ${hoverText}`}`}>{icon}</span>
                {label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />} 
            </Link>
        </Button>
    );
};


const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { websites, createWebsite, deleteWebsite } = useBuilderStore();
    const [newSiteName, setNewSiteName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
    const [isAdmin, setIsAdmin] = useState(false); // New state for admin mode
    const isMobile = useIsMobile(); // Use the hook

    const adminRoutes = [
        '/dashboard/users',
        '/dashboard/websites',
        '/dashboard/deployment',
        '/dashboard/settings',
    ];

    console.log({ isMobile, isSidebarOpen, isAdmin }); // Debugging line

    useEffect(() => {
        console.log('useEffect running:', { isAdmin, currentPath: location.pathname });

        if (!isAdmin && adminRoutes.includes(location.pathname)) {
            console.log('Redirecting from admin route because isAdmin is false.', { from: location.pathname, to: '/dashboard' });
            navigate('/dashboard');
        }
    }, [isAdmin, location.pathname, navigate]);

    const handleCreateSite = () => {
        if (!newSiteName.trim()) return;
        const id = createWebsite(newSiteName);
        setNewSiteName('');
        setIsDialogOpen(false);
        navigate(`/builder/${id}`);
    };

    // Filter logic (keeps functionality but adds UX value)
    const filteredWebsites = websites.filter(site => 
        site.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-primary/10">
            <Helmet>
                <title>Dashboard | Buildora</title>
            </Helmet>

            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- Sidebar Redesign --- */}
            <aside 
                className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-slate-900 to-slate-800 border-r border-slate-700 flex-col z-50 
                    lg:static lg:flex 
                    ${isMobile ? 'transition-transform duration-300 ease-in-out transform' : ''} 
                    ${isMobile && isSidebarOpen ? 'translate-x-0 flex' : isMobile ? '-translate-x-full flex' : 'flex'}
                `}
            >
                <div className="p-6">
                    <div className="flex items-center gap-2.5 px-2">
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
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

                <nav className="flex-1 px-4 py-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-2">Main Menu</p>
                    {isAdmin === false && <NavItem icon={<Globe className="w-4 h-4" />} label="Dashboard" to="/dashboard" activeColor="text-purple-400" hoverBg="hover:bg-slate-700" hoverText="hover:text-white" defaultText="text-slate-300" />}
                    <NavItem icon={<Layout className="w-4 h-4" />} label="Templates" to="/dashboard/templates" activeColor="text-purple-400" hoverBg="hover:bg-slate-700" hoverText="hover:text-white" defaultText="text-slate-300" />
                    <NavItem icon={<FileText className="w-4 h-4" />} label="Assets" to="/dashboard/assets" activeColor="text-purple-400" hoverBg="hover:bg-slate-700" hoverText="hover:text-white" defaultText="text-slate-300" />
                    {isAdmin && (
                        <div className="pt-4">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-2">System</p>
                            <NavItem icon={<Users className="w-4 h-4" />} label="Users" to="/dashboard/users" activeColor="text-purple-400" hoverBg="hover:bg-slate-700" hoverText="hover:text-white" defaultText="text-slate-300" />
                            <NavItem icon={<Layout className="w-4 h-4" />} label="Websites" to="/dashboard/websites" activeColor="text-purple-400" hoverBg="hover:bg-slate-700" hoverText="hover:text-white" defaultText="text-slate-300" />
                            <NavItem icon={<Activity className="w-4 h-4" />} label="Deployment Monitoring" to="/dashboard/deployment" activeColor="text-purple-400" hoverBg="hover:bg-slate-700" hoverText="hover:text-white" defaultText="text-slate-300" />
                            <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" to="/dashboard/settings" activeColor="text-purple-400" hoverBg="hover:bg-slate-700" hoverText="hover:text-white" defaultText="text-slate-300" />
                        </div>
                    )}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-700 rounded-2xl p-4 border border-slate-600 mb-4">
                        <p className="text-xs font-semibold text-white mb-1">Free Plan</p>
                        <div className="w-full bg-slate-600 h-1.5 rounded-full mb-2">
                            <div className="bg-purple-500 h-full w-1/3 rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-slate-400">3 of 10 projects used</p>
                    </div>

                    <Button 
                        className="w-full justify-start gap-3 h-11 transition-all duration-200 group mb-4 bg-slate-700 text-slate-300 border border-slate-500 hover:bg-slate-600 group-hover:text-white"
                        onClick={() => setIsAdmin(!isAdmin)}
                    >
                        {isAdmin ? (
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                        ) : (
                            <Users className="w-4 h-4 text-slate-300 group-hover:text-white" />
                        )}
                        {isAdmin ? "Admin Mode On" : "Switch to Admin Mode"}
                    </Button>
                    
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700 transition-colors group cursor-pointer border border-transparent hover:border-slate-600">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-indigo-300 text-indigo-800 flex items-center justify-center font-bold text-sm">JD</div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-800 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">John Doe</p>
                            <p className="text-xs text-slate-400 truncate">Pro Plan</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
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
                                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Hub</h2>
                                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                                        Welcome back! You have <span className="text-primary font-medium">{websites.length} active projects</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative hidden sm:block">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input 
                                        placeholder="Search projects..." 
                                        className="pl-9 w-[240px] bg-white border-slate-200 focus:ring-primary/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="gap-2 px-5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                                            <Plus className="w-5 h-5" /> New Project
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md rounded-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Create New Website</DialogTitle>
                                            <DialogDescription>
                                                Enter a name for your next masterpiece.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <Input
                                                placeholder="e.g., Portfolio 2024"
                                                value={newSiteName}
                                                onChange={(e) => setNewSiteName(e.target.value)}
                                                className="h-11"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleCreateSite} disabled={!newSiteName.trim()}>
                                                Start Building
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </header>

                        {/* --- Overview Cards Section --- */}
                        <section className="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
                            <OverviewCard 
                                title="Total Websites"
                                value="1,234"
                                description="+20.1% from last month"
                                icon={<Globe className="w-4 h-4 text-slate-400" />}
                            />
                            {isAdmin && (
                                <OverviewCard 
                                    title="Active Users"
                                    value="250"
                                    description="+15% from last month"
                                    icon={<Users className="w-4 h-4 text-slate-400" />}
                                />
                            )}
                            <OverviewCard 
                                title="Templates Available"
                                value="42"
                                description="New templates added frequently"
                                icon={<Layout className="w-4 h-4 text-slate-400" />}
                            />
                            {isAdmin && (
                                <OverviewCard 
                                    title="Deployments Today"
                                    value="78"
                                    description="Successfully deployed websites"
                                    icon={<Activity className="w-4 h-4 text-slate-400" />}
                                />
                            )}
                        </section>

                        {/* --- Content Area (Website Cards) --- */}
                        {websites.length === 0 ? (
                            <EmptyState onAction={() => setIsDialogOpen(true)} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

const WebsiteCard = ({ site, index, onDelete, onEdit }) => (
    <Card className="group border-slate-200 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:scale-[1.01] bg-white rounded-3xl overflow-hidden flex flex-col">
        <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
            {/* Mockup Preview Area */}
            <div className="absolute inset-0 p-4 transition-transform duration-500 ">
                <div className="w-full h-full border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden">
                    <div className="h-6 bg-slate-50 border-b flex items-center px-3 gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-400/50"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-400/50"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400/50"></div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="h-3 w-3/4 bg-slate-100 rounded-full animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-slate-100 rounded-full"></div>
                        <div className="flex gap-2 pt-2">
                             <div className="h-8 w-8 rounded-lg bg-slate-50"></div>
                             <div className="h-8 w-8 rounded-lg bg-slate-50"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-slate-900/40  opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                <Button size="sm" onClick={onEdit} className="bg-white text-slate-900 hover:bg-white/90 ">
                    <Edit2 className="w-4 h-4" /> Edit
                </Button>
            </div>
        </div>

        <CardHeader className="p-5 pb-2">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                        {site.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Clock className="w-3 h-3" />
                        {format(new Date(site.lastEdited), 'MMM d, p')}
                    </div>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400 hover:bg-slate-200 hover:text-slate-600">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                        <DropdownMenuItem onClick={onEdit} className="rounded-lg gap-2 cursor-pointer">
                            <Edit2 className="w-4 h-4" /> edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
                            <Files  className="w-4 h-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDelete} className="rounded-lg gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5">
                            <Trash2 className="w-4 h-4" /> Delete Project
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>

        <CardFooter className="p-5 pt-0 mt-auto flex justify-between items-center">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                site.status === 'Published' 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${site.status === 'Published' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {site.status}
            </div>
            
            <Button variant="link" className="text-primary p-0 h-auto text-sm font-bold group-hover:underline underline-offset-4" onClick={onEdit}>
                Open Editor →
            </Button>
        </CardFooter>
    </Card>
);

const EmptyState = ({ onAction }) => (
    <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white p-12 text-center transition-all hover:border-primary/20 hover:bg-slate-50/50">
        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6">
            <Globe className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Your creative journey starts here</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Every great brand starts with a single page. Build yours with our visual canvas.
        </p>
        <Button size="lg" className="mt-8 rounded-full px-8 gap-2 shadow-lg shadow-primary/20" onClick={onAction}>
            <Plus className="w-5 h-5" /> Create Your First Site
        </Button>
    </div>
);

export default Dashboard;