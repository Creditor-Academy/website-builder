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
  ExternalLink,
  Loader2,
  Settings,
  Zap,
} from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { publishService } from '@/services/publishService';
import { cn } from '@/lib/utils';

const fieldClass =
  'h-11 border-slate-200 bg-white text-[#0F172A] focus-visible:border-[#0F172A] focus-visible:ring-2 focus-visible:ring-[#0F172A]/15';

export function PublishDialog({ open, onOpenChange, websiteId }) {
  const { websites, updateWebsite } = useBuilderStore();
  const website = websites.find(w => w.id === websiteId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('idle');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');

  React.useEffect(() => {
    if (open && website) {
      let initialSubdomain = website.subdomain;
      let initialCustomDomain = website.customDomain;

      if (!initialSubdomain && !initialCustomDomain && website.publishedUrl) {
        try {
          const urlObj = new URL(website.publishedUrl);
          if (urlObj.hostname.includes('.buildora.lmsathena.com')) {
            initialSubdomain = urlObj.hostname.split('.')[0];
          } else {
            initialCustomDomain = urlObj.hostname;
          }
        } catch {
          // ignore invalid URLs
        }
      }

      if (initialSubdomain) setSubdomain(initialSubdomain);
      if (initialCustomDomain) setCustomDomain(initialCustomDomain);
      if (website.publishedUrl) setPublishedUrl(website.publishedUrl);

      if (website.status === 'Published') setPublishStatus('success');
      else setPublishStatus('idle');
    }
  }, [open, website]);

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStatus('publishing');

    try {
      const response = await publishService.publishWebsite({
        websiteId,
        subdomain: subdomain || undefined,
        customDomain: customDomain || undefined,
      });

      if (response.success) {
        setPublishStatus('success');
        setPublishedUrl(response.url);
        updateWebsite(websiteId, {
          status: 'Published',
          publishedUrl: response.url,
          customDomain: customDomain,
          subdomain: subdomain,
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
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-600" />;
      case 'publishing':
        return <Loader2 className="h-5 w-5 animate-spin text-[#0F172A]" />;
      default:
        return <Rocket className="h-5 w-5 text-[#0F172A]" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[min(92dvh,40rem)] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden p-0',
          'rounded-2xl border-slate-200 bg-white text-[#0F172A] shadow-2xl sm:max-w-2xl',
          '[&>button]:right-3 [&>button]:top-3 [&>button]:text-[#0F172A] [&>button]:hover:bg-slate-100',
          '[&>button>svg]:mr-0 [&>button>svg]:h-5 [&>button>svg]:w-5',
        )}
      >
        <DialogHeader className="shrink-0 space-y-1 border-b border-slate-100 px-5 py-4 pr-12 sm:px-6">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-[#0F172A] sm:text-lg">
            <Rocket className="h-5 w-5 text-[#0F172A]" />
            Publish Your Website
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Make your website live and accessible to the world
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div
            className={cn(
              'rounded-xl border p-4',
              publishStatus === 'success' && 'border-emerald-200 bg-emerald-50',
              publishStatus === 'error' && 'border-rose-200 bg-rose-50',
              publishStatus === 'publishing' && 'border-slate-200 bg-slate-50',
              publishStatus === 'idle' && 'border-slate-200 bg-slate-50',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {getStatusIcon()}
                <div className="min-w-0">
                  <p className="font-medium text-[#0F172A]">Publish Status</p>
                  <p className="text-sm text-slate-500">
                    {publishStatus === 'idle' && 'Ready to publish'}
                    {publishStatus === 'publishing' && 'Publishing your website...'}
                    {publishStatus === 'success' && 'Website published successfully!'}
                    {publishStatus === 'error' && 'Publishing failed. Please try again.'}
                  </p>
                </div>
              </div>
              {website?.status === 'Published' && (
                <Badge className="shrink-0 border-transparent bg-[#0F172A] text-white hover:bg-[#0F172A]">
                  Published
                </Badge>
              )}
            </div>

            {publishStatus === 'success' && publishedUrl && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm font-medium text-[#0F172A]">Your website is live at:</p>
                    <p className="break-all font-mono text-sm text-slate-600">{publishedUrl}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(publishedUrl, '_blank')}
                    className="h-9 shrink-0 border-slate-200 text-[#0F172A] hover:bg-slate-50 hover:text-[#0F172A]"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Visit
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid h-10 w-full grid-cols-2 rounded-lg bg-slate-100 p-1">
              <TabsTrigger
                value="settings"
                className="rounded-md text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-sm"
              >
                Publish Settings
              </TabsTrigger>
              <TabsTrigger
                value="domain"
                className="rounded-md text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-sm"
              >
                Domain
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="subdomain" className="flex items-center gap-2 font-medium text-[#0F172A]">
                  <Globe className="h-4 w-4 text-[#0F172A]" />
                  Buildora Subdomain
                </Label>
                <div className="mt-1.5 flex">
                  <Input
                    id="subdomain"
                    placeholder="my-awesome-site"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className={cn(fieldClass, 'rounded-r-none border-r-0')}
                  />
                  <div className="flex items-center rounded-r-md border border-l-0 border-slate-200 bg-slate-50 px-3">
                    <span className="whitespace-nowrap text-sm text-slate-500">.buildora.lmsathena.com</span>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Get instant free hosting with SSL certificate. Your site will be live at{' '}
                  <span className="font-mono text-[#0F172A]">{subdomain || 'your-site'}.buildora.lmsathena.com</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-5 w-5 shrink-0 text-[#0F172A]" />
                  <div>
                    <p className="font-medium text-[#0F172A]">Free Hosting</p>
                    <p className="text-sm text-slate-500">
                      Your website will be hosted on Buildora's infrastructure with SSL certificate and CDN included.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="domain" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="custom-domain" className="flex items-center gap-2 font-medium text-[#0F172A]">
                  <Globe className="h-4 w-4 text-[#0F172A]" />
                  Custom Domain
                  <span className="text-xs font-normal text-slate-500">(Optional)</span>
                </Label>
                <Input
                  id="custom-domain"
                  placeholder="www.yourdomain.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className={cn(fieldClass, 'mt-1.5')}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Use your own domain for professional branding. Includes automatic SSL certificate.
                </p>
              </div>

              {customDomain && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Settings className="mt-0.5 h-5 w-5 shrink-0 text-[#0F172A]" />
                    <div>
                      <p className="font-medium text-[#0F172A]">DNS Configuration</p>
                      <p className="text-sm text-slate-500">
                        After publishing, update your DNS settings to point to Buildora's servers.
                      </p>
                      <div className="mt-2 rounded-lg bg-white p-2 font-mono text-xs text-[#0F172A]">
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

        <DialogFooter className="flex-col gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 w-full border-slate-200 text-[#0F172A] hover:bg-slate-50 hover:text-[#0F172A] sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || (!subdomain && !customDomain)}
            className="h-10 w-full bg-[#0F172A] text-white hover:bg-[#1e293b] sm:w-auto"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Publish Website
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
