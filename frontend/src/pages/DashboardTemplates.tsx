import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowRight, LayoutTemplate, Search, Trash2, RotateCcw, Building2, Loader2 } from 'lucide-react';
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
  const isAdminUser = ['ADMIN', 'SUPER_ADMIN', 'INSTITUTION_ADMIN'].includes(currentUser?.role);

  // ─── State ────────────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  // Admin create/edit dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  // Trash toggle (admin only)
  const [showTrash, setShowTrash] = useState(false);

  // Creating state — tracks which template is being used
  const [creatingId, setCreatingId] = useState<string | null>(null);

  // Scope filter (admin only)
  const [scopeFilter, setScopeFilter] = useState<'all' | 'GLOBAL' | 'INSTITUTION'>('all');

  // Institution filter (super admin only)
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const institutions = useMemo(() => {
    const orgs: { id: string; name: string }[] = [];
    const seen = new Set<string>();
    templates.forEach((t: any) => {
      if (t.institution?.id && !seen.has(t.institution.id)) {
        seen.add(t.institution.id);
        orgs.push({ id: t.institution.id, name: t.institution.name });
      }
    });
    return orgs;
  }, [templates]);
  const [institutionFilter, setInstitutionFilter] = useState<string>('all');

  // ─── Fetch DB templates ───────────────────────────────────────────────────
  const fetchTemplates = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const res = await templateApi.getWebsiteTemplates({ signal });
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
      if (err?.name === 'CanceledError' || signal?.aborted) return;
      toast({
        title: 'Failed to load templates',
        description: err?.response?.data?.message || err?.message || 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTemplates(controller.signal);
    return () => controller.abort();
  }, []);

  // ─── Filter + search ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return templates.filter((t: any) => {
      // Separate active vs trash
      const inTrash = Boolean(t.deletedAt);
      if (showTrash !== inTrash) return false;

      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const matchSearch = !searchTerm ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Scope filter
      const matchScope = scopeFilter === 'all' || t.scope === scopeFilter;

      // Institution filter (super admin)
      const matchInstitution = institutionFilter === 'all' ||
        (institutionFilter === 'none' && !t.institution_id) ||
        t.institution_id === institutionFilter;

      return matchCat && matchSearch && matchScope && matchInstitution;
    });
  }, [templates, activeCategory, searchTerm, showTrash, scopeFilter, institutionFilter]);

  const trashedCount = useMemo(() => templates.filter(t => t.deletedAt).length, [templates]);

  // ─── Use template: clones into new website, original template untouched ───
  const handleUseTemplate = async (template: any) => {
    if (creatingId) return;
    try {
      setCreatingId(template.id);
      const id = await createWebsite(`${template.name} Site`, template.id);
      navigate(`/builder/${id}`);
    } catch (err: any) {
      toast({
        title: 'Could not use template',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreatingId(null);
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

      navigate(`/template-builder/${result.id}`);
    }
  };

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (template: any) => {
    navigate(`/template-builder/${template.id}`);
  };

  const handleDeleteTemplate = async (template: any) => {
    try {
      await templateApi.deleteWebsiteTemplate(template.id);
      setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, deletedAt: new Date().toISOString() } : t));
      toast({ title: 'Template deleted' });
    } catch (err: any) {
      toast({ title: 'Failed to delete template', description: err?.response?.data?.message || err?.message, variant: 'destructive' });
    }
  };

  const handleRestoreTemplate = async (template: any) => {
    try {
      await templateApi.restoreWebsiteTemplate(template.id);
      setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, deletedAt: null } : t));
      toast({ title: 'Template restored' });
    } catch (err: any) {
      toast({ title: 'Failed to restore template', description: err?.response?.data?.message || err?.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8 min-h-[80vh] relative">
      {/* Full-screen creating overlay */}
      {creatingId && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">Creating your site...</h3>
              <p className="text-sm text-slate-500 mt-1">Setting up your new project from the template</p>
            </div>
          </div>
        </div>
      )}

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

          {/* ADMIN ONLY: Trash toggle */}
          {isAdminUser && (
            <Button
              variant={showTrash ? 'default' : 'outline'}
              onClick={() => setShowTrash(!showTrash)}
              className={cn(
                'rounded-full h-11 px-5 text-sm font-semibold gap-2 transition-all duration-200',
                showTrash
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
              )}
            >
              <Trash2 className="w-4 h-4" />
              Trash{trashedCount > 0 && ` (${trashedCount})`}
            </Button>
          )}

          {/* ADMIN ONLY: Scope filter */}
          {isAdminUser && (
            <Select value={scopeFilter} onValueChange={(v) => setScopeFilter(v as any)}>
              <SelectTrigger className="w-[140px] h-11 rounded-full border-slate-200">
                <SelectValue placeholder="All Scopes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="GLOBAL">Global</SelectItem>
                <SelectItem value="INSTITUTION">Institution</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* SUPER ADMIN ONLY: Institution filter */}
          {isSuperAdmin && institutions.length > 0 && (
            <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
              <SelectTrigger className="w-[180px] h-11 rounded-full border-slate-200">
                <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Orgs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="none">No Organization</SelectItem>
                {institutions.map((org) => (
                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* ADMIN ONLY: New Template button */}
          {isAdminUser && !showTrash && (
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

      {/* Trash banner */}
      {showTrash && (
        <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-50 border border-rose-200">
          <Trash2 className="w-5 h-5 text-rose-500" />
          <p className="text-sm text-rose-700 font-medium">Viewing deleted templates. Restore them to make them available again.</p>
        </div>
      )}

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
            {showTrash
              ? 'Trash is empty. No deleted templates.'
              : templates.length === 0
                ? isAdminUser
                  ? 'No templates yet. Click "New Template" to create your first one!'
                  : 'No templates have been created yet. Ask your admin to add some!'
                : 'No templates match your search.'}
          </p>
          {isAdminUser && !showTrash && templates.filter(t => !t.deletedAt).length === 0 && (
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
              onClick={() => {
                if (template.deletedAt) {
                  return;
                }

                if (isAdminUser) {
                  handleOpenEdit(template);
                  return;
                }

                void handleUseTemplate(template);
              }}
              className={cn(
                "group/template-card overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white",
                showTrash && "opacity-75"
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

                {/* Deleted badge — trash view */}
                {showTrash && (
                  <Badge className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    Deleted
                  </Badge>
                )}

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/template-card:opacity-100 transition-opacity duration-300" />

                {/* Hover action buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/template-card:opacity-100 transition-all duration-300 z-20">
                  {showTrash ? (
                    /* Trash view: Restore only */
                    <Button
                      className="bg-emerald-600 text-white font-semibold rounded-full px-5 h-10 text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:scale-105 transition-all duration-200"
                      onClick={e => { e.stopPropagation(); handleRestoreTemplate(template); }}
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" /> Restore
                    </Button>
                  ) : (
                    /* Active view: Use + Design + Delete */
                    <>
                      <Button
                        className="bg-blue-600 text-white font-semibold rounded-full px-5 h-10 text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                        disabled={!!creatingId}
                        onClick={e => { e.stopPropagation(); handleUseTemplate(template); }}
                      >
                        {creatingId === template.id
                          ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Creating...</>
                          : <><Plus className="w-4 h-4 mr-1.5" /> Use</>}
                      </Button>

                      {isAdminUser && (
                        <Button
                          className="bg-white text-slate-800 font-semibold rounded-full px-5 h-10 text-sm shadow-lg hover:bg-slate-50 hover:scale-105 transition-all duration-200"
                          onClick={e => { e.stopPropagation(); handleOpenEdit(template); }}
                        >
                          Design
                        </Button>
                      )}

                      {isAdminUser && (
                        <Button
                          className="bg-rose-600 text-white font-semibold rounded-full px-4 h-10 text-sm shadow-lg shadow-rose-500/30 hover:bg-rose-700 hover:scale-105 transition-all duration-200"
                          onClick={e => { e.stopPropagation(); handleDeleteTemplate(template); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs">
                    {template.category || 'General'}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {template.scope === 'INSTITUTION' && template.institution?.name && (
                      <Badge className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full text-[10px]">
                        <Building2 className="w-3 h-3 mr-1 inline" />
                        {template.institution.name}
                      </Badge>
                    )}
                    <Badge className={cn(
                      'font-medium px-3 py-1 rounded-full text-[10px]',
                      template.scope === 'INSTITUTION'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    )}>
                      {template.scope === 'INSTITUTION' ? 'Institution' : 'Global'}
                    </Badge>
                  </div>
                </div>
                <h4 className="font-bold text-xl text-slate-900 leading-tight mt-1">{template.name}</h4>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mt-1">
                  {template.description}
                </p>

                <div className={cn(
                  "mt-4 pt-4 border-t border-slate-100 flex items-center justify-between font-semibold text-xs uppercase tracking-wider transition-all",
                  showTrash ? 'text-rose-500 group-hover/template-card:text-rose-600' : 'text-blue-600 group-hover/template-card:text-blue-700'
                )}>
                  <span>{showTrash ? 'In Trash' : isAdminUser ? 'Design or Use' : 'Use Template'}</span>
                  {showTrash ? <RotateCcw className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
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