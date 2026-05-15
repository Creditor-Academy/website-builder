import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus, Search, MoreVertical, Edit, Trash2, RefreshCw,
  LayoutTemplate, CheckCircle, Ban, Eye, ListFilter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import templateApi from '@/api/templates';
import TemplateFormDialog from '@/components/dashboard/TemplateFormDialog';
import GradientButton from '@/components/ui/GradientButton';

export default function AdminTemplates() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'deleted'>('all');

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  // Delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch all website templates ─────────────────────────────────────────
  const fetchTemplates = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const res = await templateApi.getWebsiteTemplates({ signal });
      // Backend returns grouped by category — flatten them
      const raw = res.data?.data || res.data || [];
      const flat = Array.isArray(raw)
        ? raw
        : Object.values(raw).flat();
      setTemplates(flat as any[]);
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

  // ─── Filtered list ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return templates.filter(t => {
      const matchSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'deleted' && !!t.deletedAt) ||
        (filterStatus === 'active' && !t.deletedAt);
      return matchSearch && matchStatus;
    });
  }, [templates, searchTerm, filterStatus]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreate = () => {
    setEditingTemplate(null);
    setFormOpen(true);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormOpen(true);
  };

  const handleFormSuccess = (result: any, isEdit: boolean) => {
    if (isEdit) {
      setTemplates(prev => prev.map(t => t.id === result.id ? { ...t, ...result } : t));
    } else {
      setTemplates(prev => [result, ...prev]);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await templateApi.deleteWebsiteTemplate(deleteTarget.id);
      setTemplates(prev =>
        prev.map(t => t.id === deleteTarget.id ? { ...t, deletedAt: new Date().toISOString() } : t)
      );
      toast({ title: 'Template deleted', description: `"${deleteTarget.name}" has been soft-deleted.` });
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.response?.data?.message || err?.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleRestore = async (template: any) => {
    try {
      await templateApi.restoreWebsiteTemplate(template.id);
      setTemplates(prev =>
        prev.map(t => t.id === template.id ? { ...t, deletedAt: null } : t)
      );
      toast({ title: 'Template restored', description: `"${template.name}" is live again.` });
    } catch (err: any) {
      toast({ title: 'Restore failed', variant: 'destructive' });
    }
  };

  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> /{' '}
        <span className="font-semibold text-slate-700">Templates</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Template Management</h2>
          <p className="text-slate-500 mt-1">Create and manage global and institution-scoped templates.</p>
        </div>
        <GradientButton icon={<Plus className="w-5 h-5" />} onClick={handleCreate}>
          New Template
        </GradientButton>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-11 h-11 rounded-full bg-white border-slate-200 shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'active', 'deleted'] as const).map(s => (
            <Button
              key={s}
              variant={filterStatus === s ? 'default' : 'outline'}
              className={cn(
                'rounded-full h-10 px-4 text-sm font-semibold capitalize transition-all duration-200',
                filterStatus === s
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              )}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-3 text-slate-500">Template</TableHead>
              <TableHead className="px-4 py-3 text-slate-500">Category</TableHead>
              <TableHead className="px-4 py-3 text-slate-500">Scope</TableHead>
              <TableHead className="px-4 py-3 text-slate-500">Status</TableHead>
              <TableHead className="px-4 py-3 text-slate-500">Created</TableHead>
              <TableHead className="text-right px-4 py-3 text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-b border-slate-100">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j} className="px-4 py-4">
                      <div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <LayoutTemplate className="w-10 h-10 text-slate-200" />
                    <p className="text-sm">No templates found. Create your first one!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(template => (
                <TableRow key={template.id} className="group border-b border-slate-100 hover:bg-slate-50/70 transition-all h-16">
                  {/* Template info */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {template.image ? (
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100/50">
                          <LayoutTemplate className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{template.name}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-[200px]">{template.description}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="px-4 py-3">
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-100 font-medium text-xs">
                      {template.category || '—'}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge className={cn(
                      'font-medium text-xs',
                      template.scope === 'INSTITUTION'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    )}>
                      {template.scope === 'INSTITUTION' ? 'Institution' : 'Global'}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3">
                    {template.deletedAt ? (
                      <Badge className="bg-rose-50 text-rose-600 border border-rose-100 gap-1">
                        <Ban className="w-3 h-3" /> Deleted
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 gap-1">
                        <CheckCircle className="w-3 h-3" /> Active
                      </Badge>
                    )}
                  </TableCell>

                  {/* Created at */}
                  <TableCell className="px-4 py-3 text-slate-500 text-sm">
                    {template.createdAt
                      ? new Date(template.createdAt).toLocaleDateString()
                      : '—'}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                        <DropdownMenuItem
                          onClick={() => handleEdit(template)}
                          className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100"
                        >
                          <Edit className="w-4 h-4" /> Edit Template
                        </DropdownMenuItem>
                        {template.deletedAt ? (
                          <DropdownMenuItem
                            onClick={() => handleRestore(template)}
                            className="rounded-lg gap-2 cursor-pointer focus:bg-emerald-50 text-emerald-600"
                          >
                            <RefreshCw className="w-4 h-4" /> Restore
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(template)}
                              className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <TemplateFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingTemplate={editingTemplate}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Delete Template</DialogTitle>
            <DialogDescription className="text-slate-500 mt-2">
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>?
              This is a soft delete — the template can be restored later. Users will no longer see it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl"
            >
              {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {isDeleting ? 'Deleting...' : 'Delete Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}