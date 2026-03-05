import React, { useState } from 'react';
import { Search, Upload, X, Check, Image as ImageIcon, Video, File, Folder, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const INITIAL_MEDIA = [
    { id: '1', name: 'Coffee Shop', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', type: 'image' },
    { id: '2', name: 'Modern Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', type: 'image' },
    { id: '3', name: 'Team Meeting', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', type: 'image' },
    { id: '4', name: 'Startup Laptop', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80', type: 'image' },
    { id: '5', name: 'Abstract Art', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80', type: 'image' },
    { id: '6', name: 'Nature Background', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', type: 'image' },
];

export function MediaLibrary({ open, onOpenChange, onSelect }) {
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [media, setMedia] = useState(INITIAL_MEDIA);

    const filteredMedia = media.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (item) => {
        setSelectedId(item.id);
        if (onSelect) onSelect(item.url);
        onOpenChange(false);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you'd upload to S3/Cloudinary here
            // For now, we'll just create a local URL
            const url = URL.createObjectURL(file);
            const newItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                url,
                type: file.type.startsWith('video') ? 'video' : 'image'
            };
            setMedia([newItem, ...media]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            <label className="cursor-pointer">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                                    <Upload className="w-4 h-4" /> Upload
                                </span>
                                <input type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*" />
                            </label>
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
                                        {filteredMedia.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${selectedId === item.id ? 'border-primary shadow-md' : 'border-transparent hover:border-slate-200'
                                                    }`}
                                                onClick={() => handleSelect(item)}
                                            >
                                                {item.type === 'image' ? (
                                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                        <Video className="w-8 h-8 text-white/50" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">Select</span>
                                                </div>
                                                {selectedId === item.id && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                    <p className="text-[10px] text-white truncate font-medium">{item.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>

                <div className="p-4 border-t bg-white flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button disabled={!selectedId} onClick={() => onOpenChange(false)}>Insert into site</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
