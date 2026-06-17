import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Rocket,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Loader2,
  Settings,
  Zap
} from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { publishService } from '@/services/publishService';

export function PublishDialog({ open, onOpenChange, websiteId }) {
  const { websites, updateWebsite } = useBuilderStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('idle'); // idle, publishing, success, error
  const [publishedUrl, setPublishedUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  
  const website = websites.find(w => w.id === websiteId);

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStatus('publishing');
    
    try {
      const response = await publishService.publishWebsite({
        websiteId,
        subdomain: subdomain || undefined,
        customDomain: customDomain || undefined
      });
      
      if (response.success) {
        setPublishStatus('success');
        setPublishedUrl(response.url);
        updateWebsite(websiteId, { 
          status: 'Published', 
          publishedUrl: response.url,
          customDomain: customDomain,
          subdomain: subdomain 
        });
      } else {
        setPublishStatus('error');
      }
    } catch (error) {
      setPublishStatus('error');
      console.error('Publishing failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const getStatusIcon = () => {
    switch (publishStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'publishing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Rocket className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Publish Your Website
          </DialogTitle>
          <DialogDescription>
            Make your website live and accessible to the world
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className={`rounded-lg border p-4 ${
            publishStatus === 'success' ? 'border-green-200 bg-green-50' :
            publishStatus === 'error' ? 'border-red-200 bg-red-50' :
            publishStatus === 'publishing' ? 'border-blue-200 bg-blue-50' :
            'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <p className="font-medium">Publish Status</p>
                  <p className="text-sm text-slate-600">
                    {publishStatus === 'idle' && 'Ready to publish'}
                    {publishStatus === 'publishing' && 'Publishing your website...'}
                    {publishStatus === 'success' && 'Website published successfully!'}
                    {publishStatus === 'error' && 'Publishing failed. Please try again.'}
                  </p>
                </div>
              </div>
              {website?.status === 'Published' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Published
                </Badge>
              )}
            </div>

            {/* Published URL Display */}
            {publishStatus === 'success' && publishedUrl && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Your website is live at:</p>
                    <p className="text-sm font-mono text-green-600 break-all">{publishedUrl}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(publishedUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings">Publish Settings</TabsTrigger>
              <TabsTrigger value="domain">Domain</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <Label htmlFor="subdomain" className="flex items-center gap-2 text-slate-900 font-medium">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Buildora Subdomain
                </Label>
                <div className="flex mt-1">
                  <Input
                    id="subdomain"
                    placeholder="my-awesome-site"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="rounded-r-none border-r-0"
                  />
                  <div className="flex items-center px-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-md">
                    <span className="text-sm text-slate-600">.buildora.lmsathena.com</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Get instant free hosting with SSL certificate. Your site will be live at <span className="font-mono text-blue-600">{subdomain || 'your-site'}.buildora.lmsathena.com</span>
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Free Hosting</p>
                    <p className="text-sm text-blue-700">
                      Your website will be hosted on Buildora's infrastructure with SSL certificate and CDN included.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="domain" className="space-y-4">
              <div>
                <Label htmlFor="custom-domain" className="flex items-center gap-2 text-slate-900 font-medium">
                  <Globe className="w-4 h-4 text-purple-600" />
                  Custom Domain
                  <span className="text-xs text-slate-500">(Optional)</span>
                </Label>
                <Input
                  id="custom-domain"
                  placeholder="www.yourdomain.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use your own domain for professional branding. Includes automatic SSL certificate.
                </p>
              </div>

              {customDomain && (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">DNS Configuration</p>
                      <p className="text-sm text-amber-700">
                        After publishing, update your DNS settings to point to Buildora's servers.
                      </p>
                      <div className="mt-2 p-2 bg-amber-100 rounded text-xs font-mono">
                        A Record: 192.168.1.1<br />
                        CNAME: www.buildora.lmsathena.com
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || (!subdomain && !customDomain)}
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Publish Website
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
