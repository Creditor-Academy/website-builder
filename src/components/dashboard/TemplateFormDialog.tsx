import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Plus, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';
import templateApi from '@/api/templates';

const CATEGORIES = ['Business', 'E-commerce', 'Personal', 'Portfolio', 'Blog', 'Landing'];

interface TemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTemplate?: any | null;
  onSuccess: (template: any, isEdit: boolean) => void;
}

export default function TemplateFormDialog({
  open,
  onOpenChange,
  editingTemplate,
  onSuccess,
}: TemplateFormDialogProps) {
  const { toast } = useToast();
  const isEdit = !!editingTemplate;
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isInstitutionAdmin = currentUser?.role === 'INSTITUTION_ADMIN';

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Business',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (editingTemplate) {
      setForm({
        name: editingTemplate.name || '',
        description: editingTemplate.description || '',
        category: editingTemplate.category || 'Business',
        image: editingTemplate.image || '',
      });
    } else {
      setForm({ name: '', description: '', category: 'Business', image: '' });
    }
    setErrors({});
  }, [editingTemplate, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Template name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Category is required';
    return e;
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    try {
      setLoading(true);
      let result;

      // Build payload — include minimal layout structure so backend is happy
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        ...(form.image ? { image: form.image } : {}),
        // Minimal required fields for the backend template schema
        global_styles: { fontFamily: 'sans-serif', primaryColor: '#6366f1' },
        navbar: { logo: form.name, links: [] },
        footer: { text: `© ${new Date().getFullYear()} ${form.name}` },
        home_layout: { sections: [] },
      };

      if (isEdit) {
        const res = await templateApi.updateWebsiteTemplate(editingTemplate.id, payload);
        result = res.data?.data || res.data;
        toast({ title: 'Template updated', description: `"${form.name}" has been updated.` });
      } else {
        const res = await templateApi.createWebsiteTemplate(payload);
        result = res.data?.data || res.data;
        toast({ title: 'Template created', description: `"${form.name}" is now available to all users.` });
      }

      onSuccess(result, isEdit);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
      toast({ title: isEdit ? 'Update failed' : 'Creation failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (val: boolean) => {
    if (!loading) {
      setErrors({});
      onOpenChange(val);
    }
  };

  const fieldClass =
    'h-11 sm:h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-2 focus-visible:ring-[#0F172A]/20 focus-visible:border-[#0F172A] transition-all';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'flex flex-col gap-0 w-[calc(100vw-1.5rem)] sm:max-w-lg p-0 overflow-hidden',
          'max-h-[min(90dvh,40rem)] rounded-2xl sm:rounded-[1.5rem]',
          'bg-white border-slate-100 shadow-2xl',
          '[&>button]:text-white [&>button]:opacity-90 [&>button]:hover:opacity-100',
          '[&>button]:hover:bg-white/10 [&>button]:hover:text-white',
        )}
      >
        <div className="shrink-0 bg-[#0F172A] px-5 py-5 sm:px-8 sm:py-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
            <LayoutTemplate className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white pr-8">
            {isEdit ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
          <DialogDescription className="text-white/70 mt-1 text-sm">
            {isEdit
              ? 'Update the template details for the users who can access this scope.'
              : isInstitutionAdmin
                ? 'Create a reusable template for users inside your institution.'
                : 'Create a new website template that all users can use to build their sites.'}
          </DialogDescription>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6 space-y-4 sm:space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Name</label>
            <Input
              placeholder="e.g., Modern Business Pro"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className={cn(fieldClass, errors.name && 'border-rose-400 bg-rose-50')}
            />
            {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
            <Input
              placeholder="A clean template for modern businesses..."
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              className={cn(fieldClass, errors.description && 'border-rose-400 bg-rose-50')}
            />
            {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
            <Select value={form.category} onValueChange={val => handleChange('category', val)}>
              <SelectTrigger className={cn(fieldClass, errors.category && 'border-rose-400')}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-rose-500 font-medium">{errors.category}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preview Image URL <span className="text-slate-400 normal-case font-normal">(optional)</span>
            </label>
            <Input
              placeholder="https://example.com/preview.png"
              value={form.image}
              onChange={e => handleChange('image', e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="rounded-2xl border border-[#0F172A]/15 bg-[#0F172A]/5 px-4 py-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Scope</div>
            <p className="text-sm text-slate-600 mt-1">
              {isInstitutionAdmin
                ? 'Institution templates are visible only to users in your institution.'
                : 'Global templates are visible across the whole platform.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end border-t border-slate-100 bg-white px-5 py-4 sm:px-8 sm:py-5">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={loading}
            className="rounded-xl h-11 px-6 border-slate-200 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl h-11 px-8 w-full sm:w-auto bg-[#0F172A] text-white shadow-lg shadow-[#0F172A]/20 hover:bg-[#1e293b] transition-all font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                {isEdit ? 'Saving...' : 'Creating...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {isEdit ? 'Save Changes' : 'Create Template'}
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}