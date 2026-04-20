import websiteApi from '@/api/website';

export interface PublishRequest {
  websiteId: string;
  subdomain?: string;
  customDomain?: string;
}

export interface PublishResponse {
  success: boolean;
  url: string;
  publishedAt: string;
  sslEnabled: boolean;
  status: 'active' | 'pending' | 'error';
  message?: string;
}

export interface DomainConfig {
  domain: string;
  type: 'subdomain' | 'custom';
  status: 'active' | 'pending' | 'error';
  sslEnabled: boolean;
  dnsRecords?: {
    A?: string;
    CNAME?: string;
    TXT?: string[];
  };
  addedAt: string;
}

export interface DeploymentRecord {
  id: string;
  versionId: string;
  status: 'pending' | 'building' | 'uploading' | 'active' | 'failed' | 'rolled_back';
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

class PublishService {
  async publishWebsite(request: PublishRequest): Promise<PublishResponse> {
    try {
      const response = await websiteApi.publishWebsite(request.websiteId, {
        subdomain: request.subdomain,
        customDomain: request.customDomain,
      });
      return response.data;
    } catch (error) {
      console.error('Publishing failed:', error);
      throw new Error('Failed to publish website');
    }
  }

  async getDomains(websiteId: string): Promise<DomainConfig[]> {
    try {
      const response = await websiteApi.getDomains(websiteId);
      return response.data.domains;
    } catch (error) {
      console.error('Failed to fetch domains:', error);
      throw new Error('Failed to fetch domains');
    }
  }

  async addDomain(websiteId: string, domain: string): Promise<DomainConfig> {
    try {
      const response = await websiteApi.addDomain(websiteId, domain);
      return response.data.domain;
    } catch (error) {
      console.error('Failed to add domain:', error);
      throw new Error('Failed to add domain');
    }
  }

  async removeDomain(websiteId: string, domain: string): Promise<void> {
    try {
      await websiteApi.removeDomain(websiteId, domain);
    } catch (error) {
      console.error('Failed to remove domain:', error);
      throw new Error('Failed to remove domain');
    }
  }

  async verifyDomain(websiteId: string, domain: string): Promise<{ verified: boolean; dnsRecords: any }> {
    try {
      const response = await websiteApi.verifyDomain(websiteId, domain);
      return response.data;
    } catch (error) {
      console.error('Domain verification failed:', error);
      throw new Error('Failed to verify domain');
    }
  }

  async getDeployments(websiteId: string): Promise<DeploymentRecord[]> {
    try {
      const response = await websiteApi.getDeployments(websiteId);
      return response.data.deployments;
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
      throw new Error('Failed to fetch deployments');
    }
  }

  async rollbackDeployment(websiteId: string, deploymentId: string): Promise<{ success: boolean; deployment: any }> {
    try {
      const response = await websiteApi.rollbackDeployment(websiteId, deploymentId);
      return response.data;
    } catch (error) {
      console.error('Rollback failed:', error);
      throw new Error('Failed to rollback deployment');
    }
  }

  /**
   * Generate static site files (for export/download)
   */
  async generateStaticSite(websiteId: string): Promise<Blob> {
    const response = await websiteApi.exportWebsite(websiteId);
    return response.data;
  }

  /**
   * Download the exported site as a ZIP file
   */
  async downloadExport(websiteId: string, siteName?: string): Promise<void> {
    const blob = await this.generateStaticSite(websiteId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(siteName || 'website').replace(/[^a-zA-Z0-9_-]/g, '_')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const publishService = new PublishService();
