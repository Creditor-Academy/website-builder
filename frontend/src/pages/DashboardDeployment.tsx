import React from 'react';
import DeploymentMonitoring from '../components/dashboard/DeploymentMonitoring';

export default function DashboardDeployment() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Deployment Management</h2>
      <DeploymentMonitoring />
    </div>
  );
}