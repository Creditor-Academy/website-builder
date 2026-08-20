import React, { useEffect, useState, useRef } from 'react';
import { Search, Upload, Check, Image as ImageIcon, Video, Monitor, Link as LinkIcon, Trash2, Copy, Loader2 } from 'lucide-react';
import { Button } from "../components/ui/button";
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
import { cn } from '@/lib/utils';

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
    <div className="admin-page">
      {/* Header bar — match Templates Library */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              Media Management
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Manage the global asset library outside individual websites.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto md:justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={uploadingCount > 0}
                  className="h-10 w-full rounded-full bg-white px-5 text-xs font-semibold text-[#0F172A] shadow-none hover:bg-slate-100 hover:text-[#0F172A] hover:scale-100 active:scale-100 disabled:opacity-60 md:h-11 md:w-auto md:text-sm"
                >
                  {uploadingCount > 0
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
                    : <><Upload className="mr-2 h-4 w-4" />Add Assets</>
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-56 rounded-xl border-[#E8E8E8] p-2 shadow-xl">
                <DropdownMenuItem
                  className="cursor-pointer gap-3 rounded-lg p-3 font-bold text-[#0F172A] hover:bg-[#F4F4F5]"
                  onSelect={() => fileInputRef.current?.click()}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F5] text-[#0F172A]">
                    <Monitor className="h-4 w-4" />
                  </div>
                  Upload from Disk
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="mt-1 cursor-pointer gap-3 rounded-lg p-3 font-bold text-[#0F172A] hover:bg-[#F4F4F5]"
                  onSelect={() => setIsUrlDialogOpen(true)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <LinkIcon className="h-4 w-4" />
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
      </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                   <TabsList className="flex h-auto flex-wrap items-center gap-1.5 bg-transparent p-0 sm:gap-2">
                       {['all', 'images', 'videos'].map(tab => (
                          <TabsTrigger 
                            key={tab} 
                            value={tab} 
                            className="h-8 rounded-full border border-transparent px-3 text-xs font-semibold transition-colors duration-200 sm:h-9 sm:px-3.5 sm:text-[13px]
                              data-[state=active]:border-[#0F172A] data-[state=active]:bg-[#0F172A] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:hover:bg-[#1E293B]
                              data-[state=inactive]:border-[#E5E7EB] data-[state=inactive]:bg-white data-[state=inactive]:text-[#0F172A] data-[state=inactive]:hover:border-[#CBD5E1] data-[state=inactive]:hover:bg-[#F8FAFC]"
                          >
                             {tab === 'all' ? 'All Assets' : tab === 'images' ? 'Images' : 'Videos'}
                          </TabsTrigger>
                       ))}
                   </TabsList>

                   <div className="flex w-full items-center gap-2 md:ml-auto md:w-auto">
                      <div className="relative min-w-0 flex-1 md:w-64 lg:w-72 md:flex-none">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
                        <Input
                          placeholder="Search assets..."
                          className="h-9 w-full rounded-full border-[#E5E7EB] bg-white pl-9 text-sm text-[#0F172A] shadow-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F4F4F5] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#747781]">
                         Total: <span className="font-bold text-[#0F172A]">{filteredMedia.length}</span>
                      </div>
                   </div>
                </div>

                <div className="min-h-[400px]">
                   {isFetching ? (
                      /* ── Initial fetch skeleton ── */
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
                         {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm animate-pulse">
                               <div className="aspect-[16/10] bg-slate-200" />
                               <div className="space-y-2 p-4">
                                  <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                                  <div className="h-2.5 w-1/2 rounded-full bg-[#F4F4F5]" />
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                   ['all', 'images', 'videos'].map(tabType => (
                      <TabsContent key={tabType} value={tabType} className="mt-0 outline-none">
                         {filteredMedia.filter(m => tabType === 'all' || m.type === tabType.slice(0, -1)).length === 0 && uploadingCount === 0 ? (
                            <div className="flex h-[400px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-slate-100 bg-[#F4F4F5]/20 text-slate-300">
                                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-white bg-[#F4F4F5] shadow-sm">
                                   {tabType === 'videos' ? <Video className="h-8 w-8 opacity-20" /> : <ImageIcon className="h-8 w-8 opacity-20" />}
                                </div>
                                <div className="text-center">
                                   <p className="text-sm font-black text-[#0F172A]">No {tabType} found</p>
                                   <p className="mt-1 text-xs font-medium text-[#787778]">Try searching another keyword or upload new media</p>
                                </div>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">

                                {/* ── Upload skeleton placeholders ── */}
                                {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
                                   <div key={`uploading-${i}`} className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm animate-pulse">
                                      <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 bg-slate-200">
                                         <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                                         <span className="text-[11px] font-semibold text-[#787778]">Uploading…</span>
                                      </div>
                                      <div className="space-y-2 p-4">
                                         <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                                         <div className="h-2.5 w-1/2 rounded-full bg-[#F4F4F5]" />
                                      </div>
                                   </div>
                                ))}

                                {filteredMedia.filter(m => tabType === 'all' || m.type === tabType.slice(0, -1)).map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                          "group/media relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md",
                                          deletingIds.has(item.id) && "pointer-events-none opacity-60"
                                        )}
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F4F5]">
                                           {item.type === 'image' ? (
                                               <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                                           ) : (
                                               <div className="flex h-full w-full items-center justify-center bg-slate-900">
                                                   <Video className="h-10 w-10 text-white/40" />
                                               </div>
                                           )}

                                           {/* Soft overlay on hover — no blur / no scale */}
                                           <div className="absolute inset-0 bg-slate-900/35 opacity-0 transition-opacity duration-200 group-hover/media:opacity-100" />

                                           {deletingIds.has(item.id) ? (
                                               <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-rose-900/70">
                                                   <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                   <span className="text-[11px] font-semibold text-white/80">Deleting…</span>
                                               </div>
                                           ) : (
                                           <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover/media:opacity-100">
                                               <Button
                                                  size="sm"
                                                  className="h-10 rounded-full bg-[#0F172A] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1E293B] hover:text-white hover:scale-100 active:scale-100"
                                                  onClick={() => handleCopy(item.id, item.url)}
                                               >
                                                  {copiedId === item.id
                                                    ? <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> Copied</span>
                                                    : <span className="flex items-center gap-2"><Copy className="h-3.5 w-3.5" /> Copy Link</span>}
                                               </Button>
                                               <Button
                                                  size="sm"
                                                  className="h-10 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white shadow-none hover:bg-rose-700 hover:text-white hover:scale-100 active:scale-100"
                                                  onClick={() => void handleDelete(item.id)}
                                               >
                                                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                                               </Button>
                                           </div>
                                           )}

                                           <div className="absolute left-3 top-3 z-10 flex gap-1.5">
                                              <Badge className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-medium capitalize text-[#0F172A] shadow-sm">
                                                 {item.type || 'File'}
                                              </Badge>
                                              {item.isGlobal && (
                                              <Badge className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 shadow-sm">
                                                 Platform
                                              </Badge>
                                              )}
                                           </div>
                                        </div>

                                        <div className="flex grow flex-col bg-white p-4">
                                            <p className="truncate text-sm font-bold text-[#0F172A]">{item.name}</p>
                                            <div className="mt-2 flex items-center justify-between border-t border-[#E8E8E8] pt-2">
                                               <p className="text-xs font-medium uppercase tracking-wider text-[#747781]">{item.size}</p>
                                               <p className="text-xs font-medium text-[#747781]">
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
                           <DialogTitle className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-[#F4F4F5] text-[#0F172A] flex items-center justify-center">
                                 <LinkIcon className="w-5 h-5" />
                              </div>
                              Import via URL
                           </DialogTitle>
                       </DialogHeader>
                       <div className="grid gap-6 py-8">
                           <div className="grid gap-3">
                               <Label htmlFor="url-name" className="text-[11px] font-black text-[#787778] uppercase tracking-[2px] ml-1">Asset Name</Label>
                               <Input
                                   id="url-name"
                                   placeholder="E.g. Brand Logo, Background Video..."
                                   value={urlName}
                                   onChange={(e) => setUrlName(e.target.value)}
                                   className="h-12 rounded-2xl bg-[#F4F4F5] border-2 border-[#E8E8E8] focus:bg-white text-sm font-medium focus-visible:ring-[#0F172A]/15 transition-all"
                               />
                           </div>
                           <div className="grid gap-3">
                               <Label htmlFor="url" className="text-[11px] font-black text-[#787778] uppercase tracking-[2px] ml-1">Media Source URL</Label>
                               <Input
                                   id="url"
                                   placeholder="https://images.unsplash.com/..."
                                   value={urlInput}
                                   onChange={(e) => setUrlInput(e.target.value)}
                                   className="h-12 rounded-2xl bg-[#F4F4F5] border-2 border-[#E8E8E8] focus:bg-white text-sm font-medium focus-visible:ring-[#0F172A]/15 transition-all"
                               />
                               <p className="text-[10px] text-[#747781] font-medium ml-1">Supports direct image and video links (jpg, png, mp4, etc.)</p>
                           </div>
                       </div>
                    </div>
                    <div className="p-6 bg-[#F4F4F5] flex justify-end gap-3 border-t border-[#E8E8E8]/60">
                        <Button variant="ghost" onClick={() => setIsUrlDialogOpen(false)} className="rounded-xl font-black text-[#747781] text-xs px-6 h-11 tracking-widest uppercase hover:bg-[#F4F4F5]">Cancel</Button>
                        <Button onClick={handleUrlUpload} disabled={!urlInput} className="rounded-xl font-black text-xs px-8 h-11 tracking-widest uppercase bg-[#0F172A] hover:bg-[#1E293B] shadow-none">Import Asset</Button>
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
    </div>
  );
}