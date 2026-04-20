import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { generateStaticSite } from './static-site-generator.js';

export type DeploymentStatus = 'pending' | 'building' | 'uploading' | 'active' | 'failed' | 'rolled_back';

export interface DeploymentRecord {
  id: string;
  versionId: string;
  status: DeploymentStatus;
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
  logs: string[];
}

interface DeployInput {
  websiteId: string;
  versionId: string;
  domain: string;
  content: Record<string, any>;
  siteName: string;
  deployedBy: string;
}

/** Root directory where all published sites are stored */
const SITES_ROOT = path.resolve(process.cwd(), 'storage', 'sites');

/** Base URL for accessing published sites (set in .env or fallback to localhost) */
const getPublicBaseUrl = () =>
  (process.env.PUBLISHED_SITES_BASE_URL || `http://localhost:${process.env.PORT || 5000}/sites`).replace(/\/+$/, '');

const buildPrefix = (websiteId: string, deploymentId: string) =>
  `${websiteId}/${deploymentId}`;

const build404Html = (siteName: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Page Not Found – ${siteName.replace(/[<>"&]/g, '')}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8fafc;color:#334155;text-align:center}.c{max-width:480px;padding:48px 24px}h1{font-size:6rem;font-weight:800;color:#2563eb;line-height:1}p{margin-top:16px;font-size:1.1rem;color:#64748b}a{display:inline-block;margin-top:24px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600}</style>
</head>
<body><div class="c"><h1>404</h1><p>The page you're looking for doesn't exist.</p><a href="/">Go Home</a></div></body>
</html>`;

const writeFile = async (filePath: string, body: string) => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, body, 'utf-8');
};

export const deploy = async (input: DeployInput): Promise<DeploymentRecord> => {
  const deploymentId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  const logs: string[] = [];
  const prefix = buildPrefix(input.websiteId, deploymentId);

  const record: DeploymentRecord = {
    id: deploymentId,
    versionId: input.versionId,
    status: 'pending',
    url: '',
    domain: input.domain,
    artifactPrefix: prefix,
    publishedAt: startedAt,
    startedAt,
    finishedAt: null,
    deployedBy: input.deployedBy,
    errorMessage: null,
    fileCount: 0,
    totalSize: 0,
    logs,
  };

  try {
    // Phase 1: Build
    record.status = 'building';
    logs.push(`[${new Date().toISOString()}] [INFO] Starting deployment ${deploymentId}`);
    logs.push(`[${new Date().toISOString()}] [INFO] Generating static site for "${input.siteName}"...`);

    const files = generateStaticSite(input.content, input.siteName, input.websiteId);
    logs.push(`[${new Date().toISOString()}] [INFO] Generated ${files.length} file(s).`);

    // Phase 2: Write to local storage
    record.status = 'uploading';
    logs.push(`[${new Date().toISOString()}] [INFO] Writing files to local storage...`);

    let totalSize = 0;
    for (const file of files) {
      const filePath = path.join(SITES_ROOT, prefix, file.filename);
      await writeFile(filePath, file.html);
      totalSize += Buffer.byteLength(file.html, 'utf-8');
      logs.push(`[${new Date().toISOString()}] [INFO] Wrote ${file.filename}`);
    }

    // Copy all pages to the latest/ alias so the live URL always resolves
    const latestDir = path.join(SITES_ROOT, input.websiteId, 'latest');
    for (const file of files) {
      await writeFile(path.join(latestDir, file.filename), file.html);
    }
    logs.push(`[${new Date().toISOString()}] [INFO] Updated latest/ alias (${files.length} file(s))`);

    // Write a 404.html error page
    const errorHtml = build404Html(input.siteName);
    await writeFile(path.join(latestDir, '404.html'), errorHtml);
    await writeFile(path.join(SITES_ROOT, prefix, '404.html'), errorHtml);

    // Phase 3: Finalize
    record.status = 'active';
    record.fileCount = files.length;
    record.totalSize = totalSize;
    record.url = `${getPublicBaseUrl()}/${input.websiteId}/latest/index.html`;
    record.finishedAt = new Date().toISOString();
    logs.push(`[${new Date().toISOString()}] [SUCCESS] Deployment complete. URL: ${record.url}`);
  } catch (err: any) {
    record.status = 'failed';
    record.errorMessage = err?.message || 'Unknown deployment error';
    record.finishedAt = new Date().toISOString();
    logs.push(`[${new Date().toISOString()}] [ERROR] Deployment failed: ${record.errorMessage}`);
  }

  return record;
};
