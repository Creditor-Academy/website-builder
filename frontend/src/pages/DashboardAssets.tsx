import React, { useEffect, useState, useRef } from 'react';
import { Search, Upload, Check, Image as ImageIcon, Video, Monitor, Link as LinkIcon, Trash2, Copy } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

import useBuilderStore from '../store/useBuilderStore';


export default function DashboardAssets() {
    const { deleteAsset, fetchAssets, getScopedAssets, uploadAsset, importAssetFromUrl } = useBuilderStore();
    useEffect(() => {
        void fetchAssets();
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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadAsset(file);
            if (e.target) e.target.value = '';
        }
    };

    const handleUrlUpload = async () => {
        if (urlInput) {
            await importAssetFromUrl(urlName || 'Imported Asset', urlInput);
            setUrlInput('');
            setUrlName('');
            setIsUrlDialogOpen(false);
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
                          className="w-full md:w-auto h-11 bg-blue-600 text-white font-semibold rounded-full shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all duration-200"
                        >
                          <Upload className="w-5 h-5 mr-2" />Add Assets
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
                   {['all', 'images', 'videos'].map(tabType => (
                      <TabsContent key={tabType} value={tabType} className="mt-0 outline-none">
                         {filteredMedia.filter(m => tabType === 'all' || m.type === tabType.slice(0, -1)).length === 0 ? (
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
                                {filteredMedia.filter(m => tabType === 'all' || m.type === tabType.slice(0, -1)).map((item) => (
                                    <div
                                        key={item.id}
                                        className="group/media relative flex flex-col rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white"
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
                                           
                                           <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/media:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-[4px]">
                                               <Button 
                                                  size="sm" 
                                                  className="bg-blue-600 text-white font-semibold rounded-full px-6 h-11 text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                                                  onClick={() => handleCopy(item.id, item.url)}
                                               >
                                                  {copiedId === item.id ? <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Copied</div> : <div className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Copy Link</div>}
                                               </Button>
                                               {!item.isGlobal && (
                                               <Button 
                                                  size="sm" 
                                                  variant="destructive" 
                                                  className="h-11 px-6 text-sm font-semibold rounded-full shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:scale-105 transition-all duration-200" 
                                                  onClick={() => void deleteAsset(item.id)}
                                               >
                                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                               </Button>
                                               )}
                                           </div>

                                           <div className="absolute top-4 left-4 flex gap-2">
                                              <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs">
                                                 {item.type === 'image' ? 'Image' : 'Video'}
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
                   ))}
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
    </Card>
  );
}