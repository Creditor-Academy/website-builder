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
  Activity, Globe, Tag, CheckCircle, XCircle, Hourglass, User as UserIcon, FileText, RefreshCw, MoreVertical, AlertCircle, RotateCcw, Clock, Search, ListFilter, Loader2
} from 'lucide-react';
import DeploymentLogViewer from './DeploymentLogViewer';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import websiteApi from '@/api/website';
import deploymentsApi from '@/api/deployments';
import { dashboardFilterPillClass, dashboardSearchInputClass, dashboardFilterScrollClass, dashboardToolbarClass, dashboardTableWrapClass } from '@/components/dashboard/DashboardPageShell';
import { dashboardPanelClass } from '@/components/dashboard/DashboardCard';

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
      <div className={dashboardToolbarClass}>
        <div className="relative flex-1 w-full min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d]" />
          <Input
            placeholder="Search deployments by website name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(dashboardSearchInputClass, 'w-full')}
          />
        </div>

        <div className={dashboardFilterScrollClass}>
          {(['all', 'Success', 'Failed', 'Pending'] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={dashboardFilterPillClass(filterStatus === status)}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-lg bg-white border-[#c6c6cd]">
            <ListFilter className="h-4 w-4 text-[#76777d] mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={dashboardTableWrapClass}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#787778]" />
            <span className="ml-2 text-[#747781]">Loading deployments...</span>
          </div>
        ) : (
          <Table className={cn('w-full overflow-hidden', dashboardPanelClass)}>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[150px] px-4 py-3 text-[#747781]">
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Website Name</span>
                </TableHead>
                <TableHead className="min-w-[120px] px-4 py-3 text-[#747781]">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Status</span>
                </TableHead>
                <TableHead className="min-w-[200px] px-4 py-3 text-[#747781]">
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> URL</span>
                </TableHead>
                <TableHead className="min-w-[150px] px-4 py-3 text-[#747781]">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Deployed At</span>
                </TableHead>
                <TableHead className="min-w-[120px] px-4 py-3 text-[#747781]">
                  <span className="flex items-center gap-1.5"><UserIcon className="w-4 h-4" /> Deployed By</span>
                </TableHead>
                <TableHead className="text-right px-4 py-3 text-[#747781]">Actions</TableHead>
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
                    <TableRow key={dep.id} className="group h-16 border-b border-[#E8E8E8] hover:bg-[#F4F4F5]/70 transition-all duration-200">
                      <TableCell className="font-medium text-[#747781] px-4 py-3">{row.websiteName}</TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={
                            display === "Success"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80"
                              : display === "Failed"
                                ? "bg-rose-100 text-rose-700 hover:bg-rose-100/80"
                                : display === "Pending"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100/80"
                                  : "bg-[#F4F4F5] text-[#747781] hover:bg-[#F4F4F5]/80"
                          }
                        >
                          {display === "Success" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {display === "Failed" && <XCircle className="w-3 h-3 mr-1" />}
                          {display === "Pending" && <Hourglass className="w-3 h-3 mr-1 animate-pulse" />}
                          {display === "Rolled Back" && <RotateCcw className="w-3 h-3 mr-1" />}
                          {display}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#747781] text-sm px-4 py-3 max-w-[250px] truncate">
                        {dep.url ? <a href={dep.url} target="_blank" rel="noopener noreferrer" className="text-[#0F172A] hover:underline">{dep.url}</a> : '—'}
                      </TableCell>
                      <TableCell className="text-[#747781] text-sm px-4 py-3">{new Date(dep.publishedAt).toLocaleString()}</TableCell>
                      <TableCell className="flex items-center gap-2 text-[#747781] text-sm px-4 py-3">
                        <div className="w-7 h-7 rounded-full bg-[#F4F4F5] text-[#747781] flex items-center justify-center font-semibold text-xs">
                          {(dep.deployedBy || '?').slice(0, 2).toUpperCase()}
                        </div>
                        {dep.deployedBy || 'System'}
                      </TableCell>
                      <TableCell className="text-right px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-[#F4F4F5]">
                              <MoreVertical className="h-4 w-4 text-[#747781]" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-[#E8E8E8] shadow-lg">
                            <DropdownMenuItem onClick={() => handleRollback(row)} disabled={dep.status !== 'active'} className="rounded-lg gap-2 cursor-pointer focus:bg-[#F4F4F5] focus:text-[#0F172A]">
                              <RefreshCw className="w-4 h-4" /> <span>Rollback</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewLogs(row)} className="rounded-lg gap-2 cursor-pointer focus:bg-[#F4F4F5] focus:text-[#0F172A]">
                              <FileText className="w-4 h-4" /> <span>View Logs</span>
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
