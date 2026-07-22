import React, { useEffect, useState, useRef } from 'react';
import { Search, Upload, Check, Image as ImageIcon, Video, Monitor, Link as LinkIcon, Trash2, Copy, Loader2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { DuplicateAssetDialog } from "../components/ui/DuplicateAssetDialog";

import { useToast } from "../hooks/use-toast";
import useBuilderStore from '../store/useBuilderStore';


export default function DashboardAssets() {
    const { deleteAsset, fetchAssets, getScopedAssets, uploadAsset, importAssetFromUrl } = useBuilderStore();

    const [isFetching, setIsFetching] = useState(true);
    const [uploadingCount, setUploadingCount] = useState(0);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    // duplicate-name conflict state
    const [dupFile, setDupFile] = useState<File | null>(null);
    const [dupConflictName, setDupConflictName] = useState('');

    useEffect(() => {
        setIsFetching(true);
        void fetchAssets().finally(() => setIsFetching(false));
    }, [fetchAssets]);

    const [search, setSearch] = useState('');
    const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [urlName, setUrlName] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const assets = getScopedAssets();

    const filteredMedia = assets.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (e.target) e.target.value = ''; // reset input immediately so the same file can be re-picked

        // Size guard
        if (file.size > 100 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed size is 100 MB.`,
            });
            return;
        }

        // Duplicate name check (compare base names, case-insensitive)
        const incomingBase = file.name.replace(/\.[^/.]+$/, '').toLowerCase();
        const conflict = assets.find(a => a.name.replace(/\.[^/.]+$/, '').toLowerCase() === incomingBase);
        if (conflict) {
            setDupConflictName(conflict.name);
            setDupFile(file);
            return; // wait for user decision in the dialog
        }

        await doUpload(file);
    };

    /** Performs the actual upload with an optional renamed File object */
    const doUpload = async (file: File) => {
        setUploadingCount(c => c + 1);
        try {
            await uploadAsset(file);
            toast({ title: "Asset Uploaded", description: "Your asset has been successfully uploaded." });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.response?.data?.message || error.response?.data?.error || "Failed to upload asset.",
            });
        } finally {
            setUploadingCount(c => c - 1);
        }
    };

    const handleDupReplace = async (file: File) => {
        setDupFile(null);
        await doUpload(file);
    };

    const handleDupRename = async (file: File, newName: string) => {
        setDupFile(null);
        const renamed = new File([file], newName, { type: file.type });
        await doUpload(renamed);
    };

    const handleDupCancel = () => setDupFile(null);

    const handleUrlUpload = async () => {
        if (urlInput) {
            setUploadingCount(c => c + 1);
            try {
                await importAssetFromUrl(urlName || 'Imported Asset', urlInput);
                toast({ title: "Asset Imported", description: "Your asset has been successfully imported." });
                setUrlInput('');
                setUrlName('');
                setIsUrlDialogOpen(false);
            } catch (error: any) {
                toast({ 
                    variant: "destructive", 
                    title: "Import Failed", 
                    description: error.response?.data?.message || error.response?.data?.error || "Failed to import asset." 
                });
            } finally {
                setUploadingCount(c => c - 1);
            }
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
    };

    const handleCopy = (id: string, url: string) => {
        copyToClipboard(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: string) => {
        setDeletingIds(prev => new Set(prev).add(id));
        try {
            await deleteAsset(id);
            toast({ title: "Asset Deleted", description: "The asset has been removed." });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Delete Failed",
                description: error.response?.data?.message || error.response?.data?.error || "Failed to delete asset.",
            });
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8 min-h-[80vh]">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> / <span className="font-semibold text-slate-700">Media Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Media Management</h2>
                    <p className="text-slate-500 mt-1">Manage the global asset library outside individual websites.</p>
        </div>
                
        <div className="flex items-center gap-3">
                   <div className="relative flex-1 w-full">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <Input
                            placeholder="Search assets..."
                            className="pl-11 pr-4 w-full h-11 rounded-full bg-white border-slate-200 
                       shadow-md shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/50 
                       focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/40 focus:outline-none transition-all duration-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                   </div>
                   
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          disabled={uploadingCount > 0}
                          className="w-full md:w-auto h-11 bg-blue-600 text-white font-semibold rounded-full shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {uploadingCount > 0
                            ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Uploading…</>
                            : <><Upload className="w-5 h-5 mr-2" />Add Assets</>
                          }
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-200 shadow-xl mt-2">
                         <DropdownMenuItem 
                            className="cursor-pointer gap-3 p-3 rounded-lg hover:bg-slate-50 font-bold text-slate-700" 
                            onSelect={() => fileInputRef.current?.click()}
                         >
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                               <Monitor className="w-4 h-4" />
                            </div>
                            Upload from Disk
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                            className="cursor-pointer gap-3 p-3 rounded-lg hover:bg-slate-50 font-bold text-slate-700 mt-1" 
                            onSelect={() => setIsUrlDialogOpen(true)}
                         >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                               <LinkIcon className="w-4 h-4" />
                            </div>
                            Import from URL
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

            <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                   <TabsList className="flex items-center gap-2 bg-transparent p-0 h-auto">
                       {['all', 'images', 'videos'].map(tab => (
                          <TabsTrigger 
                            key={tab} 
                            value={tab} 
                            className="rounded-full h-10 px-4 text-sm font-semibold transition-all duration-200
                              data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 data-[state=active]:hover:bg-blue-700
                              data-[state=inactive]:bg-white data-[state=inactive]:text-slate-700 data-[state=inactive]:border-slate-200 data-[state=inactive]:hover:bg-slate-100 data-[state=inactive]:hover:text-indigo-700"
                          >
                             {tab === 'all' ? 'All Assets' : tab === 'images' ? 'Images' : 'Videos'}
                          </TabsTrigger>
                       ))}
                   </TabsList>
                   
                   <div className="flex gap-2 items-center">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-slate-500 border border-slate-200 font-semibold text-xs uppercase tracking-wider">
                         Total: <span className="text-slate-900 font-bold">{filteredMedia.length}</span>
                      </div>
                   </div>
                </div>

                <div className="min-h-[400px]">
                   {isFetching ? (
                      /* ── Initial fetch skeleton ── */
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                         {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex flex-col rounded-2xl shadow-md bg-white overflow-hidden animate-pulse">
                               <div className="aspect-square bg-slate-200" />
                               <div className="p-4 space-y-2">
                                  <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                                  <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                   ['all', 'images', 'videos'].map(tabType => (
                      <TabsContent key={tabType} value={tabType} className="mt-0 outline-none">
                         {filteredMedia.filter(m => tabType === 'all' || m.type === tabType.slice(0, -1)).length === 0 && uploadingCount === 0 ? (
                            <div className="h-[400px] flex flex-col items-center justify-center text-slate-300 gap-4 border-2 border-dashed border-slate-50 rounded-3xl bg-slate-50/20">
                                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm">
                                   {tabType === 'videos' ? <Video className="w-8 h-8 opacity-20" /> : <ImageIcon className="w-8 h-8 opacity-20" />}
                                </div>
                                <div className="text-center">
                                   <p className="text-sm font-black text-slate-900">No {tabType} found</p>
                                   <p className="text-xs text-slate-400 font-medium mt-1">Try searching another keyword or upload new media</p>
                                </div>
                            </div>
                         ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">

                                {/* ── Upload skeleton placeholders ── */}
                                {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
                                   <div key={`uploading-${i}`} className="flex flex-col rounded-2xl shadow-md bg-white overflow-hidden animate-pulse">
                                      <div className="aspect-square bg-slate-200 flex flex-col items-center justify-center gap-2">
                                         <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                         <span className="text-[11px] font-semibold text-slate-400">Uploading…</span>
                                      </div>
                                      <div className="p-4 space-y-2">
                                         <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                                         <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
                                      </div>
                                   </div>
                                ))}

                                {filteredMedia.filter(m => tabType === 'all' || m.type === tabType.slice(0, -1)).map((item) => (
                                    <div
                                        key={item.id}
                                        className={`group/media relative flex flex-col rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white ${
                                            deletingIds.has(item.id)
                                                ? 'opacity-60 scale-[0.97] pointer-events-none'
                                                : 'hover:scale-[1.02]'
                                        }`}
                                    >
                                        <div className="aspect-square relative overflow-hidden bg-slate-100 rounded-t-2xl">
                                           {item.type === 'image' ? (
                                               <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105" />
                                           ) : (
                                               <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                   <Video className="w-10 h-10 text-white/40" />
                                               </div>
                                           )}
                                           {/* Gradient Overlay */}
                                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"></div>

                                           {/* Delete loading overlay */}
                                           {deletingIds.has(item.id) ? (
                                               <div className="absolute inset-0 bg-rose-900/70 flex flex-col items-center justify-center gap-2 z-30 backdrop-blur-[3px]">
                                                   <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                   <span className="text-[11px] font-semibold text-white/80">Deleting…</span>
                                               </div>
                                           ) : (
                                           <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/media:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-[4px]">
                                               <Button 
                                                  size="sm" 
                                                  className="bg-blue-600 text-white font-semibold rounded-full px-6 h-11 text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                                                  onClick={() => handleCopy(item.id, item.url)}
                                               >
                                                  {copiedId === item.id ? <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Copied</div> : <div className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Copy Link</div>}
                                               </Button>
                                               <Button 
                                                  size="sm" 
                                                  variant="destructive" 
                                                  className="h-11 px-6 text-sm font-semibold rounded-full shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:scale-105 transition-all duration-200" 
                                                  onClick={() => void handleDelete(item.id)}
                                               >
                                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                               </Button>
                                           </div>
                                           )}

                                           <div className="absolute top-4 left-4 flex gap-2">
                                              <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs capitalize">
                                                 {item.type || 'File'}
                                              </Badge>
                                              {item.isGlobal && (
                                              <Badge className="bg-amber-100 text-amber-700 font-medium px-3 py-1 rounded-full text-xs">
                                                 Platform
                                              </Badge>
                                              )}
                                           </div>
                                        </div>
                                        
                                        <div className="p-4 bg-white grow flex flex-col">
                                            <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                                               <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.size}</p>
                                               <p className="text-xs text-slate-500 font-medium opacity-0 group-hover/media:opacity-100 transition-opacity">
                                                  {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                               </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         )}
                      </TabsContent>
                   ))
                   )}
                </div>
            </Tabs>

            {/* URL Upload Dialog */}
            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-8 pb-4">
                       <DialogHeader>
                           <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                 <LinkIcon className="w-5 h-5" />
                              </div>
                              Import via URL
                           </DialogTitle>
                       </DialogHeader>
                       <div className="grid gap-6 py-8">
                           <div className="grid gap-3">
                               <Label htmlFor="url-name" className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Asset Name</Label>
                               <Input
                                   id="url-name"
                                   placeholder="E.g. Brand Logo, Background Video..."
                                   value={urlName}
                                   onChange={(e) => setUrlName(e.target.value)}
                                   className="h-12 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-sm font-medium focus-visible:ring-indigo-100 transition-all"
                               />
                           </div>
                           <div className="grid gap-3">
                               <Label htmlFor="url" className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Media Source URL</Label>
                               <Input
                                   id="url"
                                   placeholder="https://images.unsplash.com/..."
                                   value={urlInput}
                                   onChange={(e) => setUrlInput(e.target.value)}
                                   className="h-12 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white text-sm font-medium focus-visible:ring-indigo-100 transition-all"
                               />
                               <p className="text-[10px] text-slate-500 font-medium ml-1">Supports direct image and video links (jpg, png, mp4, etc.)</p>
                           </div>
                       </div>
                    </div>
                    <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-200/60">
                        <Button variant="ghost" onClick={() => setIsUrlDialogOpen(false)} className="rounded-xl font-black text-slate-500 text-xs px-6 h-11 tracking-widest uppercase hover:bg-slate-100">Cancel</Button>
                        <Button onClick={handleUrlUpload} disabled={!urlInput} className="rounded-xl font-black text-xs px-8 h-11 tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 shadow-opacity-40">Import Asset</Button>
                    </div>
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
    </Card>
  );
}