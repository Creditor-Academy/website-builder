import React, { useRef, useState } from 'react';
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
} from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { publishService } from '@/services/publishService';
import { cn } from '@/lib/utils';
import { SITE_HOST } from '@/api/client';
const fieldClass =
  'h-11 border border-slate-200 bg-white text-sm text-[#0F172A] shadow-none hover:border-slate-300 hover:shadow-none focus:border-[#0F172A] focus:shadow-none focus-visible:border-[#0F172A] focus-visible:ring-2 focus-visible:ring-[#0F172A]/15';

export function PublishDialog({ open, onOpenChange, websiteId }) {
  const { websites, updateWebsite, setSaveStatus } = useBuilderStore();
  const website = websites.find(w => w.id === websiteId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('idle');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [savedSubdomain, setSavedSubdomain] = useState('');
  const [dialogMode, setDialogMode] = useState<'publish' | 'update'>('publish');
  const [statusNote, setStatusNote] = useState('');
  const [editingSubdomain, setEditingSubdomain] = useState(false);
  const initializedFor = useRef<string | null>(null);
  const subdomainInputRef = useRef<HTMLInputElement>(null);

  const isUpdate = dialogMode === 'update';
  const subdomainChanged = Boolean(subdomain) && subdomain !== savedSubdomain;
  const customDomainChanged = customDomain.trim() !== String(website?.customDomain || '').trim();

  React.useEffect(() => {
    if (!open) {
      initializedFor.current = null;
      return;
    }
    if (!website || initializedFor.current === website.id) return;

    let initialSubdomain = website.subdomain || '';
    let initialCustomDomain = website.customDomain || '';

    if (!initialSubdomain && !initialCustomDomain && website.publishedUrl) {
      try {
        const urlObj = new URL(website.publishedUrl);
        if (urlObj.hostname.includes(`.${SITE_HOST}`) || urlObj.hostname.endsWith(SITE_HOST)) {
          initialSubdomain = urlObj.hostname.split('.')[0];
        } else {
          initialCustomDomain = urlObj.hostname;
        }
      } catch {
        // ignore invalid URLs
      }
    }

    const alreadyLive =
      String(website.status || '').toLowerCase() === 'published' || Boolean(website.publishedUrl);

    initializedFor.current = website.id;
    setSubdomain(initialSubdomain);
    setSavedSubdomain(initialSubdomain);
    setCustomDomain(initialCustomDomain);
    setPublishedUrl(website.publishedUrl || '');
    setStatusNote('');
    setEditingSubdomain(false);
    setDialogMode(alreadyLive ? 'update' : 'publish');
    setPublishStatus(alreadyLive ? 'success' : 'idle');
  }, [open, website]);

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStatus('publishing');
    setSaveStatus('publishing');

    try {
      const response = await publishService.publishWebsite({
        websiteId,
        subdomain: subdomain || undefined,
        customDomain: customDomain || undefined,
      });

      if (response.success) {
        setPublishStatus('success');
        setSaveStatus('published');
        setPublishedUrl(response.url);
        setSavedSubdomain(subdomain);
        setEditingSubdomain(false);
        setStatusNote(isUpdate ? 'Subdomain updated.' : 'Website published successfully!');
        updateWebsite(websiteId, {
          status: 'Published',
          publishedUrl: response.url,
          customDomain: customDomain,
          subdomain: subdomain,
        });
      } else {
        setPublishStatus('error');
        setSaveStatus('publish-error');
      }
    } catch (error) {
      setPublishStatus('error');
      setSaveStatus('publish-error');
      console.error('Publishing failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const liveHost = `${savedSubdomain || subdomain || 'your-site'}.${SITE_HOST}`;
  const nextHost = `${subdomain || 'your-site'}.${SITE_HOST}`;
  const subdomainLocked = isUpdate && !editingSubdomain;

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
        <DialogHeader className="shrink-0 space-y-0 border-b border-slate-100 px-5 py-4 pr-12 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-white">
              {isUpdate ? <Globe className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-base font-semibold text-[#0F172A] sm:text-lg">
                  {isUpdate ? 'Update subdomain' : 'Publish website'}
                </DialogTitle>
                {isUpdate && (
                  <Badge className="border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                    Published
                  </Badge>
                )}
              </div>
              <DialogDescription className="mt-0.5 text-sm text-slate-500">
                {isUpdate ? 'Your site is live. Change the address when you need to.' : 'Choose an address and publish for the first time.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          {publishStatus === 'error' && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {isUpdate ? 'Could not update the subdomain. Try again.' : 'Publishing failed. Try again.'}
            </div>
          )}

          {publishStatus === 'publishing' && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              {isUpdate ? 'Updating subdomain…' : 'Publishing your website…'}
            </div>
          )}

          {publishStatus === 'success' && publishedUrl && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {statusNote || 'Live'}
                </p>
                <p className="truncate font-mono text-sm text-emerald-950">{publishedUrl}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(publishedUrl, '_blank')}
                className="h-8 shrink-0 border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-100 hover:text-emerald-950"
              >
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Visit
              </Button>
            </div>
          )}

          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid h-9 w-full grid-cols-2 rounded-lg bg-slate-100 p-1">
              <TabsTrigger
                value="settings"
                className="rounded-md text-sm text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-sm"
              >
                Subdomain
              </TabsTrigger>
              <TabsTrigger
                value="domain"
                className="rounded-md text-sm text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#0F172A] data-[state=active]:shadow-sm"
              >
                Custom domain
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="mt-4 space-y-2">
              <Label htmlFor="subdomain" className="text-sm font-medium text-[#0F172A]">
                Web Studio subdomain
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  ref={subdomainInputRef}
                  id="subdomain"
                  placeholder="my-awesome-site"
                  value={subdomain}
                  readOnly={subdomainLocked}
                  tabIndex={subdomainLocked ? -1 : 0}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className={cn(
                    fieldClass,
                    'min-w-0 flex-1 rounded-lg',
                    subdomainLocked && 'pointer-events-none bg-slate-50 text-slate-600',
                  )}
                />
                <div className="flex h-11 shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
                  <span className="whitespace-nowrap font-mono text-xs text-slate-500">.{SITE_HOST}</span>
                </div>
                {isUpdate && !editingSubdomain && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingSubdomain(true);
                      window.setTimeout(() => subdomainInputRef.current?.focus(), 0);
                    }}
                    className="h-11 shrink-0 rounded-lg border-slate-200 px-4 text-[#0F172A] hover:bg-slate-50 hover:text-[#0F172A]"
                  >
                    Update
                  </Button>
                )}
                {isUpdate && editingSubdomain && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSubdomain(savedSubdomain);
                      setEditingSubdomain(false);
                    }}
                    className="h-11 shrink-0 rounded-lg border-slate-200 px-4 text-[#0F172A] hover:bg-slate-50 hover:text-[#0F172A]"
                  >
                    Cancel
                  </Button>
                )}
              </div>
              <p className="text-xs leading-5 text-slate-500">
                {isUpdate && editingSubdomain && subdomainChanged && (
                  <>Moves from <span className="font-mono text-[#0F172A]">{liveHost}</span> to <span className="font-mono text-[#0F172A]">{nextHost}</span>.</>
                )}
                {isUpdate && editingSubdomain && !subdomainChanged && 'Type a new name, then save it below.'}
                {isUpdate && !editingSubdomain && 'Click Update to edit this address. Hosting and SSL stay included.'}
                {!isUpdate && (
                  <>Free hosting and SSL. It will be live at <span className="font-mono text-[#0F172A]">{nextHost}</span>.</>
                )}
              </p>
            </TabsContent>

            <TabsContent value="domain" className="mt-4 space-y-2">
              <Label htmlFor="custom-domain" className="text-sm font-medium text-[#0F172A]">
                Custom domain <span className="font-normal text-slate-400">optional</span>
              </Label>
              <Input
                id="custom-domain"
                placeholder="www.yourdomain.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className={fieldClass}
              />
              <p className="text-xs leading-5 text-slate-500">
                Point your domain at Web Studio after publishing. SSL is included.
              </p>
              {customDomain && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs leading-5 text-[#0F172A]">
                  A Record: 192.168.1.1
                  <br />
                  CNAME: www.{SITE_HOST}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-col gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 w-full border-slate-200 bg-white text-[#0F172A] hover:bg-slate-50 hover:text-[#0F172A] sm:w-auto"
          >
            Close
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || (isUpdate ? !subdomainChanged && !customDomainChanged : !subdomain && !customDomain)}
            className="h-10 w-full bg-[#0F172A] text-white hover:bg-[#1e293b] sm:w-auto"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdate ? 'Updating...' : 'Publishing...'}
              </>
            ) : isUpdate ? (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Update Subdomain
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
