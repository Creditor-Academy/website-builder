import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight, LayoutTemplate, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import templateApi from '@/api/templates';
import { useToast } from '@/components/ui/use-toast';
import GradientButton from '@/components/ui/GradientButton';
import TemplateFormDialog from '@/components/dashboard/TemplateFormDialog';

export default function DashboardTemplates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createWebsite = useBuilderStore(state => state.createWebsite);

  // ─── Auth check ───────────────────────────────────────────────────────────
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdminUser = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser?.role);

  // ─── State ────────────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  // Admin create/edit dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  // ─── Fetch DB templates ───────────────────────────────────────────────────
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await templateApi.getWebsiteTemplates();
      const raw = res.data?.data || res.data || [];

      // Flatten if grouped by category (object) or already an array
      let flat: any[] = Array.isArray(raw) ? raw : Object.values(raw).flat();

      // Regular users only see non-deleted; admins see everything
      if (!isAdminUser) {
        flat = flat.filter((t: any) => !t.deletedAt);
      }

      setTemplates(flat);

      // Build dynamic category list
      const cats = Array.from(new Set(flat.map((t: any) => t.category).filter(Boolean)));
      setCategories(['All', ...(cats as string[])]);
    } catch (err: any) {
      toast({ title: 'Failed to load templates', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  // ─── Filter + search ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return templates.filter((t: any) => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const matchSearch = !searchTerm ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [templates, activeCategory, searchTerm]);

  // ─── Use template: clones into new website, original template untouched ───
  const handleUseTemplate = async (template: any) => {
    try {
      const id = await createWebsite(`${template.name} Site`, template.id);
      navigate(`/builder/${id}`);
    } catch (err: any) {
      toast({
        title: 'Could not use template',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // ─── Admin form callbacks ─────────────────────────────────────────────────
  const handleFormSuccess = (result: any, isEdit: boolean) => {
    if (isEdit) {
      setTemplates(prev => prev.map((t: any) => t.id === result.id ? { ...t, ...result } : t));
    } else {
      setTemplates(prev => [result, ...prev]);
      if (result.category && !categories.includes(result.category)) {
        setCategories(prev => [...prev, result.category]);
      }
    }
  };

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (template: any) => {
    setEditingTemplate(template);
    setFormOpen(true);
  };

  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8 min-h-[80vh]">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> /{' '}
        <span className="font-semibold text-slate-700">Templates</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Templates Library</h2>
          <p className="text-slate-500 mt-1">Choose a professional starting point for your next digital venture.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-full bg-white border-slate-200 shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* ✅ ADMIN ONLY: New Template button — same style as "New Website" */}
          {isAdminUser && (
            <GradientButton
              icon={<Plus className="w-5 h-5" />}
              onClick={handleOpenCreate}
              className="whitespace-nowrap"
            >
              New Template
            </GradientButton>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            className={cn(
              'rounded-full h-10 px-4 text-sm font-semibold transition-all duration-200',
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'
            )}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Loading shimmer */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-md animate-pulse">
              <div className="aspect-[4/3] bg-slate-100" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
                <div className="h-5 w-2/3 bg-slate-100 rounded-full" />
                <div className="h-3 w-full bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 rounded-[2rem]">
          <LayoutTemplate className="w-12 h-12 text-slate-200" />
          <p className="text-slate-400 text-sm font-medium text-center px-8">
            {templates.length === 0
              ? isAdminUser
                ? 'No templates yet. Click "New Template" to create your first one!'
                : 'No templates have been created yet. Ask your admin to add some!'
              : 'No templates match your search.'}
          </p>
          {isAdminUser && templates.length === 0 && (
            <Button
              onClick={handleOpenCreate}
              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 h-10 text-sm font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" /> Create First Template
            </Button>
          )}
        </div>
      ) : (
        /* Template grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((template: any) => (
            <Card
              key={template.id}
              className={cn(
                "group/template-card overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white",
                template.deletedAt && "opacity-60 grayscale"
              )}
            >
              {/* Preview image */}
              <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden rounded-t-2xl">
                {template.image ? (
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/template-card:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                    <LayoutTemplate className="w-12 h-12 text-indigo-200" />
                    <p className="text-xs text-indigo-300 font-medium mt-2">{template.category}</p>
                  </div>
                )}

                {/* Deleted badge — admin only */}
                {isAdminUser && template.deletedAt && (
                  <Badge className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    Deleted
                  </Badge>
                )}

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/template-card:opacity-100 transition-opacity duration-300" />

                {/* Hover action buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/template-card:opacity-100 transition-all duration-300 z-20">
                  {/* Use — not available for deleted */}
                  {!template.deletedAt && (
                    <Button
                      className="bg-blue-600 text-white font-semibold rounded-full px-5 h-10 text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                      onClick={e => { e.stopPropagation(); handleUseTemplate(template); }}
                    >
                      <Plus className="w-4 h-4 mr-1.5" /> Use
                    </Button>
                  )}

                  {/* Edit — admin only */}
                  {isAdminUser && (
                    <Button
                      className="bg-white text-slate-800 font-semibold rounded-full px-5 h-10 text-sm shadow-lg hover:bg-slate-50 hover:scale-105 transition-all duration-200"
                      onClick={e => { e.stopPropagation(); handleOpenEdit(template); }}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs">
                    {template.category || 'General'}
                  </Badge>
                </div>
                <h4 className="font-bold text-xl text-slate-900 leading-tight mt-1">{template.name}</h4>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mt-1">
                  {template.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-xs uppercase tracking-wider group-hover/template-card:text-blue-700 transition-all">
                  <span>{isAdminUser ? 'Edit or Use' : 'Use Template'}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit dialog — rendered only for admins */}
      {isAdminUser && (
        <TemplateFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          editingTemplate={editingTemplate}
          onSuccess={handleFormSuccess}
        />
      )}
    </Card>
  );
}