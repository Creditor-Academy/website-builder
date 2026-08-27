import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, TrendingUp, FileText, Loader2, Globe } from 'lucide-react';
import websiteApi from '@/api/website';
import analyticsApi from '@/api/analytics';
import { DashboardStatCard } from '@/components/dashboard/DashboardCard';
import DeploymentMonitoring from '../components/dashboard/DeploymentMonitoring';

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
    <div className="admin-page space-y-8">
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0F172A] px-4 py-5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] sm:px-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />

        <div className="relative z-10 min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            Deployment Management
          </h2>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Track deployments and view site analytics for published websites.
          </p>
        </div>
      </div>

      <DeploymentMonitoring />

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 text-xl font-bold text-[#0F172A] sm:text-2xl">
                <BarChart3 className="h-5 w-5 text-[#0F172A] sm:h-6 sm:w-6" /> Site Analytics
              </h3>
              <p className="mt-1 text-sm text-[#747781]">Real-time page view tracking for published websites.</p>
            </div>
            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
              <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
                <SelectTrigger className="h-9 w-full rounded-full border-[#E5E7EB] bg-white focus:ring-offset-0 sm:w-[220px]">
                  <Globe className="mr-2 h-4 w-4 text-[#787778]" />
                  <SelectValue placeholder="Select website" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E8E8E8] bg-white shadow-lg">
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
                <SelectTrigger className="h-9 w-full rounded-full border-[#E5E7EB] bg-white focus:ring-offset-0 sm:w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E8E8E8] bg-white shadow-lg">
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedWebsite ? (
            <div className="py-12 text-center text-[#787778]">
              <BarChart3 className="mx-auto mb-3 h-12 w-12 opacity-40" />
              <p>Select a published website to view analytics.</p>
            </div>
          ) : loadingAnalytics ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#787778]" />
              <span className="ml-2 text-[#747781]">Loading analytics...</span>
            </div>
          ) : !analytics ? (
            <div className="py-12 text-center text-[#787778]">
              <p>No analytics data available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <DashboardStatCard>
                  <div className="mb-1 flex items-center gap-2 text-[#747781]">
                    <Eye className="h-4 w-4" /> <span className="text-sm font-medium">Total Views</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A] sm:text-3xl">{analytics.totalViews.toLocaleString()}</p>
                </DashboardStatCard>
                <DashboardStatCard>
                  <div className="mb-1 flex items-center gap-2 text-[#747781]">
                    <TrendingUp className="h-4 w-4" /> <span className="text-sm font-medium">Avg/Day</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                    {analytics.daily.length > 0 ? Math.round(analytics.totalViews / analytics.daily.length).toLocaleString() : '0'}
                  </p>
                </DashboardStatCard>
                <DashboardStatCard>
                  <div className="mb-1 flex items-center gap-2 text-[#747781]">
                    <FileText className="h-4 w-4" /> <span className="text-sm font-medium">Top Pages</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A] sm:text-3xl">{analytics.topPages.length}</p>
                </DashboardStatCard>
              </div>

              {analytics.daily.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#0F172A]">Daily Page Views</h3>
                  <div className="rounded-2xl border border-[#E5E7EB] bg-[#F4F4F5] p-3 pt-10">
                    <div className="flex h-40 items-end justify-center gap-[2px]">
                      {analytics.daily.map((d) => (
                        <div key={d.date} className="group relative flex h-full max-w-[40px] flex-1 flex-col items-center justify-end">
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0F172A] px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                            {d.date}: {d.views} views
                          </div>
                          <div
                            className="min-h-[2px] w-full rounded-t-sm bg-[#0F172A] transition-colors duration-200 hover:bg-[#1E293B]"
                            style={{ height: `${(d.views / maxDaily) * 100}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between px-3 text-[10px] text-[#787778]">
                    <span>{analytics.daily[0]?.date}</span>
                    <span>{analytics.daily[analytics.daily.length - 1]?.date}</span>
                  </div>
                </div>
              )}

              {analytics.topPages.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#0F172A]">Top Pages</h3>
                  <div className="space-y-2">
                    {analytics.topPages.map((page, i) => (
                      <div key={page.path} className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 transition-colors hover:bg-[#F4F4F5]">
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-xs font-bold text-[#787778]">#{i + 1}</span>
                          <span className="font-mono text-sm font-medium text-[#0F172A]">{page.path}</span>
                        </div>
                        <Badge className="rounded-full border-0 bg-[#F4F4F5] text-[#0F172A] hover:bg-[#F4F4F5]">
                          {page.views.toLocaleString()} views
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.totalViews === 0 && (
                <div className="py-8 text-center text-[#787778]">
                  <Eye className="mx-auto mb-2 h-10 w-10 opacity-40" />
                  <p className="text-sm">No page views recorded yet. Analytics will appear after visitors view your published site.</p>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
