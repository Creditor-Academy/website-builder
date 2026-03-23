import React, { useState, useRef } from 'react';
import { Search, Upload, X, Check, Image as ImageIcon, Video, Monitor, Link as LinkIcon, Trash2, MoreVertical, Copy, MousePointer2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useBuilderStore from '@/store/useBuilderStore';

export default function DashboardAssets() {
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
    };

    const handleCopy = (id: string, url: string) => {
        copyToClipboard(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <ImageIcon className="w-9 h-9 text-indigo-500 fill-indigo-50" /> Media Management
                   </h2>
                   <p className="text-sm text-slate-500 mt-1 font-semibold flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5" /> Manage your centralized asset library
                   </p>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="relative group w-full md:w-64">
                       <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <Input
                            placeholder="Search assets..."
                            className="h-11 pl-11 pr-4 bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium rounded-xl border-2 focus-visible:ring-offset-0 focus-visible:ring-indigo-100 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                   </div>
                   
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold transition-all active:scale-95 gap-2">
                            <Upload className="w-4 h-4" /> Add Assets
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
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-0.5">
                   <TabsList className="bg-transparent h-12 gap-8">
                       {['all', 'images', 'videos'].map(tab => (
                          <TabsTrigger 
                            key={tab} 
                            value={tab} 
                            className="text-sm font-black capitalize tracking-tight text-slate-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-indigo-500 data-[state=active]:text-slate-900 rounded-none px-0"
                          >
                             {tab}
                          </TabsTrigger>
                       ))}
                   </TabsList>
                   
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-slate-500 border border-slate-200/60 font-black text-[10px] uppercase tracking-widest">
                         Total: <span className="text-slate-900">{filteredMedia.length}</span>
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
                                        className="group relative flex flex-col rounded-2xl border-2 border-slate-100 overflow-hidden bg-white hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                                    >
                                        <div className="aspect-square relative overflow-hidden bg-slate-100">
                                           {item.type === 'image' ? (
                                               <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                           ) : (
                                               <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                   <Video className="w-10 h-10 text-white/40" />
                                               </div>
                                           )}
                                           
                                           <div className="absolute inset-0 bg-indigo-950/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[4px]">
                                               <Button 
                                                  size="sm" 
                                                  variant="secondary" 
                                                  className="h-10 px-5 text-xs font-black w-[80%] shadow-xl shadow-black/20 hover:scale-105 transition-transform bg-white text-indigo-600 border-none"
                                                  onClick={() => handleCopy(item.id, item.url)}
                                               >
                                                  {copiedId === item.id ? <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Copied</div> : <div className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Copy Link</div>}
                                               </Button>
                                               <Button 
                                                  size="sm" 
                                                  variant="destructive" 
                                                  className="h-10 px-5 text-xs font-black w-[80%] shadow-xl shadow-black/20 hover:scale-105 transition-transform bg-rose-500 hover:bg-rose-600 border-none" 
                                                  onClick={() => deleteAsset(item.id)}
                                               >
                                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                               </Button>
                                           </div>

                                           <div className="absolute top-3 left-3 flex gap-2">
                                              <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                                                 {item.type}
                                              </div>
                                           </div>
                                        </div>
                                        
                                        <div className="p-4 bg-white grow flex flex-col">
                                            <p className="text-xs font-black text-slate-900 truncate tracking-tight">{item.name}</p>
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.size}</p>
                                               <p className="text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
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
        </div>
    );
}