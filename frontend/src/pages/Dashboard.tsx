import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Globe, MoreVertical, Edit2, Play, Trash2, Layout, Settings, LogOut, Clock, CheckCircle, FileText, ShoppingBag, Building2, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';

const Dashboard = () => {
    const navigate = useNavigate();
    const { websites, createWebsite, deleteWebsite } = useBuilderStore();
    const [newSiteName, setNewSiteName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('websites'); // 'websites' or 'templates'

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
        { id: 'agencies', name: 'Agencies', desc: 'Creative & marketing agency layout', icon: Globe, color: 'bg-indigo-100 text-indigo-600' },
        { id: 'coaching', name: 'Coaching', desc: 'Course & mentorship layout', icon: Sparkles, color: 'bg-rose-100 text-rose-600' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Helmet>
                <title>Dashboard - Buildora</title>
            </Helmet>

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Layout className="w-6 h-6" /> Buildora
                    </h1>
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
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">JD</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">John Doe</p>
                            <p className="text-xs text-slate-500 truncate">john@example.com</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 leading-tight">My Websites</h2>
                        <p className="text-slate-500 mt-1">Manage and edit your digital projects</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                <Plus className="w-5 h-5" /> Create New Website
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Website</DialogTitle>
                                <DialogDescription>
                                    Choose a name and template to jumpstart your project.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site Name</label>
                                    <Input
                                        placeholder="My Awesome Website"
                                        value={newSiteName}
                                        onChange={(e) => setNewSiteName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                        autoFocus
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Template</label>
                                    <div className="grid grid-cols-1 gap-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                        {templatesList.map((tpl) => (
                                            <button
                                                key={tpl.id}
                                                onClick={() => setSelectedTemplate(tpl.id)}
                                                className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                                                    selectedTemplate === tpl.id 
                                                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                                                    : 'border-slate-100 hover:border-slate-200 bg-white'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tpl.color}`}>
                                                    <tpl.icon className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-bold text-sm ${selectedTemplate === tpl.id ? 'text-primary' : 'text-slate-900'}`}>{tpl.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{tpl.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateSite} disabled={!newSiteName.trim()}>Create Website</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {websites.map((site) => (
                            <Card key={site.id} className="group overflow-hidden border-slate-200 hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-white">
                                <div className="aspect-video bg-slate-100 relative group-hover:opacity-90 transition-opacity flex items-center justify-center p-4">
                                    <div className="w-full h-full border border-slate-200 rounded-md bg-white shadow-sm overflow-hidden flex flex-col pointer-events-none">
                                        <div className="h-4 bg-slate-50 border-b flex items-center px-2 gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                        </div>
                                        <div className="flex-1 p-3 space-y-2">
                                            <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                            <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                                            <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" className="gap-2" onClick={() => navigate(`/builder/${site.id}`)}>
                                            <Edit2 className="w-4 h-4" /> Edit Site
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                                    <div className="min-w-0">
                                        <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">{site.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1.5 mt-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            Last edited {format(new Date(site.lastEdited), 'MMM d, h:mm a')}
                                        </CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => navigate(`/builder/${site.id}`)} className="gap-2">
                                                <Edit2 className="w-4 h-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Play className="w-4 h-4" /> Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Globe className="w-4 h-4" /> Publish
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => deleteWebsite(site.id)}>
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardFooter className="px-4 py-3 bg-slate-50 border-t flex justify-between items-center">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${site.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {site.status === 'Published' && <CheckCircle className="w-3 h-3" />}
                                        {site.status}
                                    </span>
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark font-medium h-7" onClick={() => navigate(`/builder/${site.id}`)}>
                                        Open Builder
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
