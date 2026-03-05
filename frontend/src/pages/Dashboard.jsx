import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Globe, MoreVertical, Edit2, Play, Trash2, Layout, Settings, LogOut, Clock, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useBuilderStore from '@/store/useBuilderStore';
import { format } from 'date-fns';
import business from "../assets/Bussiness.jpg";
import Ecommerce from "../assets/Ecomm.jpg";
import Portfolio from "../assets/Portfolio.jpg";

const templates = [
    { title: "eCommerce", image: Ecommerce },
    { title: "Portfolio", image: Portfolio },
    { title: "Business", image: business },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { websites, createWebsite, deleteWebsite, applyTemplateToWebsite } = useBuilderStore();
    const [newSiteName, setNewSiteName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('websites');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);

    const handleCreateSite = () => {
        if (!newSiteName.trim()) return;
        const id = createWebsite(newSiteName, selectedTemplate || 'blank');
        setNewSiteName('');
        setIsDialogOpen(false);
        setSelectedTemplate(null);
        navigate(`/builder/${id}`);
    };

    const handleApplyTemplate = () => {
        if (!selectedWebsiteId || !selectedTemplate) return;
        applyTemplateToWebsite(selectedWebsiteId, selectedTemplate);
        setIsDialogOpen(false);
        setSelectedTemplate(null);
        setSelectedWebsiteId(null);
        navigate(`/builder/${selectedWebsiteId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Helmet>
                <title>Dashboard - SiteBuilder</title>
            </Helmet>

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Layout className="w-6 h-6" /> SiteBuilder
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 ${activeTab === 'websites' ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:text-primary'}`}
                        onClick={() => setActiveTab('websites')}
                    >
                        <Globe className="w-4 h-4" /> My Websites
                    </Button>
                    <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 ${activeTab === 'templates' ? 'bg-slate-100 text-primary' : 'text-slate-600 hover:text-primary'}`}
                        onClick={() => setActiveTab('templates')}
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
                        <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                            {activeTab === 'websites' ? 'My Websites' : 'Template Gallery'}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {activeTab === 'websites' 
                                ? 'Manage and edit your digital projects' 
                                : 'Choose a professional template as your starting point'
                            }
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setSelectedTemplate(null);
                            setSelectedWebsiteId(null);
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button 
                                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                onClick={() => {
                                    setSelectedTemplate(null);
                                    setSelectedWebsiteId(null);
                                }}
                            >
                                <Plus className="w-5 h-5" /> Create New Website
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            {selectedTemplate ? (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Apply Template</DialogTitle>
                                        <DialogDescription>
                                            Select an existing website to apply the <span className="font-semibold text-primary">{selectedTemplate}</span> template to. This will overwrite its current layout.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                                        {websites.length > 0 ? websites.map(w => (
                                            <div 
                                                key={w.id} 
                                                onClick={() => setSelectedWebsiteId(w.id)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedWebsiteId === w.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">{w.name}</h4>
                                                    <p className="text-xs text-slate-500 mt-1">Last edited: {format(new Date(w.lastEdited), 'MMM d, h:mm a')}</p>
                                                </div>
                                                {selectedWebsiteId === w.id && <CheckCircle className="w-5 h-5 text-primary" />}
                                            </div>
                                        )) : (
                                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
                                                <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                <p className="text-sm font-medium text-slate-600">You don't have any websites yet.</p>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleApplyTemplate} disabled={!selectedWebsiteId || websites.length === 0}>Apply & Open Builder</Button>
                                    </DialogFooter>
                                </>
                            ) : (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>New Website</DialogTitle>
                                        <DialogDescription>
                                            Give your new website a name to get started.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Input
                                            placeholder="My Awesome Website"
                                            value={newSiteName}
                                            onChange={(e) => setNewSiteName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateSite()}
                                            autoFocus
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleCreateSite} disabled={!newSiteName.trim()}>Create Website</Button>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </header>

                {activeTab === 'websites' ? (
                    websites.length === 0 ? (
                        <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-white p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Globe className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">No websites yet</h3>
                            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                                Ready to start your next big project? Create your first website with our intuitive builder.
                            </p>
                            <Button variant="outline" className="mt-6" onClick={() => {
                                setSelectedTemplate(null);
                                setIsDialogOpen(true);
                            }}>
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
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {templates.map((template) => (
                            <div 
                                key={template.title}
                                className={`group relative cursor-pointer transition-all duration-300 ${
                                    selectedTemplate === template.title 
                                    ? 'ring-4 ring-primary ring-offset-4 scale-[1.02]' 
                                    : 'hover:scale-[1.01]'
                                }`}
                                onClick={() => setSelectedTemplate(selectedTemplate === template.title ? null : template.title)}
                            >
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-200 relative">
                                    <img 
                                        src={template.image} 
                                        alt={template.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    
                                    {/* Selection Overlay */}
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                                        selectedTemplate === template.title 
                                        ? 'bg-primary/10 opacity-100' 
                                        : 'bg-black/0 group-hover:bg-black/5 opacity-0 group-hover:opacity-100'
                                    }`} />

                                    {/* Selected Badge */}
                                    {selectedTemplate === template.title && (
                                        <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg animate-in zoom-in duration-300">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                    )}

                                    {/* Template Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                                        <Button 
                                            size="sm" 
                                            className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const existingSite = websites.find(w => w.name.toLowerCase() === template.title.toLowerCase());
                                                if (existingSite) {
                                                    applyTemplateToWebsite(existingSite.id, template.title);
                                                    navigate(`/builder/${existingSite.id}`);
                                                } else {
                                                    const newId = createWebsite(template.title, template.title);
                                                    navigate(`/builder/${newId}`);
                                                }
                                            }}
                                        >
                                            Use Template
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
