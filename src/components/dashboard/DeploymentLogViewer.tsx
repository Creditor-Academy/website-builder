import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface DeploymentLogViewerProps {
  isOpen: boolean;
  onClose: () => void;
  deploymentId: string;
  logs: string;
}

export default function DeploymentLogViewer({ isOpen, onClose, deploymentId, logs }: DeploymentLogViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Deployment Logs for {deploymentId}</DialogTitle>
          <DialogDescription>
            Detailed output from the deployment process.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4 border border-slate-200 rounded-md bg-slate-50 text-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto">
          {logs}
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
