import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-[2rem] p-0 overflow-hidden bg-white border-slate-100 shadow-2xl">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-7">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <LayoutTemplate className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-black text-white">
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

        <div className="px-8 py-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Name</label>
            <Input
              placeholder="e.g., Modern Business Pro"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className={cn(
                'h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all',
                errors.name && 'border-rose-400 bg-rose-50'
              )}
            />
            {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
            <Input
              placeholder="A clean template for modern businesses..."
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              className={cn(
                'h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all',
                errors.description && 'border-rose-400 bg-rose-50'
              )}
            />
            {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
            <Select value={form.category} onValueChange={val => handleChange('category', val)}>
              <SelectTrigger className={cn('h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all', errors.category && 'border-rose-400')}>
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

          {/* Preview Image URL (optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preview Image URL <span className="text-slate-400 normal-case font-normal">(optional)</span>
            </label>
            <Input
              placeholder="https://example.com/preview.png"
              value={form.image}
              onChange={e => handleChange('image', e.target.value)}
              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Scope</div>
            <p className="text-sm text-slate-600 mt-1">
              {isInstitutionAdmin
                ? 'Institution templates are visible only to users in your institution.'
                : 'Global templates are visible across the whole platform.'}
            </p>
          </div>
        </div>

        <div className="px-8 pb-8 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={loading}
            className="rounded-xl h-11 px-6 border-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl h-11 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all font-bold"
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