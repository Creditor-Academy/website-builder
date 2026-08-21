import React, { useState, useEffect, useMemo } from 'react';
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
import { Plus, ArrowLeft, LayoutTemplate, Search, Trash2, RotateCcw, Building2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import templateApi from '@/api/templates';
import { useToast } from '@/components/ui/use-toast';
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
    <div className="admin-page">
      {/* Full-screen creating overlay */}
      {creatingId && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#0F172A] flex items-center justify-center shadow-none">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#0F172A]">Creating your site...</h3>
              <p className="text-sm text-[#747781] mt-1">Setting up your new project from the template</p>
            </div>
          </div>
        </div>
      )}

      {/* Header bar — floating dark glossy bar */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/[0.07] to-transparent skew-x-[-12deg] origin-bottom-right" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
          {/* Title */}
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              {showTrash ? 'Templates Trash' : 'Templates Library'}
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              {showTrash
                ? 'Manage and restore deleted templates.'
                : 'Choose a professional starting point for your next digital venture.'}
            </p>
          </div>

          {/* Controls — below title on mobile, right on desktop */}
          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap md:justify-end md:gap-2.5">
              {isAdminUser && (
                <Button
                  variant={showTrash ? 'default' : 'outline'}
                  onClick={() => setShowTrash(!showTrash)}
                  className={cn(
                    'h-10 w-full min-w-0 rounded-full px-3 text-xs font-semibold gap-1.5 shadow-none hover:scale-100 active:scale-100 transition-colors md:h-11 md:w-auto md:px-5 md:text-sm md:gap-2',
                    showTrash
                      ? 'bg-rose-600 text-white hover:bg-rose-700 hover:text-white'
                      : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white/25'
                  )}
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">Trash{trashedCount > 0 ? ` (${trashedCount})` : ''}</span>
                </Button>
              )}

              {isAdminUser && (
                <Select value={scopeFilter} onValueChange={(v) => setScopeFilter(v as any)}>
                  <SelectTrigger className="h-10 w-full min-w-0 rounded-full border-white/15 bg-white/5 text-xs text-slate-200 hover:bg-white/10 md:h-11 md:w-[140px] md:text-sm">
                    <SelectValue placeholder="All Scopes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scopes</SelectItem>
                    <SelectItem value="GLOBAL">Global</SelectItem>
                    <SelectItem value="INSTITUTION">Institution</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {isSuperAdmin && institutions.length > 0 && (
                <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                  <SelectTrigger className="col-span-2 h-10 w-full rounded-full border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 md:col-auto md:h-11 md:w-[180px]">
                    <Building2 className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
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

              {isAdminUser && !showTrash && (
                <Button
                  onClick={handleOpenCreate}
                  className="col-span-2 h-10 w-full rounded-full bg-white px-4 text-xs font-semibold text-[#0F172A] shadow-none hover:bg-slate-100 hover:text-[#0F172A] hover:scale-100 active:scale-100 transition-colors md:col-auto md:h-11 md:w-auto md:px-5 md:text-sm"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  New Template
                </Button>
              )}
          </div>
        </div>
      </div>

      {/* Trash banner */}
      {showTrash && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 rounded-3xl bg-rose-50 border border-rose-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-bold text-rose-900">Trash Management</p>
              <p className="text-xs text-rose-600/80 font-medium">Viewing deleted templates. Restore items to make them public again.</p>
            </div>
          </div>
         <Button 
  variant="outline" 
  className="rounded-2xl border-rose-200 bg-white text-rose-700 hover:text-black hover:bg-rose-100 hover:border-rose-300 transition-all font-bold px-6 shadow-sm group/back-btn"
  onClick={() => setShowTrash(false)}
>
  <ArrowLeft className="w-4 h-4 mr-2 group-hover/back-btn:-translate-x-1 transition-transform" />
  Back to Library
</Button>

        </div>
      )}

      {/* Category pills + search */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-xs font-semibold transition-colors duration-200 sm:h-9 sm:px-3.5 sm:text-[13px]',
                  active
                    ? 'border-[#0F172A] bg-[#0F172A] text-white hover:bg-[#1E293B] hover:border-[#1E293B]'
                    : 'border-[#E5E7EB] bg-white text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full shrink-0 md:w-64 lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-full border-[#E5E7EB] bg-white pl-9 text-sm text-[#0F172A] shadow-sm transition-colors focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10"
          />
        </div>
      </div>

      {/* Loading shimmer */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
              <div className="aspect-[16/10] bg-[#E5E7EB]" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 rounded-full bg-[#E5E7EB]" />
                <div className="h-3 w-full rounded-full bg-[#E5E7EB]" />
                <div className="h-3 w-4/5 rounded-full bg-[#E5E7EB]" />
                <div className="mt-4 flex justify-between">
                  <div className="h-8 w-20 rounded-lg bg-[#E5E7EB]" />
                  <div className="h-8 w-28 rounded-lg bg-[#E5E7EB]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#E8E8E8]">
          <LayoutTemplate className="h-12 w-12 text-slate-300" />
          <p className="px-8 text-center text-sm font-medium text-[#787778]">
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
              className="h-10 rounded-full bg-[#0F172A] px-6 text-sm font-semibold text-white shadow-none hover:bg-[#1E293B] hover:scale-100"
            >
              <Plus className="mr-2 h-4 w-4" /> Create First Template
            </Button>
          )}
        </div>
      ) : (
        /* Template grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {filtered.map((template: any) => (
              <div
                key={template.id}
                className={cn(
                  'flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-colors hover:border-[#CBD5E1]',
                  showTrash && 'opacity-80'
                )}
              >
                {/* Preview image + category badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F4F5]">
                  {template.image ? (
                    <img
                      src={template.image}
                      alt={template.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#F4F4F5]">
                      <LayoutTemplate className="h-10 w-10 text-[#787778]" />
                    </div>
                  )}

                  <span className="absolute right-3 top-3 rounded-md border border-white/40 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] shadow-sm backdrop-blur-sm">
                    {template.category || 'General'}
                  </span>

                  {showTrash && (
                    <Badge className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                      Deleted
                    </Badge>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="text-base font-bold leading-snug tracking-tight text-[#0F172A] sm:text-lg">
                    {template.name}
                  </h4>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#64748B]">
                    {template.description || 'No description provided.'}
                  </p>

                  {/* Footer actions — Configure + Use Template */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    {showTrash ? (
                      <Button
                        className="h-9 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-none hover:bg-emerald-700 hover:scale-100"
                        onClick={() => handleRestoreTemplate(template)}
                      >
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restore
                      </Button>
                    ) : (
                      <>
                        {isAdminUser ? (
                          <button
                            type="button"
                            className="text-sm font-semibold text-[#0F172A] transition-colors hover:text-[#334155]"
                            onClick={() => handleOpenEdit(template)}
                          >
                            Configure
                          </button>
                        ) : (
                          <span />
                        )}

                        <div className="ml-auto flex items-center gap-1.5">
                          {isAdminUser && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg text-[#94A3B8] hover:bg-rose-50 hover:text-rose-600 hover:scale-100"
                              onClick={() => handleDeleteTemplate(template)}
                              title="Delete template"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            className="h-9 rounded-lg bg-[#0F172A] px-3.5 text-sm font-semibold text-white shadow-none hover:bg-[#1E293B] hover:scale-100"
                            disabled={!!creatingId}
                            onClick={() => handleUseTemplate(template)}
                          >
                            {creatingId === template.id ? (
                              <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Creating...</>
                            ) : (
                              'Use Template'
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
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

    </div>
  );
}