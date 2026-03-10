import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    Plus, Globe, MoreVertical, Edit2, Play, Trash2, 
    Layout, Settings, LogOut, Clock, CheckCircle, 
    FileText, Search, Sparkles, Zap, Files, Building2, ShoppingBag, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';

const Dashboard = () => {
    const navigate = useNavigate();
    const { websites, createWebsite, deleteWebsite } = useBuilderStore();

    const handleLogout = () => {
        // Clear any stored authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Redirect to home screen
        navigate('/');
    };

    const [newSiteName, setNewSiteName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('websites'); // 'websites' or 'templates'
    const [searchQuery, setSearchQuery] = useState('');

    // Filter logic
    const filteredWebsites = websites.filter(site => 
        site.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateSite = () => {
        if (!newSiteName.trim()) return;
        const id = createWebsite(newSiteName, selectedTemplate);
        setNewSiteName('');
        setSelectedTemplate('blank');
        setIsDialogOpen(false);
        navigate(`/builder/${id}`);
    };

    const templatesList = [
        { id: 'blank', name: 'Blank Canvas', desc: 'Start from scratch', icon: FileText, color: 'bg-slate-100 text-slate-600' },
        { id: 'business', name: 'Business', desc: 'Professional corporate layout', icon: Building2, color: 'bg-blue-100 text-blue-600' },
        { id: 'portfolio', name: 'Portfolio', desc: 'Showcase your creative work', icon: Layout, color: 'bg-purple-100 text-purple-600' },
        { id: 'ecommerce', name: 'E-commerce', desc: 'Modern online store', icon: ShoppingBag, color: 'bg-green-100 text-green-600' },
        { id: 'consultant', name: 'Consultant', desc: 'Expert advisory layout', icon: Users, color: 'bg-amber-100 text-amber-600' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-primary/10">
            <Helmet>
                <title>Dashboard | Buildora</title>
            </Helmet>

            {/* --- Sidebar Redesign --- */}
            <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-6">
                    <div className="flex items-center gap-2.5 px-2">
                        {/* <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </div> */}
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            Buildora
                        </h1>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => setActiveTab('websites')}
                        className={`w-full justify-start gap-3 ${activeTab === 'websites' ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:text-primary'}`}
                    >
                        <Globe className="w-4 h-4" /> My Websites
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => setActiveTab('templates')}
                        className={`w-full justify-start gap-3 ${activeTab === 'templates' ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:text-primary'}`}
                    >
                        <Layout className="w-4 h-4" /> Templates
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-primary">
                        <FileText className="w-4 h-4" /> Assets
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-primary">
                        <Settings className="w-4 h-4" /> Settings
                    </Button>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
                        <p className="text-xs font-semibold text-slate-900 mb-1">Free Plan</p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mb-2">
                            <div className="bg-primary h-full w-1/3 rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-slate-500">3 of 10 projects used</p>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">JD</div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">John Doe</p>
                            <p className="text-xs text-slate-500 truncate">Pro Plan</p>
                        </div>
                        <LogOut 
                            className="w-4 h-4 text-slate-400 group-hover:text-destructive transition-colors cursor-pointer" 
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </aside>

            {/* --- Main Content Redesign --- */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Hub</h2>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            Welcome back! You have <span className="text-primary font-medium">{websites.length} active projects</span>
                        </p>
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

                {activeTab === 'templates' ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 leading-tight">Templates Library</h2>
                            <p className="text-slate-500 mt-1">Start with a professionally designed layout</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {templatesList.map((tpl) => (
                                <Card key={tpl.id} className="group overflow-hidden border-slate-200 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white cursor-pointer" onClick={() => {
                                    setSelectedTemplate(tpl.id);
                                    setIsDialogOpen(true);
                                }}>
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        <div className={`absolute inset-0 opacity-10 ${tpl.color.split(' ')[0]}`} />
                                        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${tpl.color}`}>
                                                <tpl.icon className="w-10 h-10" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <Button variant="secondary" className="w-full font-bold">Use This Template</Button>
                                        </div>
                                    </div>
                                    <CardHeader className="p-6">
                                        <CardTitle className="text-xl font-bold">{tpl.name}</CardTitle>
                                        <CardDescription className="text-sm mt-2">{tpl.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : websites.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-white p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Globe className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">No websites yet</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            Ready to start your next big project? Create your first website with our intuitive builder.
                        </p>
                        <Button variant="outline" className="mt-6" onClick={() => setIsDialogOpen(true)}>
                            Start Your First Project
                        </Button>
                    </div>
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
            </main>
        </div>
    );
};

// --- Sub-components for better organization & interactivity ---

const NavItem = ({ icon, label, active = false }) => (
    <Button 
        variant="ghost" 
        className={`w-full justify-start gap-3 h-11 transition-all duration-200 group ${
            active 
                ? 'bg-primary/5 text-primary font-semibold' 
                : 'text-slate-600 hover:text-slate-600 hover:bg-blue-50'
        }`}
    >
        <span className={`transition-colors duration-200 ${
            active 
                ? 'text-primary' 
                : 'text-slate-400 group-hover:text-slate-600'
        }`}>{icon}</span>
        {label}
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </Button>
);

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
                {/* <Button size="icon" variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/40">
                    <Play className="w-4 h-4" />
                </Button> */}
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