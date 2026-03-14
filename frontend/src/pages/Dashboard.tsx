import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Plus, Globe, MoreVertical, Edit2, Play, Trash2,
    Layout, Settings, LogOut, Clock, CheckCircle,
    FileText, Search, Sparkles, Zap, Files, Building2, ShoppingBag, Users,
    ArrowRight, ChevronLeft, Palette, Layers, MonitorPlay, Move, LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newSiteName, setNewSiteName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [dialogStep, setDialogStep] = useState<'templates' | 'details'>('templates');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('websites'); // 'websites' or 'templates'

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setDialogStep('templates');
            setNewSiteName('');
        }
    };

    // Filter logic
    const filteredWebsites = websites.filter(site =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateSite = () => {
        if (newSiteName.trim()) {
            const id = createWebsite(newSiteName, selectedTemplate);
            setIsDialogOpen(false);
            setDialogStep('templates');
            setNewSiteName('');
            setSelectedTemplate('blank');
            navigate(`/builder/${id}`);
        }
    };



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
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('assets')}
                        className={`w-full justify-start gap-3 ${activeTab === 'assets' ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:text-primary'}`}
                    >
                        <FileText className="w-4 h-4" /> Assets
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('settings')}
                        className={`w-full justify-start gap-3 ${activeTab === 'settings' ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:text-primary'}`}
                    >
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
                {activeTab === 'websites' && (
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

                            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 px-5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                                        <Plus className="w-5 h-5" /> New Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-5xl rounded-[2.5rem] p-0 overflow-hidden bg-slate-50 border-slate-200">
                                    <DialogTitle className="sr-only">Create New Website</DialogTitle>
                                    <div className="flex flex-col md:flex-row h-[700px] w-full">

                                        {/* Left side: Form & Info */}
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
                                                <Button
                                                    onClick={handleCreateSite}
                                                    disabled={!newSiteName.trim()}
                                                    className="w-full h-14 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl disabled:opacity-50 transition-all text-lg flex items-center justify-center gap-2 group active:scale-[0.98]"
                                                >
                                                    Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Right side: Templates Gallery */}
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
                        </div>
                    </header>
                )}

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
                                        <img
                                            src={tpl.image}
                                            alt={tpl.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <Button variant="secondary" className="w-full font-bold shadow-xl" onClick={(e) => {
                                                e.stopPropagation();
                                                const id = createWebsite(`My ${tpl.name} Website`, tpl.id);
                                                navigate(`/builder/${id}`);
                                            }}>Use This Template</Button>
                                        </div>
                                        {tpl.id === 'blank' && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                                    <Plus className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="p-6">
                                        <CardTitle className="text-xl font-bold">{tpl.name}</CardTitle>
                                        <CardDescription className="text-sm mt-2">{tpl.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'assets' ? (
                    <AssetsView />
                ) : activeTab === 'settings' ? (
                    <SettingsView />
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

const AssetsView = () => {
    // Mock assets data
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

            {/* Profile Section */}
            <section className="bg-white border rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Profile Information</h3>
                        <p className="text-sm text-slate-500">Update your personal details. (Route: GET /users/me)</p>
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
                <Button className="rounded-2xl px-10 h-14 font-bold text-white shadow-xl shadow-primary/20" onClick={() => toast({ title: "Profile updated", description: "PATCH /users/me successful. Name updated in database." })}>Save Changes</Button>
            </section>

            {/* Security Section */}
            <section className="bg-white border rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Security</h3>
                        <p className="text-sm text-slate-500">Manage your password. (Route: POST /users/change-password)</p>
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
                    <Button className="rounded-2xl px-10 h-14 font-bold" variant="secondary" onClick={() => toast({ title: "Password changed", description: "POST /users/change-password successful. password_hash updated, session cleared." })}>Update Password</Button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-rose-50 border border-rose-100 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Danger Zone</h3>
                        <p className="text-sm text-rose-600">Soft Deletes. (Route: DELETE /users/me)</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-rose-100/50">
                    <div className="space-y-1">
                        <p className="font-black text-slate-900 text-lg">Deactivate Account</p>
                        <p className="text-sm text-slate-500 max-w-md font-medium">Temporarily disable your profile and all websites. (isActive = false, deletedAt = now())</p>
                    </div>
                    <Button variant="destructive" className="rounded-2xl font-black h-14 px-8 shadow-lg shadow-rose-200" onClick={() => {
                        if (confirm("Are you sure you want to deactivate your account? This will log you out and deactivate all sites.")) {
                            alert("DELETE /users/me successful. Profile deactivated. Tokens revoked.");
                            window.location.href = "/";
                        }
                    }}>Deactivate Profile</Button>
                </div>
            </section>
        </div>
    );
};

// --- Sub-components for better organization & interactivity ---

const NavItem = ({ icon, label, active = false }) => (
    <Button
        variant="ghost"
        className={`w-full justify-start gap-3 h-11 transition-all duration-200 group ${active
            ? 'bg-primary/5 text-primary font-semibold'
            : 'text-slate-600 hover:text-slate-600 hover:bg-blue-50'
            }`}
    >
        <span className={`transition-colors duration-200 ${active
            ? 'text-primary'
            : 'text-slate-400 group-hover:text-slate-600'
            }`}>{icon}</span>
        {label}
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </Button>
);

const WebsiteCard = ({ site, index, onDelete, onEdit }) => {
    const template = templatesList.find(t => t.id === site.templateId);

    return (
        <Card className="group border-slate-200 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:scale-[1.01] bg-white rounded-3xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
                {/* Mockup Preview Area */}
                {template && template.id !== 'blank' ? (
                    <div className="absolute inset-0 p-4 transition-transform duration-500 group-hover:scale-105">
                        <img src={template.image} alt={site.name} className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm" />
                    </div>
                ) : (
                    <div className="absolute inset-0 p-4 transition-transform duration-500 group-hover:scale-105">
                        <div className="w-full h-full border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden">
                            <div className="h-6 bg-slate-50 border-b flex items-center px-3 gap-1.5 border-slate-100">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-3/4 bg-slate-100 rounded-full animate-pulse transition"></div>
                                <div className="h-3 w-1/2 bg-slate-100 rounded-full transition"></div>
                                <div className="flex gap-2 pt-2">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50"></div>
                                    <div className="h-8 w-8 rounded-lg bg-slate-50"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                <Files className="w-4 h-4" /> Duplicate
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
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${site.status === 'Published'
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
};

const EmptyState = ({ onAction }) => {

    return (
        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white p-12 text-center transition-all hover:border-primary/20 hover:bg-slate-50/50">
            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6">
                <Globe className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Your creative journey starts here</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Every great brand starts with a single page. Build yours with our visual canvas.
            </p>
            <Button size="lg" className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20" onClick={onAction}>
                <Plus className="w-5 h-5" /> Create Your First Site
            </Button>
        </div>
    );
};

export default Dashboard;