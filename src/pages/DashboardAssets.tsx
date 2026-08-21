import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Upload, Check, Image as ImageIcon, Video, Monitor, Link as LinkIcon, Trash2, Copy, Loader2, Globe } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { DuplicateAssetDialog } from "../components/ui/DuplicateAssetDialog";
import { cn } from '@/lib/utils';
import { useToast } from "../hooks/use-toast";
import useBuilderStore from '../store/useBuilderStore';
import { DashboardPageShell, dashboardFilterPillClass, dashboardSearchInputClass, dashboardFilterScrollClass, dashboardToolbarClass } from '@/components/dashboard/DashboardPageShell';
import {
  DashboardCard,
  DashboardCardMedia,
  DashboardCardBody,
  DashboardCardTitle,
  DashboardCardDescription,
  DashboardCardFooter,
  DashboardCardBadge,
  dashboardCardClass,
  dashboardCardBadgeClass,
} from '@/components/dashboard/DashboardCard';


export default function DashboardAssets() {
    const location = useLocation();
    const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
    const isAdmin = basePath === '/admin';
    const uploadScope = isAdmin ? { scope: 'GLOBAL' as const } : {};
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
            await uploadAsset(file, uploadScope);
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
                await importAssetFromUrl(urlName || 'Imported Asset', urlInput, uploadScope);
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

    const [activeTab, setActiveTab] = useState('all');

    return (
    <DashboardPageShell
      basePath={basePath}
      title="Media Library"
      pageLabel="Assets"
      description="Manage the global asset library outside individual websites."
      actions={
        <>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d]" />
            <Input
              placeholder="Search assets..."
              className={dashboardSearchInputClass}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={uploadingCount > 0}
                className="h-11 bg-[#131b2e] text-white font-semibold rounded-lg hover:bg-[#252f4a] transition-all disabled:opacity-60"
              >
                {uploadingCount > 0
                  ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Uploading…</>
                  : <><Upload className="w-5 h-5 mr-2" />Add Assets</>
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-lg border-[#c6c6cd] shadow-xl mt-2">
              <DropdownMenuItem
                className="cursor-pointer gap-3 p-3 rounded-lg hover:bg-[#eae7e9] font-medium text-[#1b1b1d]"
                onSelect={() => fileInputRef.current?.click()}
              >
                <Monitor className="w-4 h-4" />
                Upload from Disk
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-3 p-3 rounded-lg hover:bg-[#eae7e9] font-medium text-[#1b1b1d] mt-1"
                onSelect={() => setIsUrlDialogOpen(true)}
              >
                <LinkIcon className="w-4 h-4" />
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
        </>
      }
    >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-6 sm:mb-8">
              <div className={cn(dashboardFilterScrollClass, 'flex-1')}>
              {['all', 'images', 'videos'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={dashboardFilterPillClass(activeTab === tab)}
                >
                  {tab === 'all' ? 'All Assets' : tab === 'images' ? 'Images' : 'Videos'}
                </button>
              ))}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f6f3f5] rounded-full text-[#45464d] border border-[#c6c6cd] font-semibold text-xs uppercase tracking-wider shrink-0 self-start sm:self-auto">
                Total: <span className="text-[#1b1b1d] font-bold">{filteredMedia.length}</span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="min-h-[400px]">
                   {isFetching ? (
                      /* ── Initial fetch skeleton ── */
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">
                         {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={cn(dashboardCardClass, 'animate-pulse')}>
                               <div className="aspect-square bg-[#eae7e9] border-b border-[#c6c6cd]" />
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
                            <div className="h-[400px] flex flex-col items-center justify-center text-[#76777d] gap-4 border border-dashed border-[#c6c6cd] rounded-lg bg-[#f6f3f5]">
                                <div className="w-20 h-20 rounded-lg bg-[#eae7e9] flex items-center justify-center">
                                   {tabType === 'videos' ? <Video className="w-8 h-8 opacity-40" /> : <ImageIcon className="w-8 h-8 opacity-40" />}
                                </div>
                                <div className="text-center">
                                   <p className="text-sm font-bold text-[#1b1b1d]">No {tabType} found</p>
                                   <p className="text-xs text-[#45464d] font-medium mt-1">Try searching another keyword or upload new media</p>
                                </div>
                            </div>
                         ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">

                                {/* ── Upload skeleton placeholders ── */}
                                {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
                                   <div key={`uploading-${i}`} className="flex flex-col rounded-lg border border-[#c6c6cd] bg-[#fcf8fa] overflow-hidden animate-pulse">
                                      <div className="aspect-square bg-[#eae7e9] flex flex-col items-center justify-center gap-2">
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
                                    <DashboardCard
                                        key={item.id}
                                        className={cn(
                                            'hover:shadow-none transition-none',
                                            deletingIds.has(item.id) && 'opacity-60 scale-[0.97] pointer-events-none'
                                        )}
                                    >
                                        <DashboardCardMedia aspect className="aspect-square">
                                           {item.type === 'image' ? (
                                               <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                           ) : (
                                               <div className="w-full h-full bg-[#131b2e] flex items-center justify-center">
                                                   <Video className="w-10 h-10 text-white/40" />
                                               </div>
                                           )}

                                           <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 z-10">
                                              <DashboardCardBadge position="top-left" className="static capitalize">
                                                 {item.type || 'File'}
                                              </DashboardCardBadge>
                                              {(item.scope === 'GLOBAL' || item.isGlobal) && (
                                              <span className={cn(dashboardCardBadgeClass, 'static inline-flex items-center gap-1 bg-[#dedfeb]')}>
                                                 <Globe className="w-3 h-3" />
                                                 Global
                                              </span>
                                              )}
                                           </div>
                                        </DashboardCardMedia>

                                        <DashboardCardBody className="p-4 sm:p-5">
                                            <DashboardCardTitle className="text-base sm:text-lg mb-1 truncate">
                                                {item.name}
                                            </DashboardCardTitle>

                                            <DashboardCardDescription className="mb-0 flex-none text-[#76777d]">
                                                <span className="uppercase tracking-wider">{item.size}</span>
                                                <span className="mx-1.5">·</span>
                                                <span>
                                                    {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </DashboardCardDescription>

                                            {deletingIds.has(item.id) ? (
                                                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[#c6c6cd] text-[#ba1a1a]">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm font-medium">Deleting…</span>
                                                </div>
                                            ) : (
                                                <DashboardCardFooter className="mt-4 pt-4 border-t border-[#c6c6cd]">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-[#000000] w-full sm:w-auto"
                                                        onClick={() => handleCopy(item.id, item.url)}
                                                    >
                                                        {copiedId === item.id ? (
                                                            <>
                                                                <Check className="w-3.5 h-3.5" />
                                                                Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-3.5 h-3.5" />
                                                                Copy Link
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-[#ba1a1a] w-full sm:w-auto"
                                                        onClick={() => void handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </button>
                                                </DashboardCardFooter>
                                            )}
                                        </DashboardCardBody>
                                    </DashboardCard>
                                ))}
                            </div>
                         )}
                      </TabsContent>
                   ))
                   )}
                </div>
            </Tabs>

            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-lg p-0 overflow-hidden border-[#c6c6cd] shadow-2xl">
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
                        <Button onClick={handleUrlUpload} disabled={!urlInput} className="rounded-lg font-semibold text-sm px-8 h-11 bg-[#131b2e] hover:bg-[#252f4a]">Import Asset</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <DuplicateAssetDialog
                file={dupFile}
                conflictingName={dupConflictName}
                onReplace={handleDupReplace}
                onRename={handleDupRename}
                onCancel={handleDupCancel}
            />
    </DashboardPageShell>
  );
}