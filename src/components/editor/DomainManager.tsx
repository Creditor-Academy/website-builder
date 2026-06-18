import React, { useState, useEffect } from 'react';
import { publishService } from '@/services/publishService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Trash2,
  Edit,
  Copy,
  Shield,
  Zap,
  Loader2
} from 'lucide-react';

export function DomainManager({ open, onOpenChange, websiteId }) {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);

  // Load domains when dialog opens
  useEffect(() => {
    if (open && websiteId) {
      loadDomains();
    }
  }, [open, websiteId]);

  const loadDomains = async () => {
    setLoading(true);
    try {
      const domainConfigs = await publishService.getDomains(websiteId);
      const domainsWithIds = domainConfigs.map((config, index) => ({
        id: config.domain || `domain-${index}`,
        domain: config.domain,
        type: config.type,
        status: config.status,
        ssl: config.sslEnabled,
        addedAt: config.addedAt,
        primary: index === 0, // First domain is primary by default
        dnsRecords: config.dnsRecords
      }));
      setDomains(domainsWithIds);
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain) return;
    
    setIsAddingDomain(true);
    try {
      const domainConfig = await publishService.addDomain(websiteId, newDomain);
      
      const domainEntry = {
        id: domainConfig.domain,
        domain: domainConfig.domain,
        type: domainConfig.type,
        status: domainConfig.status,
        ssl: domainConfig.sslEnabled,
        addedAt: domainConfig.addedAt,
        primary: domains.length === 0,
        dnsRecords: domainConfig.dnsRecords
      };

      setDomains([...domains, domainEntry]);
      setNewDomain('');
    } catch (error) {
      console.error('Failed to add domain:', error);
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleRemoveDomain = async (domainId) => {
    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;
    
    try {
      await publishService.removeDomain(domainId);
      setDomains(domains.filter(d => d.id !== domainId));
    } catch (error) {
      console.error('Failed to remove domain:', error);
    }
  };

  const handleSetPrimary = (domainId) => {
    setDomains(domains.map(d => ({
      ...d,
      primary: d.id === domainId
    })));
  };

  const handleVerifyDomain = async (domainId: string, domainName: string) => {
    setVerifyingDomain(domainName);
    try {
      const verification = await publishService.verifyDomain(domainId);
      
      // Update domain status based on verification
      setDomains(domains.map(d => 
        d.id === domainId 
          ? { 
              ...d, 
              status: verification.verified ? 'active' : 'pending',
              dnsRecords: verification.dnsRecords
            }
          : d
      ));
    } catch (error) {
      console.error('Domain verification failed:', error);
    } finally {
      setVerifyingDomain(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Domain Management
          </DialogTitle>
          <DialogDescription>
            Manage your website domains and SSL certificates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Domain */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Domain</CardTitle>
              <CardDescription>
                Connect a custom domain or create a new subdomain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="www.yourdomain.com or my-site"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <Button 
                  onClick={handleAddDomain}
                  disabled={!newDomain || isAddingDomain}
                >
                  {isAddingDomain ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Domain
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="domains" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="dns">DNS Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="domains" className="space-y-4">
              {domains.map((domain) => (
                <Card key={domain.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{domain.domain}</p>
                            {domain.primary && (
                              <Badge variant="secondary" className="text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(domain.status)}
                            {domain.ssl && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                SSL
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500">
                              Added {domain.addedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {domain.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Visit
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(domain.domain)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {!domain.primary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPrimary(domain.id)}
                          >
                            Set Primary
                          </Button>
                        )}
                        {domain.type === 'custom' && domain.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerifyDomain(domain.id, domain.domain)}
                            disabled={verifyingDomain === domain.domain}
                          >
                            {verifyingDomain === domain.domain ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Shield className="w-4 h-4 mr-1" />
                                Verify DNS
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveDomain(domain.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* --- Bug Fix: Show ACM validation records for PENDING custom domains --- */}
                    {domain.type === 'custom' && domain.status === 'pending' && domain.dnsRecords?.validation && domain.dnsRecords.validation.length > 0 && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Step 1: Add these DNS records to verify domain ownership
                        </p>
                        {domain.dnsRecords.validation.map((record, i) => (
                          <div key={i} className="space-y-1 font-mono text-xs bg-white rounded border p-2 mb-2">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-slate-500 shrink-0">Type:</span>
                              <span className="font-semibold">{record.type || 'CNAME'}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-slate-500 shrink-0">Name:</span>
                              <span className="break-all">{record.name}</span>
                              <button onClick={() => copyToClipboard(record.name)} className="shrink-0 text-slate-400 hover:text-slate-700"><Copy className="w-3 h-3" /></button>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-slate-500 shrink-0">Value:</span>
                              <span className="break-all">{record.value}</span>
                              <button onClick={() => copyToClipboard(record.value)} className="shrink-0 text-slate-400 hover:text-slate-700"><Copy className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-amber-700 mt-2">Once added, click "Verify DNS" above. ACM validation may take up to 30 minutes.</p>
                      </div>
                    )}

                    {/* --- Show CloudFront CNAME step for ACTIVE custom domains --- */}
                    {domain.type === 'custom' && domain.status === 'active' && domain.dnsRecords?.cloudfront_domain && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          SSL Provisioned — Final DNS step required
                        </p>
                        <div className="font-mono text-xs bg-white rounded border p-2 space-y-1">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-slate-500 shrink-0">Type:</span>
                            <span className="font-semibold">CNAME</span>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-slate-500 shrink-0">Name:</span>
                            <span>{domain.domain}</span>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-slate-500 shrink-0">Value:</span>
                            <span className="break-all">{domain.dnsRecords.cloudfront_domain}</span>
                            <button onClick={() => copyToClipboard(domain.dnsRecords!.cloudfront_domain!)} className="shrink-0 text-slate-400 hover:text-slate-700"><Copy className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <p className="text-xs text-green-700 mt-2">Point your domain's CNAME to the value above to complete setup.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="dns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    DNS Setup Guide
                  </CardTitle>
                  <CardDescription>
                    Follow the instructions on each domain card to configure DNS.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subdomain section */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-1">Platform Subdomains (e.g. myschool.buildora.lmsathena.com)</h4>
                    <p className="text-sm text-slate-600">No DNS action required. Subdomains are active immediately with automatic SSL coverage.</p>
                  </div>

                  {/* Custom domain steps */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                    <h4 className="font-medium">Custom Domains — 2 Steps</h4>
                    <ol className="text-sm text-slate-700 list-decimal list-inside space-y-2">
                      <li>
                        <span className="font-medium">Verify ownership:</span> Add the ACM CNAME validation record shown on the domain card (under the Pending badge) to your domain registrar.
                      </li>
                      <li>
                        <span className="font-medium">Point your domain:</span> Once SSL is provisioned, add the CloudFront CNAME record shown on the domain card to complete routing.
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Automatic SSL</p>
                        <p className="text-sm text-blue-700">
                          SSL certificates are automatically issued via AWS ACM and attached to your domain's CloudFront distribution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900">Propagation Time</p>
                        <p className="text-sm text-amber-700">
                          ACM certificate validation takes 5–30 minutes. DNS propagation after pointing your domain may take up to 48 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
