import React, { useState } from 'react';
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
import { Card } from '@/components/ui/card';
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
  Activity, Globe, Tag, CheckCircle, XCircle, Hourglass, User as UserIcon, FileText, RefreshCw, MoreVertical, AlertCircle, RotateCcw, Clock, Search, ListFilter
} from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import DeploymentLogViewer from './DeploymentLogViewer';
import { useToast } from '@/components/ui/use-toast';

interface Deployment {
  id: string;
  version: string;
  status: 'Success' | 'Failed' | 'Pending' | 'Rolled Back';
  deployedAt: string;
  deployedBy: string;
  websiteId: string;
  websiteName: string;
}

const initialDummyDeployments: Deployment[] = [
  {
    id: 'dep_001',
    version: 'v1.2.3',
    status: 'Success',
    deployedAt: '2024-03-14 10:30 AM',
    deployedBy: 'John Doe',
    websiteId: 'web_001',
    websiteName: 'My Awesome Portfolio',
  },
  {
    id: 'dep_002',
    version: 'v1.2.2',
    status: 'Failed',
    deployedAt: '2024-03-13 04:15 PM',
    deployedBy: 'Jane Smith',
    websiteId: 'web_002',
    websiteName: 'E-commerce Store v2',
  },
  {
    id: 'dep_003',
    version: 'v1.2.1',
    status: 'Success',
    deployedAt: '2024-03-12 11:00 AM',
    deployedBy: 'John Doe',
    websiteId: 'web_001',
    websiteName: 'My Awesome Portfolio',
  },
  {
    id: 'dep_004',
    version: 'v1.2.0',
    status: 'Pending',
    deployedAt: '2024-03-14 11:00 AM',
    deployedBy: 'Admin',
    websiteId: 'web_003',
    websiteName: 'Blog Site Redesign',
  },
];

const generateDummyLogs = (deploymentId: string) => `
Deployment ID: ${deploymentId}
Initiated by: John Doe
Timestamp: 2024-03-14 10:28:01

[INFO] Starting deployment for version v1.2.3...
[INFO] Fetching latest code from repository...
[INFO] Installing dependencies...
[INFO] Running build process...
[SUCCESS] Build completed successfully.
[INFO] Deploying to production environment...
[SUCCESS] Deployment to CDN complete.
[INFO] Cache invalidated.
[SUCCESS] Deployment finished. Website is live.
`;

const generateFailedLogs = (deploymentId: string) => `
Deployment ID: ${deploymentId}
Initiated by: Jane Smith
Timestamp: 2024-03-13 04:13:22

[INFO] Starting deployment for version v1.2.2...
[INFO] Fetching latest code from repository...
[INFO] Installing dependencies...
[ERROR] npm install failed: Package 'some-broken-dependency' not found.
[ERROR] Build process aborted.
[FAILURE] Deployment failed.
`;

