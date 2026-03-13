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
      await publishService.removeDomain(websiteId, domain.domain);
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

  const handleVerifyDomain = async (domain: string) => {
    setVerifyingDomain(domain);
    try {
      const verification = await publishService.verifyDomain(domain);

      // Update domain status based on verification
      setDomains(domains.map(d =>
        d.domain === domain
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
                            onClick={() => handleVerifyDomain(domain.domain)}
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
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="dns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    DNS Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your DNS settings to connect your custom domain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-3">For Custom Domains</h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">A Record:</span>
                        <span className="bg-white px-2 py-1 rounded border">192.168.1.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">CNAME (www):</span>
                        <span className="bg-white px-2 py-1 rounded border">buildora.app</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Automatic SSL</p>
                        <p className="text-sm text-blue-700">
                          SSL certificates are automatically provisioned for all domains once DNS is properly configured.
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
                          DNS changes may take 24-48 hours to propagate worldwide. Your domain status will update automatically.
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
