import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import {
    FileText,
    Plus,
    MoreVertical,
    Copy,
    Trash2,
    Settings,
    Search,
    Check,
    Globe,
    Utensils,
    Image as ImageIcon,
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

function getPageIcon(page: { name: string; slug: string }) {
    const key = `${page.slug} ${page.name}`.toLowerCase();
    if (page.slug === '/' || page.name.toLowerCase() === 'home') return Globe;
    if (key.includes('menu')) return Utensils;
    if (key.includes('gallery')) return ImageIcon;
    return FileText;
}

export function PageManager() {
    const { state, pages, setActivePage, addPage, duplicatePage, deletePage } = useBuilder();
    const renamePage = useBuilderStore((store) => store.renamePage);
    const setHomePage = useBuilderStore((store) => store.setHomePage);
    const { page: activePage } = state;
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [renameId, setRenameId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

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
        <div className="h-full flex flex-col bg-white">
            <div className="h-12 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-sm font-semibold text-slate-900">Pages</h2>
                <button
                    type="button"
                    className="h-7 w-7 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center"
                    onClick={() => setIsAddOpen(true)}
                    aria-label="Add page"
                >
                    <Plus className="w-4 h-4" strokeWidth={1.75} />
                </button>
            </div>

            <div className="px-3 py-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <Input
                        placeholder="Find a page..."
                        className="pl-9 h-9 text-xs bg-slate-100 border-transparent rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-slate-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
                {filteredPages.map((p) => {
                    const isIndex = p.slug === '/';
                    const isActive = activePage?.id === p.id;
                    const PageIcon = getPageIcon(p);

                    return (
                        <div
                            key={p.id}
                            onClick={() => setActivePage(p.id)}
                            className={`group flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer ${
                                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                                    isActive ? 'bg-neutral-900 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    <PageIcon className="w-4 h-4" strokeWidth={1.75} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[13px] font-medium truncate text-slate-900">
                                            {p.name}
                                        </p>
                                        {isIndex && (
                                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-500 uppercase tracking-wide">
                                                Home
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 truncate">{p.slug}</p>
                                </div>
                            </div>

                            <div className="flex items-center opacity-0 group-hover:opacity-100">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-200/70" onClick={(e) => e.stopPropagation()}>
                                            <MoreVertical className="w-4 h-4 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                                        <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); setActivePage(p.id); }}>
                                            <Check className="w-4 h-4" /> Set Active
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); setHomePage(p.id); }}>
                                            <Globe className="w-4 h-4" /> Set as Home
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 rounded-lg" onClick={(e) => { e.stopPropagation(); setRenameId(p.id); setRenameValue(p.name); }}>
                                            <Settings className="w-4 h-4" /> Rename
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
                    <div className="text-center py-12">
                        <FileText className="w-8 h-8 mx-auto mb-3 text-slate-200" />
                        <p className="text-xs text-slate-400">No pages found</p>
                    </div>
                )}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-sm rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold tracking-tight">New Page</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Page Title</Label>
                            <Input
                                placeholder="e.g., Services, Our Story"
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                className="h-11 rounded-lg border-slate-200 bg-slate-50"
                                autoFocus
                            />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg flex gap-3">
                            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4 text-slate-500" />
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                                New pages automatically inherit your site's global Navbar and Footer configurations.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-lg flex-1 text-slate-500" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button className="rounded-lg flex-1 bg-neutral-900 hover:bg-neutral-800" onClick={handleCreatePage}>Create Page</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(renameId)} onOpenChange={(open) => { if (!open) setRenameId(null); }}>
                <DialogContent className="max-w-sm rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold tracking-tight">Rename Page</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="h-11 rounded-lg border-slate-200 bg-slate-50"
                        autoFocus
                    />
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-lg flex-1 text-slate-500" onClick={() => setRenameId(null)}>Cancel</Button>
                        <Button className="rounded-lg flex-1 bg-neutral-900 hover:bg-neutral-800" onClick={() => {
                            if (renameId) renamePage(renameId, renameValue);
                            setRenameId(null);
                        }}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="px-4 py-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 italic">
                    Tip: Home page slug (/) cannot be changed
                </p>
            </div>
        </div>
    );
}
