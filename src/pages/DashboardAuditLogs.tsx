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
    <DashboardPageShell
      basePath="/admin"
      title="System Audit Logs"
      description="Review system activities and administrative actions."
      pageLabel="Audit Logs"
    >
      <div className={dashboardTableWrapClass}>
        <Table className={cn('w-full overflow-hidden', dashboardPanelClass)}>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[140px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-slate-400" /> Timestamp
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-slate-400" /> User ID
                </span>
              </TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-400" /> Action
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-slate-400" /> Entity
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-slate-400" /> Entity ID
                </span>
              </TableHead>
              <TableHead className="min-w-[200px] px-4 py-3 text-slate-500">Metadata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">Loading logs...</TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map(log => (
                <TableRow key={log.id} className="h-16 border-b border-slate-100 hover:bg-slate-50/70 transition-all">
                  <TableCell className="px-4 py-3 text-sm text-slate-600">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-slate-500">
                    {log.user_id || 'System'}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant="outline" className="bg-slate-50 text-slate-700">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-slate-700">
                    {log.entity_type}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-slate-500">
                    {log.entity_id || '—'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-slate-500">
                    {log.metadata ? (
                      <pre className="bg-slate-50 p-2 rounded-md overflow-x-auto max-w-xs whitespace-pre-wrap">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    ) : '—'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardPageShell>
  );
}
