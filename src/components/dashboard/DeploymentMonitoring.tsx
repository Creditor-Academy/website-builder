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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle, XCircle, Hourglass, FileText, RefreshCw, MoreVertical, RotateCcw, Clock, Search, ListFilter, Loader2, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import DeploymentLogViewer from './DeploymentLogViewer';
import Loading from '@/components/Common/LoadingUI';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import websiteApi from '@/api/website';
import deploymentsApi from '@/api/deployments';

function formatPublishedAt(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'dd/MM/yyyy, hh:mm:ss a');
}

interface DeploymentRecord {
  id: string;
  versionId: string;
  status: 'pending' | 'building' | 'uploading' | 'active' | 'failed' | 'rolled_back' | 'PENDING' | 'BUILDING' | 'UPLOADING' | 'ACTIVE' | 'FAILED' | 'ROLLED_BACK';
  url: string;
  domain: string;
  artifactPrefix: string;
  publishedAt: string;
  startedAt: string;
  finishedAt: string | null;
  deployedBy: string;
  errorMessage: string | null;
  fileCount: number;
  totalSize: number;
  sslEnabled: boolean;
  logs: string[];
}

interface DeploymentRow {
  deployment: DeploymentRecord;
  websiteId: string;
  websiteName: string;
}

const statusMap: Record<string, string> = {
  active: 'Success', ACTIVE: 'Success',
  failed: 'Failed', FAILED: 'Failed',
  pending: 'Pending', PENDING: 'Pending',
  building: 'Pending', BUILDING: 'Pending',
  uploading: 'Pending', UPLOADING: 'Pending',
  rolled_back: 'Rolled Back', ROLLED_BACK: 'Rolled Back',
};

const statusDisplay = (status: string) => statusMap[status] || status;

