import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import {
    FileText,
    Plus,
    MoreVertical,
    Copy,
    Trash2,
    Settings,
    Search,
    Check,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export function PageManager() {
    const { state, pages, setActivePage, addPage, duplicatePage, deletePage } = useBuilder();
    const { page: activePage } = state;
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newPageName, setNewPageName] = useState('');

    const filteredPages = pages.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleCreatePage = () => {
        if (!newPageName.trim()) return;
        addPage({
            name: newPageName,
            slug: `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`,
            sections: []
        });
        setNewPageName('');
        setIsAddOpen(false);
    };

    return (
        <div className="h-full flex flex-col bg-white animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Pages</h2>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    onClick={() => setIsAddOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Find a page..."
                        className="pl-9 bg-white h-9 text-xs border-slate-200 rounded-xl shadow-sm focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredPages.map((p) => {
                    const isIndex = p.slug === '/';
                    const isActive = activePage?.id === p.id;

                    return (
                        <div
                            key={p.id}
                            onClick={() => setActivePage(p.id)}
                            className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${isActive
                                ? 'bg-primary/5 border-primary/20 shadow-sm translate-x-1'
                                : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50'
                                }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${isActive ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-50 text-slate-400'
                                    }`}>
                                    {isIndex ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-[13px] font-bold truncate ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                                            {p.name}
                                        </p>
                                        {isIndex && (
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tighter">Home</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono truncate">{p.slug}</p>
                                </div>
                            </div>

                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100" onClick={(e) => e.stopPropagation()}>
                                            <MoreVertical className="w-4 h-4 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                                        <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); setActivePage(p.id); }}>
                                            <Check className="w-4 h-4" /> Set Active
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); duplicatePage(p.id); }}>
                                            <Copy className="w-4 h-4" /> Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-50" />
                                        <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); }}>
                                            <Settings className="w-4 h-4" /> SEO Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-50" />
                                        <DropdownMenuItem disabled={isIndex} className="gap-2 text-destructive focus:text-destructive rounded-lg" onClick={(e) => { e.stopPropagation(); deletePage(p.id); }}>
                                            <Trash2 className="w-4 h-4" /> Delete Page
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                })}
                {filteredPages.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-50 rounded-2xl bg-white">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-slate-100" />
                        <p className="text-xs text-slate-400 font-medium">No pages found</p>
                    </div>
                )}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-sm rounded-3xl p-6 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">New Page</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Page Title</Label>
                            <Input
                                placeholder="e.g., Services, Our Story"
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                className="h-11 rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50/50"
                                autoFocus
                            />
                        </div>
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4 text-primary" />
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                New pages automatically inherit your site's global Navbar and Footer configurations.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-xl flex-1 font-bold text-slate-500" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl flex-1 font-bold shadow-lg shadow-primary/20" onClick={handleCreatePage}>Create Page</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="p-4 border-t border-slate-100 bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
                <p className="text-[10px] text-slate-400 text-center font-medium italic">
                    Tip: Home page slug (/) cannot be changed
                </p>
            </div>
        </div>
    );
}
