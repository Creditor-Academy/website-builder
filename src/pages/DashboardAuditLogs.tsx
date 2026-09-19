import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Activity, CalendarDays, Key, Server, User as UserIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getAuditLogs } from '../api/audit';
import Loading from '@/components/Common/LoadingUI';
import { DashboardPageShell, dashboardTableWrapClass } from '@/components/dashboard/DashboardPageShell';
import { dashboardPanelClass } from '@/components/dashboard/DashboardCard';

function parseMetadata(metadata: unknown): { kind: 'status' | 'name' | 'empty'; value: string; active?: boolean } {
  if (metadata == null) return { kind: 'empty', value: '—' };

  let data: unknown = metadata;
  if (typeof metadata === 'string') {
    try {
      data = JSON.parse(metadata);
    } catch {
      return { kind: 'name', value: metadata };
    }
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    return { kind: 'name', value: String(data) };
  }

  const meta = data as Record<string, unknown>;
  if (meta.name != null && String(meta.name).trim() !== '') {
    return { kind: 'name', value: String(meta.name) };
  }
  if (typeof meta.active === 'boolean') {
    return { kind: 'status', value: meta.active ? 'Active' : 'Inactive', active: meta.active };
  }
  if (meta.active != null) {
    const active = String(meta.active).toLowerCase() === 'true';
    return { kind: 'status', value: active ? 'Active' : 'Inactive', active };
  }

  const firstValue = Object.values(meta).find((v) => v != null && typeof v !== 'object');
  return firstValue != null ? { kind: 'name', value: String(firstValue) } : { kind: 'empty', value: '—' };
}

function extractAuditLogs(payload: any): any[] {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.logs)) return payload.logs;
  if (Array.isArray(payload?.data?.logs)) return payload.data.logs;
  if (Array.isArray(payload)) return payload;
  return [];
}

function formatAuditAction(action?: string) {
  if (!action) return '—';
  return action
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function actionBadgeClass(action?: string) {
  const value = (action || '').toLowerCase();
  if (value.includes('delete') || value.includes('deactivate')) {
    return 'border-rose-100 bg-rose-50 text-rose-600';
  }
  return 'border-[#E5E7EB] bg-[#F4F4F5] text-[#0F172A]';
}

function formatLogTimestamp(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'dd/MM/yyyy, hh:mm:ss a');
}

export default function DashboardAuditLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await getAuditLogs();
        setLogs(extractAuditLogs(res));
      } catch (error) {
        console.error("Failed to fetch audit logs", error);
        toast({ title: "Error", description: "Failed to fetch audit logs", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [toast]);

  return (
    <div className="admin-page">
      {/* Header bar — match Templates / Assets */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 sm:px-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />

        <div className="relative z-10 min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            System Audit Logs
          </h2>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Review system activities and administrative actions.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
        <Table className="w-full overflow-hidden">
          <TableHeader className="border-b border-[#E8E8E8] bg-[#F4F4F5]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[140px] px-4 py-3 text-[#747781]">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#787778]" /> Timestamp
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-[#747781]">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4 text-[#787778]" /> User ID
                </span>
              </TableHead>
              <TableHead className="min-w-[160px] px-4 py-3 text-[#747781]">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-[#787778]" /> Action
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-[#747781]">
                <span className="flex items-center gap-1.5">
                  <Server className="h-4 w-4 text-[#787778]" /> Entity
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-[#747781]">
                <span className="flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-[#787778]" /> Entity ID
                </span>
              </TableHead>
              <TableHead className="min-w-[200px] px-4 py-3 text-[#747781]">Metadata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Loading label="Loading logs" />
                </TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map(log => {
                const meta = parseMetadata(log.metadata);
                return (
                <TableRow key={log.id} className="h-16 border-b border-[#E8E8E8]">
                  <TableCell className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F4F4F5] px-2.5 py-1 text-xs font-medium text-[#0F172A]">
                      {formatLogTimestamp(log.created_at)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-[#747781]">
                    {log.user_id || 'System'}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
                        actionBadgeClass(log.action)
                      )}
                      title={log.action}
                    >
                      {formatAuditAction(log.action)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-[#0F172A]">
                    {log.entity_type}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-[#747781]">
                    {log.entity_id || '—'}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {meta.kind === 'status' ? (
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                          meta.active
                            ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                            : 'border border-rose-100 bg-rose-50 text-rose-600'
                        )}
                      >
                        {meta.value}
                      </span>
                    ) : meta.kind === 'name' ? (
                      <span className="inline-flex max-w-[280px] items-center truncate rounded-full border border-[#E5E7EB] bg-[#F4F4F5] px-2.5 py-1 text-xs font-medium text-[#0F172A]" title={meta.value}>
                        {meta.value}
                      </span>
                    ) : (
                      <span className="text-sm text-[#747781]">—</span>
                    )}
                  </TableCell>
                </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-[#747781]">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