export default function DeploymentMonitoring() {
  const [rows, setRows] = useState<DeploymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [currentLogs, setCurrentLogs] = useState('');
  const [currentDeploymentId, setCurrentDeploymentId] = useState('');
  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);
  const [rollbackTarget, setRollbackTarget] = useState<DeploymentRow | null>(null);
  const [rollingBack, setRollingBack] = useState(false);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Success' | 'Failed' | 'Pending' | 'Rolled Back'>('all');
  const [sortBy, setSortBy] = useState('recent');

  const fetchDeployments = async () => {
    try {
      setLoading(true);

      // Try the dedicated deployments API first (real-time DB data)
      try {
        const res = await deploymentsApi.getAll({ limit: 100 });
        const deployments = res.data.deployments || [];
        if (deployments.length > 0) {
          const allRows: DeploymentRow[] = deployments.map((d: any) => ({
            deployment: {
              id: d.id,
              versionId: d.versionId || '',
              status: d.status?.toLowerCase() || 'pending',
              url: d.url || '',
              domain: d.domain || '',
              artifactPrefix: d.artifactPrefix || '',
              publishedAt: d.publishedAt || d.startedAt,
              startedAt: d.startedAt,
              finishedAt: d.finishedAt,
              deployedBy: d.deployedBy || 'System',
              errorMessage: d.errorMessage,
              fileCount: d.fileCount || 0,
              totalSize: d.totalSize || 0,
              sslEnabled: d.sslEnabled || false,
              logs: Array.isArray(d.logs) ? d.logs : [],
            },
            websiteId: d.websiteId,
            websiteName: d.websiteName || 'Unknown',
          }));
          setRows(allRows);
          return;
        }
      } catch {
        // Fallback to legacy JSON-based approach
      }

      // Fallback: read from website content JSON
      const res = await websiteApi.getWebsitesAll({ limit: 100 });
      const rawWebsites = res.data?.websites || res.data?.data?.websites || [];
      const websites = Array.isArray(rawWebsites) ? rawWebsites : (rawWebsites.websites || []);
      const allRows: DeploymentRow[] = [];

      for (const website of websites) {
        const content = website.content as any;
        const deployments: DeploymentRecord[] = content?.builderMeta?.deployments || [];
        for (const dep of deployments) {
          allRows.push({ deployment: dep, websiteId: website.id, websiteName: website.name });
        }
      }

      allRows.sort((a, b) => new Date(b.deployment.publishedAt).getTime() - new Date(a.deployment.publishedAt).getTime());
      setRows(allRows);
    } catch (err) {
      console.error('Failed to fetch deployments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeployments(); }, []);

  const filteredAndSortedDeployments = React.useMemo(() => {
    const temp = rows.filter(row => {
      const display = statusDisplay(row.deployment.status);
      const matchesSearch =
        row.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.websiteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.deployment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || display === filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'recent') {
      temp.sort((a, b) => new Date(b.deployment.publishedAt).getTime() - new Date(a.deployment.publishedAt).getTime());
    } else if (sortBy === 'status') {
      temp.sort((a, b) => a.deployment.status.localeCompare(b.deployment.status));
    }
    return temp;
  }, [rows, searchTerm, filterStatus, sortBy]);

  const handleViewLogs = (row: DeploymentRow) => {
    setCurrentDeploymentId(row.deployment.id);
    const logs = row.deployment.logs;
    if (logs && logs.length > 0) {
      setCurrentLogs(logs.join('\n'));
    } else if (row.deployment.errorMessage) {
      setCurrentLogs(`[ERROR] ${row.deployment.errorMessage}`);
    } else {
      setCurrentLogs('No logs available for this deployment.');
    }
    setShowLogsDialog(true);
  };

  const handleRollback = (row: DeploymentRow) => {
    setRollbackTarget(row);
    setShowRollbackConfirm(true);
  };

  const confirmRollback = async () => {
    if (!rollbackTarget) return;
    setRollingBack(true);
    try {
      await websiteApi.rollbackDeployment(rollbackTarget.websiteId, rollbackTarget.deployment.id);
      toast({ title: "Rollback successful", description: `Deployment ${rollbackTarget.deployment.id.slice(0, 8)} has been rolled back.` });
      await fetchDeployments();
    } catch (err: any) {
      toast({ title: "Rollback failed", description: err?.message || 'Unknown error', variant: "destructive" });
    } finally {
      setRollingBack(false);
      setShowRollbackConfirm(false);
      setRollbackTarget(null);
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
          <Input
            placeholder="Search deployments by website name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-full border-[#E5E7EB] bg-white pl-9 text-sm text-[#0F172A] shadow-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 focus:ring-offset-0"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(['all', 'Success', 'Failed', 'Pending'] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={cn(
                'h-8 rounded-full border px-3 text-xs font-semibold capitalize shadow-none transition-colors hover:scale-100 active:scale-100 sm:h-9 sm:px-3.5 sm:text-[13px]',
                filterStatus === status
                  ? 'border-[#0F172A] bg-[#0F172A] text-white hover:bg-[#1E293B] hover:text-white'
                  : 'border-[#E5E7EB] bg-white text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              )}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-9 w-full shrink-0 rounded-full border-[#E5E7EB] bg-white shadow-sm focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 focus:ring-offset-0 md:w-[180px]">
            <ListFilter className="mr-2 h-4 w-4 text-[#787778]" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#E8E8E8] bg-white shadow-lg">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <Loading label="Loading deployments" />
        ) : (
          <Table className="w-full overflow-hidden">
            <TableHeader className="border-b border-[#E8E8E8] bg-[#F4F4F5]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[200px] px-4 py-3 text-[#747781]">Website</TableHead>
                <TableHead className="min-w-[120px] px-4 py-3 text-[#747781]">Status</TableHead>
                <TableHead className="min-w-[200px] px-4 py-3 text-[#747781]">URL</TableHead>
                <TableHead className="min-w-[150px] px-4 py-3 text-[#747781]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#787778]" /> Deployed At
                  </span>
                </TableHead>
                <TableHead className="min-w-[140px] px-4 py-3 text-[#747781]">Deployed By</TableHead>
                <TableHead className="min-w-[100px] px-4 py-3 text-right text-[#747781]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDeployments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-[#747781]">
                    No deployments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedDeployments.map((row) => {
                  const dep = row.deployment;
                  const display = statusDisplay(dep.status);
                  return (
                    <TableRow key={dep.id} className="group h-16 border-b border-[#E8E8E8] hover:bg-[#F4F4F5]/70 transition-colors">
                      <TableCell className="px-4 py-3">
                        <p className="truncate font-bold text-[#0F172A]">{row.websiteName}</p>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={cn(
                            'rounded-full border-0',
                            display === 'Success'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80'
                              : display === 'Failed'
                                ? 'bg-rose-100 text-rose-700 hover:bg-rose-100/80'
                                : display === 'Pending'
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-100/80'
                                  : 'bg-[#F4F4F5] text-[#747781] hover:bg-[#F4F4F5]/80'
                          )}
                        >
                          {display === 'Success' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {display === 'Failed' && <XCircle className="mr-1 h-3 w-3" />}
                          {display === 'Pending' && <Hourglass className="mr-1 h-3 w-3 animate-pulse" />}
                          {display === 'Rolled Back' && <RotateCcw className="mr-1 h-3 w-3" />}
                          {display}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate px-4 py-3 text-sm text-[#747781]">
                        {dep.url ? (
                          <a href={dep.url} target="_blank" rel="noopener noreferrer" className="text-[#0F172A] hover:underline" title={dep.url}>
                            {dep.url.replace(/^https?:\/\//, '')}
                          </a>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F4F4F5] px-2.5 py-1 text-xs font-medium text-[#0F172A]">
                          {formatPublishedAt(dep.publishedAt)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-[#747781]">
                        {dep.deployedBy || 'System'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 rounded-xl p-0 text-[#747781] hover:bg-[#F4F4F5] hover:text-[#0F172A] hover:shadow-none hover:scale-100 active:scale-100 data-[state=open]:bg-[#F4F4F5] data-[state=open]:text-[#0F172A]"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#E8E8E8] bg-white p-2 shadow-lg">
                            <DropdownMenuItem onClick={() => handleRollback(row)} disabled={dep.status !== 'active' && dep.status !== 'ACTIVE'} className="cursor-pointer gap-2 rounded-lg focus:bg-[#F4F4F5] focus:text-[#0F172A]">
                              <RefreshCw className="h-4 w-4" /> <span>Rollback</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewLogs(row)} className="cursor-pointer gap-2 rounded-lg focus:bg-[#F4F4F5] focus:text-[#0F172A]">
                              <FileText className="h-4 w-4" /> <span>View Logs</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <DeploymentLogViewer
        isOpen={showLogsDialog}
        onClose={() => setShowLogsDialog(false)}
        deploymentId={currentDeploymentId}
        logs={currentLogs}
      />

      <Dialog open={showRollbackConfirm} onOpenChange={setShowRollbackConfirm}>
        <DialogContent className="w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> Confirm Rollback
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to roll back deployment <span className="font-semibold">{rollbackTarget?.deployment.id.slice(0, 8)}</span> for <span className="font-semibold">{rollbackTarget?.websiteName}</span>? This will re-deploy the previous version.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRollbackConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRollback} disabled={rollingBack}>
              {rollingBack ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rolling back...</> : 'Rollback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
