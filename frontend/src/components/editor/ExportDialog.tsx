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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  FileText,
  Globe,
  Code,
  Image,
  Loader2,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Archive
} from 'lucide-react';
import { publishService } from '@/services/publishService';
import useBuilderStore from '@/store/useBuilderStore';

export function ExportDialog({ open, onOpenChange, websiteId }) {
  const { websites } = useBuilderStore();
  const [exportFormat, setExportFormat] = useState('html');
  const [includeAssets, setIncludeAssets] = useState(true);
  const [minifyCode, setMinifyCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('idle'); // idle, exporting, success, error
  
  const website = websites.find(w => w.id === websiteId);

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('exporting');
    
    try {
      const blob = await publishService.generateStaticSite(websiteId);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Set filename based on format
      const websiteName = website?.name?.toLowerCase().replace(/\s+/g, '-') || 'website';
      const extension = exportFormat === 'zip' ? 'zip' : 'html';
      a.download = `${websiteName}-export.${extension}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
    } catch (error) {
      setExportStatus('error');
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'exporting':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Download className="w-5 h-5 text-slate-600" />;
    }
  };

  const formatOptions = [
    {
      value: 'html',
      label: 'HTML Files',
      description: 'Export as individual HTML, CSS, and JS files',
      icon: <Code className="w-4 h-4" />
    },
    {
      value: 'zip',
      label: 'ZIP Archive',
      description: 'Compressed package with all files and assets',
      icon: <Archive className="w-4 h-4" />
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Website
          </DialogTitle>
          <DialogDescription>
            Download your website as static files for hosting anywhere
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p className="font-medium">Export Status</p>
                <p className="text-sm text-slate-600">
                  {exportStatus === 'idle' && 'Ready to export'}
                  {exportStatus === 'exporting' && 'Generating static files...'}
                  {exportStatus === 'success' && 'Website exported successfully!'}
                  {exportStatus === 'error' && 'Export failed. Please try again.'}
                </p>
              </div>
            </div>
            {exportStatus === 'success' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Completed
              </Badge>
            )}
          </div>

          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              {formatOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex items-center gap-3 cursor-pointer">
                    {option.icon}
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-slate-500">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Export Options</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-assets"
                  checked={includeAssets}
                  onCheckedChange={(checked) => setIncludeAssets(checked === true)}
                />
                <Label htmlFor="include-assets" className="flex items-center gap-2 cursor-pointer">
                  <Image className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Include Assets</p>
                    <p className="text-sm text-slate-500">Export images, fonts, and other media files</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="minify-code"
                  checked={minifyCode}
                  onCheckedChange={(checked) => setMinifyCode(checked === true)}
                />
                <Label htmlFor="minify-code" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Minify Code</p>
                    <p className="text-sm text-slate-500">Compress HTML, CSS, and JavaScript for faster loading</p>
                  </div>
                </Label>
              </div>
            </div>
          </div>

          {/* Export Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Host Anywhere</p>
                <p className="text-sm text-blue-700">
                  Exported files can be hosted on any web server, CDN, or static hosting service like Netlify, Vercel, or GitHub Pages.
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {exportStatus === 'success' && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Export Complete!</p>
                  <p className="text-sm text-green-700">
                    Your website has been downloaded and is ready to deploy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Website
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