export default function DeploymentMonitoring() {
  const [deployments, setDeployments] = useState<Deployment[]>(initialDummyDeployments);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [currentLogs, setCurrentLogs] = useState('');
  const [currentDeploymentId, setCurrentDeploymentId] = useState('');
  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);
  const [rollbackTarget, setRollbackTarget] = useState<Deployment | null>(null);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Success' | 'Failed' | 'Pending' | 'Rolled Back'>('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'status', 'version'

  const filteredAndSortedDeployments = React.useMemo(() => {
    let tempDeployments = deployments.filter(deployment => {
      const matchesSearch = 
        deployment.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deployment.websiteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deployment.version.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || deployment.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'recent') {
      tempDeployments.sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime());
    } else if (sortBy === 'status') {
      tempDeployments.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortBy === 'version') {
      tempDeployments.sort((a, b) => b.version.localeCompare(a.version)); // Assuming higher version is 'more recent'
    }
    return tempDeployments;
  }, [deployments, searchTerm, filterStatus, sortBy]);

  const handleViewLogs = (deployment: Deployment) => {
    setCurrentDeploymentId(deployment.id);
    if (deployment.status === 'Failed') {
      setCurrentLogs(generateFailedLogs(deployment.id));
    } else {
      setCurrentLogs(generateDummyLogs(deployment.id));
    }
    setShowLogsDialog(true);
  };

  const handleRollback = (deployment: Deployment) => {
    setRollbackTarget(deployment);
    setShowRollbackConfirm(true);
    toast({
      title: "⏳ Initiating rollback process...",
      description: `Preparing to roll back ${deployment.websiteName} to version ${deployment.version}.`,
    });
  };

  const confirmRollback = () => {
    if (rollbackTarget) {
      const newDeployments = deployments.map((dep) =>
        dep.id === rollbackTarget.id ? { ...dep, status: 'Rolled Back' } : dep
      );
      // Simulate a new successful deployment after rollback
      const newRolledBackDeployment: Deployment = {
        id: `dep_rollback_${Date.now()}`,
        version: `${rollbackTarget.version}-rollback`,
        status: 'Success',
        deployedAt: new Date().toLocaleString(),
        deployedBy: 'Admin', // Or the user who performed rollback
        websiteId: rollbackTarget.websiteId,
        websiteName: rollbackTarget.websiteName,
      };
      setDeployments([newRolledBackDeployment, ...newDeployments]);
      toast({
        title: "🚀 Rollback successful!",
        description: `Version ${rollbackTarget.version} of ${rollbackTarget.websiteName} has been rolled back. A new deployment has been initiated.`,
      });
    } else {
      toast({
        title: "⚠️ Rollback failed",
        description: "No target deployment specified for rollback.",
        variant: "destructive",
      });
    }
    setShowRollbackConfirm(false);
    setRollbackTarget(null);
  };

  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> / <span className="font-semibold text-slate-700">Deployment</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Deployment Monitoring</h2>
          <p className="text-slate-500 mt-1">Track and manage your website deployments.</p>
        </div>
        <GradientButton className="w-full md:w-auto h-11" icon={<Activity className="w-5 h-5" />}>
          New Deployment
        </GradientButton>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search deployments by website name, ID, or version..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 w-full h-11 rounded-full bg-white border-slate-200 
                       shadow-md shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/50 
                       focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/40 focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'Success' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Success' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Success')}
          >
            Success
          </Button>
          <Button
            variant={filterStatus === 'Failed' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Failed' ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Failed')}
          >
            Failed
          </Button>
          <Button
            variant={filterStatus === 'Pending' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100/80 shadow-md shadow-amber-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-700'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Pending')}
          >
            Pending
          </Button>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11 rounded-full bg-white border-slate-200 
                                    shadow-md shadow-slate-200/50 focus:ring-2 focus:ring-blue-500/20 
                                    focus:border-blue-500 transition-all duration-300 hover:bg-slate-100 hover:text-indigo-700">
            <ListFilter className="h-4 w-4 text-slate-400 mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="version">Version</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[150px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Website Name</span>
              </TableHead>
              <TableHead className="min-w-[100px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> Version</span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Status</span>
              </TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Deployed At</span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5"><UserIcon className="w-4 h-4" /> Deployed By</span>
              </TableHead>
              <TableHead className="text-right px-4 py-3 text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedDeployments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No deployments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedDeployments.map((deployment) => (
                <TableRow key={deployment.id} className="group h-16 border-b border-slate-100 hover:bg-slate-50/70 transition-all duration-200">
                  <TableCell className="font-medium text-slate-600 px-4 py-3">{deployment.websiteName}</TableCell>
                  <TableCell className="font-medium text-slate-600 px-4 py-3">{deployment.version}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      className={
                        deployment.status === "Success"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80"
                          : deployment.status === "Failed"
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-100/80"
                          : deployment.status === "Pending"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100/80"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-100/80"
                      }
                    >
                      {deployment.status === "Success" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {deployment.status === "Failed" && <XCircle className="w-3 h-3 mr-1" />}
                      {deployment.status === "Pending" && <Hourglass className="w-3 h-3 mr-1 animate-pulse" />}
                      {deployment.status === "Rolled Back" && <RotateCcw className="w-3 h-3 mr-1" />}
                      {deployment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm px-4 py-3">{deployment.deployedAt}</TableCell>
                  <TableCell className="flex items-center gap-2 text-slate-500 text-sm px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-xs">
                        {deployment.deployedBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    {deployment.deployedBy}
                  </TableCell>
                  <TableCell className="text-right px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                        <DropdownMenuItem onClick={() => handleRollback(deployment)} disabled={deployment.status === 'Pending' || deployment.status === 'Rolled Back'} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                          <RefreshCw className="w-4 h-4" /> <span>Rollback</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewLogs(deployment)} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                          <FileText className="w-4 h-4" /> <span>View Logs</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
              Are you sure you want to roll back to version <span className="font-semibold">{rollbackTarget?.version}</span> for <span className="font-semibold">{rollbackTarget?.websiteName}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRollbackConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRollback}>
              Rollback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
