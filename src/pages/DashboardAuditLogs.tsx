import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, CalendarDays, Key, Server, User as UserIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getAuditLogs } from '../api/audit';
import { DashboardPageShell, dashboardTableWrapClass } from '@/components/dashboard/DashboardPageShell';
import { dashboardPanelClass } from '@/components/dashboard/DashboardCard';

export default function DashboardAuditLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await getAuditLogs();
        setLogs(res.data || []);
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
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7">
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
              <TableHead className="min-w-[150px] px-4 py-3 text-[#747781]">
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
                <TableCell colSpan={6} className="h-24 text-center text-[#747781]">Loading logs...</TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map(log => (
                <TableRow key={log.id} className="h-16 border-b border-[#E8E8E8]">
                  <TableCell className="px-4 py-3 text-sm text-[#747781]">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-[#747781]">
                    {log.user_id || 'System'}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant="outline" className="bg-[#F4F4F5] text-[#0F172A]">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-[#0F172A]">
                    {log.entity_type}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-[#747781]">
                    {log.entity_id || '—'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-[#747781]">
                    {log.metadata ? (
                      <pre className="bg-[#F4F4F5] p-2 rounded-md overflow-x-auto max-w-xs whitespace-pre-wrap">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    ) : '—'}
                  </TableCell>
                </TableRow>
              ))
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
