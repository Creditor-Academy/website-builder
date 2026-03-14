import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, MoreVertical, RefreshCw, AlertCircle } from 'lucide-react';
import DeploymentLogViewer from './DeploymentLogViewer';

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
    }
    setShowRollbackConfirm(false);
    setRollbackTarget(null);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Website Deployment Status</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deployed At</TableHead>
              <TableHead>Deployed By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deployments.map((deployment) => (
              <TableRow key={deployment.id}>
                <TableCell className="font-medium">{deployment.websiteName}</TableCell>
                <TableCell>{deployment.version}</TableCell>
                <TableCell>
                  <Badge
                    variant={deployment.status === 'Success' ? 'default' : deployment.status === 'Failed' ? 'destructive' : deployment.status === 'Rolled Back' ? 'outline' : 'secondary'}
                  >
                    {deployment.status}
                  </Badge>
                </TableCell>
                <TableCell>{deployment.deployedAt}</TableCell>
                <TableCell>{deployment.deployedBy}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRollback(deployment)} disabled={deployment.status === 'Pending' || deployment.status === 'Rolled Back'}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Rollback</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewLogs(deployment)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>View Logs</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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
        <DialogContent>
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
    </div>
  );
}
