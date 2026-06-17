import React, { useState, useCallback, useEffect } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import {
    Settings,
    Globe,
    Shield,
    Zap,
    Smartphone,
    Palette,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Copy,
    Trash2,
    RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import websiteApi from '@/api/website';

export function SiteSettings() {
    const { state } = useBuilder();
    const { activeWebsite } = state;
    const store = useBuilderStore();
    const { toast } = useToast();

    const [projectName, setProjectName] = useState(activeWebsite?.name || '');
    const [customDomain, setCustomDomain] = useState('');
    const [lazyLoading, setLazyLoading] = useState(true);
    const [assetOptimization, setAssetOptimization] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [domains, setDomains] = useState<any[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isVerifying, setIsVerifying] = useState<string | null>(null);

    // Load domains on mount
    useEffect(() => {
        if (!activeWebsite) return;
        websiteApi.getDomains(activeWebsite.id)
            .then((res: any) => setDomains(res.data?.domains || res.data || []))
            .catch(() => {});
    }, [activeWebsite?.id]);

    const handleConnectDomain = useCallback(async () => {
        if (!activeWebsite || !customDomain.trim()) return;
        const domain = customDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
        if (!domain.includes('.') || domain.length < 4) {
            toast({ title: 'Invalid domain', description: 'Enter a valid domain like mysite.com', variant: 'destructive' });
            return;
        }
        setIsConnecting(true);
        try {
            const isSubdomain = domain.endsWith('.buildora.app');
            const res = isSubdomain 
                ? await websiteApi.addSubdomain(activeWebsite.id, domain.replace('.buildora.app', ''))
                : await websiteApi.addDomain(activeWebsite.id, domain);
            
            const newDomain = res.data?.domain || res.data;
            setDomains(prev => {
                const filtered = prev.filter((d: any) => d.domain !== domain);
                return [newDomain, ...filtered];
            });
            setCustomDomain('');
            toast({ title: 'Domain added', description: 'Configure your DNS records below to activate it.' });
        } catch (err: any) {
            toast({ title: 'Error', description: err.response?.data?.error || 'Failed to add domain', variant: 'destructive' });
        } finally {
            setIsConnecting(false);
        }
    }, [activeWebsite, customDomain, toast]);

    const handleVerifyDomain = useCallback(async (domainId: string, domainName: string) => {
        if (!activeWebsite) return;
        setIsVerifying(domainName);
        try {
            const res = await websiteApi.verifyDomain(domainId);
            const result = res.data;
            setDomains(prev => prev.map((d: any) => {
                if (d.id !== domainId) return d;
                if (result.verified) {
                    return result.domain || { ...d, status: 'ACTIVE', dns_records: { ...d.dns_records, verified: true } };
                }
                return { 
                    ...d, 
                    status: 'PENDING', 
                    dns_records: { 
                        ...d.dns_records, 
                        validation: result.dnsValidationRecords || d.dns_records?.validation 
                    } 
                };
            }));
            toast({
                title: result.verified ? 'Domain verified!' : 'DNS not ready yet',
                description: result.verified ? 'Your custom domain is now active.' : 'DNS records haven\'t propagated yet. This can take up to 48 hours.',
                variant: result.verified ? 'default' : 'destructive',
            });
        } catch {
            toast({ title: 'Verification failed', description: 'Could not check DNS records.', variant: 'destructive' });
        } finally {
            setIsVerifying(null);
        }
    }, [activeWebsite, toast]);

    const handleRemoveDomain = useCallback(async (domainId: string) => {
        if (!activeWebsite) return;
        try {
            await websiteApi.removeDomain(domainId);
            setDomains(prev => prev.filter((d: any) => d.id !== domainId));
            toast({ title: 'Domain removed' });
        } catch {
            toast({ title: 'Error', description: 'Failed to remove domain', variant: 'destructive' });
        }
    }, [activeWebsite, toast]);

    const handleSave = useCallback(async () => {
        if (!activeWebsite) return;
        setIsSaving(true);
        try {
            if (projectName && projectName !== activeWebsite.name) {
                await store.updateWebsite(activeWebsite.id, { name: projectName });
            }
            toast({ title: 'Settings saved', description: 'Your site settings have been updated.' });
        } catch (err) {
            console.error('Failed to save settings:', err);
            toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }, [activeWebsite, projectName, store, toast]);

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
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="h-10 text-xs bg-white border-slate-200 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700">Custom Domain</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="mysite.com"
                                        value={customDomain}
                                        onChange={(e) => setCustomDomain(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleConnectDomain()}
                                        className="h-10 text-xs bg-white border-slate-200 rounded-xl flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-10 rounded-xl text-xs font-bold px-4"
                                        onClick={handleConnectDomain}
                                        disabled={isConnecting || !customDomain.trim()}
                                    >
                                        {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Connect'}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-slate-400">Add your domain purchased from any registrar (GoDaddy, Namecheap, Squarespace, etc.)</p>
                            </div>

                            {/* Connected Domains List */}
                            {domains.length > 0 && (
                                <div className="space-y-2 mt-3">
                                    <Label className="text-xs font-bold text-slate-700">Connected Domains</Label>
                                    {domains.map((d: any) => (
                                        <div key={d.domain} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {d.status === 'ACTIVE' ? (
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                                    )}
                                                    <span className="text-xs font-semibold text-slate-800">{d.domain}</span>
                                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                                        d.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {d.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {d.type === 'CUSTOM' && d.status !== 'ACTIVE' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 w-7 p-0"
                                                            onClick={() => handleVerifyDomain(d.id, d.domain)}
                                                            disabled={isVerifying === d.domain}
                                                        >
                                                            {isVerifying === d.domain ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <RefreshCw className="w-3 h-3" />
                                                            )}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                                                        onClick={() => handleRemoveDomain(d.id)}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* DNS Instructions for pending custom domains */}
                                            {d.type === 'CUSTOM' && d.status !== 'ACTIVE' && d.dns_records?.validation && d.dns_records.validation.length > 0 && (
                                                <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-600 mb-2">
                                                        Go to your domain registrar's DNS settings and add these records:
                                                    </p>
                                                    <div className="space-y-1.5">
                                                        {d.dns_records.validation.map((record: any, index: number) => (
                                                            <div key={index} className="flex flex-col gap-1 text-[10px] border-b border-slate-200 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-slate-500 w-12 flex-shrink-0"><strong>Type</strong></span>
                                                                    <code className="bg-white px-1 py-0.5 rounded border text-slate-700 font-bold">{record.type}</code>
                                                                </div>
                                                                <div className="flex items-center justify-between group">
                                                                    <span className="text-slate-500 w-12 flex-shrink-0"><strong>Name</strong></span>
                                                                    <div className="flex items-center justify-end overflow-hidden">
                                                                        <code className="bg-white px-1 py-0.5 rounded border text-slate-700 truncate mr-1 max-w-[150px]" title={record.name}>{record.name}</code>
                                                                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 shrink-0"
                                                                            onClick={() => { navigator.clipboard.writeText(record.name); toast({ title: 'Name Copied!' }); }}>
                                                                            <Copy className="w-2.5 h-2.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between group">
                                                                    <span className="text-slate-500 w-12 flex-shrink-0"><strong>Value</strong></span>
                                                                    <div className="flex items-center justify-end overflow-hidden">
                                                                        <code className="bg-white px-1 py-0.5 rounded border text-slate-700 truncate mr-1 max-w-[150px]" title={record.value}>{record.value}</code>
                                                                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 shrink-0"
                                                                            onClick={() => { navigator.clipboard.writeText(record.value); toast({ title: 'Value Copied!' }); }}>
                                                                            <Copy className="w-2.5 h-2.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-[9px] text-slate-400 mt-2">
                                                        DNS propagation can take up to 48 hours. Click the refresh button above to check.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                <Switch checked={lazyLoading} onCheckedChange={setLazyLoading} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors cursor-pointer">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-700">Asset Optimization</p>
                                    <p className="text-[10px] text-slate-400 min-w-0">Compress images and minify code</p>
                                </div>
                                <Switch checked={assetOptimization} onCheckedChange={setAssetOptimization} />
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
                <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 rounded-2xl font-bold shadow-lg shadow-primary/20">
                    {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
