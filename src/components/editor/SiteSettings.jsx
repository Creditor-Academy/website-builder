import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import {
    Settings,
    Globe,
    Shield,
    Zap,
    Smartphone,
    Palette,
    CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SiteSettings() {
    const { state } = useBuilder();
    const { activeWebsite } = state;

    if (!activeWebsite) return null;

    return (
        <div className="h-full flex flex-col bg-white animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Site Settings</h2>
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Settings className="w-4 h-4" />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                    {/* General Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">General</h3>
                        </div>

                        <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700">Project Name</Label>
                                <Input
                                    defaultValue={activeWebsite.name}
                                    className="h-10 text-xs bg-white border-slate-200 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700">Custom Domain</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="mysite.com"
                                        className="h-10 text-xs bg-white border-slate-200 rounded-xl flex-1"
                                    />
                                    <Button variant="outline" size="sm" className="h-10 rounded-xl text-xs font-bold px-4">Connect</Button>
                                </div>
                                <p className="text-[10px] text-slate-400">Configure your own domain for a professional look.</p>
                            </div>
                        </div>
                    </div>

                    {/* SEO & Performance */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-slate-400" />
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Performance</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors cursor-pointer">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-700">Lazy Loading</p>
                                    <p className="text-[10px] text-slate-400 min-w-0">Load images as they enter the viewport</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors cursor-pointer">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-700">Asset Optimization</p>
                                    <p className="text-[10px] text-slate-400 min-w-0">Compress images and minify code</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Security</h3>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-primary">SSL certificate active</p>
                                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                                    Your site is automatically protected with a 256-bit SSL encryption.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-100 bg-white">
                <Button className="w-full h-11 rounded-2xl font-bold shadow-lg shadow-primary/20">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
