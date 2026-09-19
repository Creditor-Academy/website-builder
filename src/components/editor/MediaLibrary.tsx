import React, { useEffect, useState, useRef } from 'react';
import { Search, Upload, Check, Image as ImageIcon, Video, Link as LinkIcon, Monitor, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useBuilderStore from '@/store/useBuilderStore';
import { useToast } from '@/hooks/use-toast';
import { DuplicateAssetDialog } from '@/components/ui/DuplicateAssetDialog';

interface MediaLibraryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (urls: string[]) => void;
}

export function MediaLibrary({ open, onOpenChange, onSelect }: MediaLibraryProps) {
    const { activeWebsiteId, fetchAssets, getScopedAssets, uploadAsset, importAssetFromUrl } = useBuilderStore();
    const { toast } = useToast();
    useEffect(() => {
        if (open && activeWebsiteId) {
            // Fetch both website-scoped assets AND global (dashboard) assets in parallel
            void fetchAssets({ websiteId: activeWebsiteId });
            void fetchAssets();
        }
    }, [activeWebsiteId, open, fetchAssets]);

    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [urlName, setUrlName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const assets = activeWebsiteId ? getScopedAssets(activeWebsiteId) : [];
    // duplicate-name conflict state
    const [dupFile, setDupFile] = useState<File | null>(null);
    const [dupConflictName, setDupConflictName] = useState('');

    const filteredMedia = assets.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (itemId: string) => {
        setSelectedIds(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId) 
                : [...prev, itemId]
        );
    };

    const handleConfirmSelect = () => {
        const selectedUrls = assets
            .filter(asset => selectedIds.includes(asset.id))
            .map(asset => asset.url);
        
        if (selectedUrls.length > 0) {
            onSelect(selectedUrls);
            onOpenChange(false);
            setSelectedIds([]); // Reset selection for next time
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeWebsiteId) return;

        if (e.target) e.target.value = '';

        // Size guard
        if (file.size > 100 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed size is 100 MB.`,
            });
            return;
        }

        // Duplicate name check
        const incomingBase = file.name.replace(/\.[^/.]+$/, '').toLowerCase();
        const conflict = assets.find(a => a.name.replace(/\.[^/.]+$/, '').toLowerCase() === incomingBase);
        if (conflict) {
            setDupConflictName(conflict.name);
            setDupFile(file);
            return;
        }

        await doUpload(file);
    };

    const doUpload = async (file: File) => {
        if (!activeWebsiteId) return;
        try {
            await uploadAsset(file, { websiteId: activeWebsiteId });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.response?.data?.message || error.response?.data?.error || "Failed to upload asset.",
            });
        }
    };

    const handleDupReplace = async (file: File) => {
        setDupFile(null);
        await doUpload(file);
    };

    const handleDupRename = async (file: File, newName: string) => {
        setDupFile(null);
        await doUpload(new File([file], newName, { type: file.type }));
    };

    const handleDupCancel = () => setDupFile(null);

    const handleUrlUpload = async () => {
        if (urlInput && activeWebsiteId) {
            await importAssetFromUrl(urlName || 'Imported Asset', urlInput, { websiteId: activeWebsiteId });
            setUrlInput('');
            setUrlName('');
            setIsUrlDialogOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setSelectedIds([]); // Reset on close
        }}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Media Library</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
                    <div className="p-4 bg-white border-b flex items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search media..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="gap-2">
                                        <Upload className="w-4 h-4" /> Upload
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem className="cursor-pointer gap-2" onSelect={() => fileInputRef.current?.click()}>
                                        <Monitor className="w-4 h-4" /> From Disk
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer gap-2" onSelect={() => setIsUrlDialogOpen(true)}>
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
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
                        <div className="bg-white px-4 border-b">
                            <TabsList className="bg-transparent h-12 gap-6">
                                <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">All Assets</TabsTrigger>
                                <TabsTrigger value="images" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">Images</TabsTrigger>
                                <TabsTrigger value="videos" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">Videos</TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <TabsContent value="all" className="mt-0 outline-none">
                                {filteredMedia.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                        <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No assets found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {filteredMedia.map((item) => {
                                            const isSelected = selectedIds.includes(item.id);
                                            const isGlobal = !item.websiteId || item.scope === 'GLOBAL' || item.isGlobal;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-slate-200'}`}
                                                    onClick={() => handleSelect(item.id)}
                                                >
                                                    {item.type === 'image' ? (
                                                        <img src={item.url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                            <Video className="w-8 h-8 text-white/50" />
                                                        </div>
                                                    )}
                                                    {isGlobal && (
                                                        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-amber-400/90 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                                            <Globe className="w-2.5 h-2.5" />
                                                            Global
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">
                                                            {isSelected ? 'Deselect' : 'Select'}
                                                        </span>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform scale-110">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                        <p className="text-[10px] text-white truncate font-medium">{item.name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="images" className="mt-0 outline-none">
                                {filteredMedia.filter(m => m.type === 'image').length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                        <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No images found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {filteredMedia.filter(m => m.type === 'image').map((item) => {
                                            const isSelected = selectedIds.includes(item.id);
                                            const isGlobal = !item.websiteId || item.scope === 'GLOBAL' || item.isGlobal;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-slate-200'}`}
                                                    onClick={() => handleSelect(item.id)}
                                                >
                                                    <img src={item.url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                                                    {isGlobal && (
                                                        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-amber-400/90 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                                            <Globe className="w-2.5 h-2.5" />
                                                            Global
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">
                                                            {isSelected ? 'Deselect' : 'Select'}
                                                        </span>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform scale-110">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                        <p className="text-[10px] text-white truncate font-medium">{item.name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="videos" className="mt-0 outline-none">
                                {filteredMedia.filter(m => m.type === 'video').length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                        <Video className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No videos found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {filteredMedia.filter(m => m.type === 'video').map((item) => {
                                            const isSelected = selectedIds.includes(item.id);
                                            const isGlobal = !item.websiteId || item.scope === 'GLOBAL' || item.isGlobal;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-slate-200'}`}
                                                    onClick={() => handleSelect(item.id)}
                                                >
                                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                        <Video className="w-8 h-8 text-white/50" />
                                                    </div>
                                                    {isGlobal && (
                                                        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-amber-400/90 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                                            <Globe className="w-2.5 h-2.5" />
                                                            Global
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">
                                                            {isSelected ? 'Deselect' : 'Select'}
                                                        </span>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform scale-110">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                        <p className="text-[10px] text-white truncate font-medium">{item.name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>

                <div className="p-4 border-t bg-white flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button 
                        disabled={selectedIds.length === 0} 
                        onClick={handleConfirmSelect}
                        className="bg-primary hover:bg-primary/90 text-white px-8"
                    >
                        Insert into site ({selectedIds.length})
                    </Button>
                </div>
            </DialogContent>

            {/* URL Upload Dialog */}
            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent className="sm:max-w-md">
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
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="url" className="text-sm font-medium">Image or Video URL</label>
                            <Input
                                id="url"
                                placeholder="https://example.com/image.png"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUrlDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUrlUpload} disabled={!urlInput}>Import Asset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Duplicate name conflict dialog */}
            <DuplicateAssetDialog
                file={dupFile}
                conflictingName={dupConflictName}
                onReplace={handleDupReplace}
                onRename={handleDupRename}
                onCancel={handleDupCancel}
            />
        </Dialog>
    );
}
