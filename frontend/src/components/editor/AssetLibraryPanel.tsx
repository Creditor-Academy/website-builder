import React, { useState, useRef } from 'react';
import { Search, Upload, X, Check, Image as ImageIcon, Video, Monitor, Link as LinkIcon, Trash2, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useBuilderStore from '@/store/useBuilderStore';

export function AssetLibraryPanel() {
    const { assets, addAsset, deleteAsset } = useBuilderStore();
    const [search, setSearch] = useState('');
    const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [urlName, setUrlName] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredMedia = assets.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

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

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        // Could add a toast notification here
    };

    const handleCopy = (id: string, url: string) => {
        copyToClipboard(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-white animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">Asset Library</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manage your media</p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 shadow-sm transition-all">
                                <PlusIcon className="w-4 h-4 text-primary" />
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

            <div className="p-3 border-b border-slate-100 bg-white">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                        placeholder="Search assets..."
                        className="pl-9 h-9 text-xs bg-slate-50 border-slate-100 focus:bg-white transition-all rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
                <div className="bg-white px-3 border-b border-slate-100">
                    <TabsList className="bg-transparent h-10 gap-4">
                        <TabsTrigger value="all" className="text-[11px] font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">All</TabsTrigger>
                        <TabsTrigger value="images" className="text-[11px] font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">Images</TabsTrigger>
                        <TabsTrigger value="videos" className="text-[11px] font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">Videos</TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4">
                        <TabsContent value="all" className="mt-0 outline-none">
                            {filteredMedia.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 opacity-20" />
                                    </div>
                                    <p className="text-[11px] font-medium italic">No assets found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {filteredMedia.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group relative aspect-square rounded-xl border border-slate-100 overflow-hidden bg-slate-50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                        >
                                            {item.type === 'image' ? (
                                                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                    <Video className="w-6 h-6 text-white/50" />
                                                </div>
                                            )}
                                            
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="h-7 text-[10px] w-full font-bold shadow-lg"
                                                    onClick={() => handleCopy(item.id, item.url)}
                                                >
                                                    {copiedId === item.id ? 'Copied!' : 'Copy Link'}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive" 
                                                    className="h-7 text-[10px] w-full font-bold shadow-lg bg-red-500 hover:bg-red-600 border-none"
                                                    onClick={() => deleteAsset(item.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                            
                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                                <p className="text-[9px] text-white truncate font-medium">{item.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="images" className="mt-0 outline-none">
                            {filteredMedia.filter(item => item.type === 'image').length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 opacity-20" />
                                    </div>
                                    <p className="text-[11px] font-medium italic">No images found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {filteredMedia.filter(item => item.type === 'image').map((item) => (
                                        <div
                                            key={item.id}
                                            className="group relative aspect-square rounded-xl border border-slate-100 overflow-hidden bg-slate-50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                        >
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                                <Button size="sm" variant="secondary" className="h-7 text-[10px] w-full font-bold shadow-lg" onClick={() => handleCopy(item.id, item.url)}>
                                                    {copiedId === item.id ? 'Copied!' : 'Copy Link'}
                                                </Button>
                                                <Button size="sm" variant="destructive" className="h-7 text-[10px] w-full font-bold shadow-lg bg-red-500 hover:bg-red-600 border-none" onClick={() => deleteAsset(item.id)}>Delete</Button>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                                <p className="text-[9px] text-white truncate font-medium">{item.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="videos" className="mt-0 outline-none">
                            {filteredMedia.filter(item => item.type === 'video').length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                        <Video className="w-6 h-6 opacity-20" />
                                    </div>
                                    <p className="text-[11px] font-medium italic">No videos found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {filteredMedia.filter(item => item.type === 'video').map((item) => (
                                        <div
                                            key={item.id}
                                            className="group relative aspect-square rounded-xl border border-slate-100 overflow-hidden bg-slate-50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                        >
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <Video className="w-6 h-6 text-white/50" />
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                                <Button size="sm" variant="secondary" className="h-7 text-[10px] w-full font-bold shadow-lg" onClick={() => handleCopy(item.id, item.url)}>
                                                    {copiedId === item.id ? 'Copied!' : 'Copy Link'}
                                                </Button>
                                                <Button size="sm" variant="destructive" className="h-7 text-[10px] w-full font-bold shadow-lg bg-red-500 hover:bg-red-600 border-none" onClick={() => deleteAsset(item.id)}>Delete</Button>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                                <p className="text-[9px] text-white truncate font-medium">{item.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>

            {/* URL Upload Dialog */}
            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Import via URL</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="url-name" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Asset Name</Label>
                            <Input
                                id="url-name"
                                placeholder="E.g. Logo, Banner Image..."
                                value={urlName}
                                onChange={(e) => setUrlName(e.target.value)}
                                className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white text-sm"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="url" className="text-xs font-bold text-slate-600 uppercase tracking-wider">Image or Video URL</Label>
                            <Input
                                id="url"
                                placeholder="https://example.com/image.png"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsUrlDialogOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                        <Button onClick={handleUrlUpload} disabled={!urlInput} className="rounded-xl font-bold shadow-lg shadow-primary/20">Import Asset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
