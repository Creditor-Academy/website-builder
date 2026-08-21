import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DeploymentMonitoring from '../components/dashboard/DeploymentMonitoring';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, TrendingUp, FileText, Loader2, Globe } from 'lucide-react';
import websiteApi from '@/api/website';
import analyticsApi from '@/api/analytics';
import { DashboardPageShell } from '@/components/dashboard/DashboardPageShell';
import { DashboardPanel, DashboardStatCard } from '@/components/dashboard/DashboardCard';

interface DailyView { date: string; views: number; }
interface TopPage { path: string; views: number; }
interface AnalyticsData {
  websiteId: string;
  period: string;
  totalViews: number;
  daily: DailyView[];
  topPages: TopPage[];
}

export default function DashboardDeployment() {
  const [websites, setWebsites] = useState<{ id: string; name: string }[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [period, setPeriod] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingWebsites, setLoadingWebsites] = useState(true);
  const { isAdmin } = useOutletContext<{ isAdmin: boolean }>() || { isAdmin: false };
  const basePath = isAdmin ? '/admin' : '/dashboard';

  useEffect(() => {
    (async () => {
      try {
        const res = isAdmin
          ? await websiteApi.getWebsitesAll({ limit: 100, status: 'PUBLISHED' })
          : await websiteApi.getWebsites({ limit: 100, status: 'PUBLISHED' });
        const rawWebsites = res.data?.websites || res.data?.data?.websites || [];
        const list = Array.isArray(rawWebsites) ? rawWebsites : (rawWebsites.websites || []);
        const published = list.filter((w: any) => w.status?.toUpperCase() === 'PUBLISHED' || w.content?.builderMeta?.deployments?.length > 0);
        setWebsites(published.map((w: any) => ({ id: w.id, name: w.name })));
        if (published.length > 0) setSelectedWebsite(published[0].id);
      } catch { /* ignore */ }
      finally { setLoadingWebsites(false); }
    })();
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedWebsite) return;
    (async () => {
      setLoadingAnalytics(true);
      try {
        const res = await analyticsApi.getWebsiteAnalytics(selectedWebsite, period);
        setAnalytics(res.data);
      } catch { setAnalytics(null); }
      finally { setLoadingAnalytics(false); }
    })();
  }, [selectedWebsite, period]);

  const maxDaily = analytics ? Math.max(...analytics.daily.map(d => d.views), 1) : 1;

  return (
    <DashboardPageShell
      basePath={basePath}
      title="Deployment Management"
      description="Track deployments and view site analytics for published websites."
      pageLabel="Deployment"
    >
      <div className="space-y-8">
        <DeploymentMonitoring />

        <DashboardPanel className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:gap-4 lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-[#000000] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#131b2e]" /> Site Analytics
              </h3>
              <p className="text-[#45464d] mt-1 text-sm">Real-time page view tracking for published websites.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
                <SelectTrigger className="w-full sm:w-[220px] h-10 rounded-lg bg-white border-[#c6c6cd]">
                  <Globe className="w-4 h-4 text-[#76777d] mr-2" />
                  <SelectValue placeholder="Select website" />
                </SelectTrigger>
                <SelectContent>
                  {loadingWebsites ? (
                    <SelectItem value="_loading" disabled>Loading...</SelectItem>
                  ) : websites.length === 0 ? (
                    <SelectItem value="_none" disabled>No published sites</SelectItem>
                  ) : (
                    websites.map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full sm:w-[130px] h-10 rounded-lg bg-white border-[#c6c6cd]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedWebsite ? (
            <div className="text-center py-12 text-[#76777d]">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Select a published website to view analytics.</p>
            </div>
          ) : loadingAnalytics ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#76777d]" />
              <span className="ml-2 text-[#45464d]">Loading analytics...</span>
            </div>
          ) : !analytics ? (
            <div className="text-center py-12 text-[#76777d]">
              <p>No analytics data available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DashboardStatCard>
                  <div className="flex items-center gap-2 text-[#45464d] mb-1">
                    <Eye className="w-4 h-4" /> <span className="text-sm font-medium">Total Views</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#000000]">{analytics.totalViews.toLocaleString()}</p>
                </DashboardStatCard>
                <DashboardStatCard>
                  <div className="flex items-center gap-2 text-[#45464d] mb-1">
                    <TrendingUp className="w-4 h-4" /> <span className="text-sm font-medium">Avg/Day</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#000000]">
                    {analytics.daily.length > 0 ? Math.round(analytics.totalViews / analytics.daily.length).toLocaleString() : '0'}
                  </p>
                </DashboardStatCard>
                <DashboardStatCard>
                  <div className="flex items-center gap-2 text-[#45464d] mb-1">
                    <FileText className="w-4 h-4" /> <span className="text-sm font-medium">Top Pages</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#000000]">{analytics.topPages.length}</p>
                </DashboardStatCard>
              </div>

              {analytics.daily.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1b1b1d] mb-3">Daily Page Views</h3>
                  <div className="flex items-end justify-center gap-[2px] h-40 bg-[#f6f3f5] rounded-lg p-3 border border-[#c6c6cd] overflow-hidden">
                    {analytics.daily.map((d) => (
                      <div key={d.date} className="flex-1 max-w-[40px] flex flex-col items-center justify-end h-full group relative">
                        <div className="absolute -top-8 bg-[#131b2e] text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {d.date}: {d.views} views
                        </div>
                        <div
                          className="w-full bg-[#131b2e] rounded-t-sm min-h-[2px] transition-all duration-300 hover:bg-[#252f4a]"
                          style={{ height: `${(d.views / maxDaily) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#76777d] mt-1 px-3">
                    <span>{analytics.daily[0]?.date}</span>
                    <span>{analytics.daily[analytics.daily.length - 1]?.date}</span>
                  </div>
                </div>
              )}

              {analytics.topPages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1b1b1d] mb-3">Top Pages</h3>
                  <div className="space-y-2">
                    {analytics.topPages.map((page, i) => (
                      <div key={page.path} className="flex items-center justify-between bg-[#fcf8fa] rounded-lg px-4 py-3 border border-[#c6c6cd] hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#76777d] w-5">#{i + 1}</span>
                          <span className="text-sm font-medium text-[#1b1b1d] font-mono">{page.path}</span>
                        </div>
                        <Badge className="bg-[#dedfeb] text-[#191b24] hover:bg-[#dedfeb]">
                          {page.views.toLocaleString()} views
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.totalViews === 0 && (
                <div className="text-center py-8 text-[#76777d]">
                  <Eye className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No page views recorded yet. Analytics will appear after visitors view your published site.</p>
                </div>
              )}
            </div>
          )}
        </DashboardPanel>
      </div>
    </DashboardPageShell>
  );
}
