import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DeploymentMonitoring from '../components/dashboard/DeploymentMonitoring';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, TrendingUp, FileText, Loader2, Globe } from 'lucide-react';
import websiteApi from '@/api/website';
import analyticsApi from '@/api/analytics';

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
    <div className="admin-page space-y-5">
      <DeploymentMonitoring />

      {/* Analytics Section */}
      <div>
        <div className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#747781]" /> Site Analytics
              </h3>
              <p className="text-[#747781] mt-1 text-sm">Real-time page view tracking for published websites.</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
                <SelectTrigger className="w-[220px] h-10 rounded-full bg-white border-[#E8E8E8] shadow-sm">
                  <Globe className="w-4 h-4 text-[#787778] mr-2" />
                  <SelectValue placeholder="Select website" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
                <SelectTrigger className="w-[130px] h-10 rounded-full bg-white border-[#E8E8E8] shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          {!selectedWebsite ? (
            <div className="text-center py-12 text-[#787778]">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Select a published website to view analytics.</p>
            </div>
          ) : loadingAnalytics ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#787778]" />
              <span className="ml-2 text-[#747781]">Loading analytics...</span>
            </div>
          ) : !analytics ? (
            <div className="text-center py-12 text-[#787778]">
              <p>No analytics data available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#F4F4F5] rounded-2xl p-5 border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-[#0F172A] mb-1">
                    <Eye className="w-4 h-4" /> <span className="text-sm font-medium">Total Views</span>
                  </div>
                  <p className="text-3xl font-bold text-[#0F172A]">{analytics.totalViews.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-5 border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <TrendingUp className="w-4 h-4" /> <span className="text-sm font-medium">Avg/Day</span>
                  </div>
                  <p className="text-3xl font-bold text-[#0F172A]">
                    {analytics.daily.length > 0 ? Math.round(analytics.totalViews / analytics.daily.length).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <FileText className="w-4 h-4" /> <span className="text-sm font-medium">Top Pages</span>
                  </div>
                  <p className="text-3xl font-bold text-[#0F172A]">{analytics.topPages.length}</p>
                </div>
              </div>

              {/* Bar chart */}
              {analytics.daily.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Daily Page Views</h3>
                  <div className="flex items-end justify-center gap-[2px] h-40 bg-[#F4F4F5] rounded-xl p-3 border border-[#E5E7EB] overflow-hidden">
                    {analytics.daily.map((d) => (
                      <div key={d.date} className="flex-1 max-w-[40px] flex flex-col items-center justify-end h-full group relative">
                        <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {d.date}: {d.views} views
                        </div>
                        <div
                          className="w-full bg-[#0F172A] rounded-t-sm min-h-[2px] transition-all duration-300 "
                          style={{ height: `${(d.views / maxDaily) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#787778] mt-1 px-3">
                    <span>{analytics.daily[0]?.date}</span>
                    <span>{analytics.daily[analytics.daily.length - 1]?.date}</span>
                  </div>
                </div>
              )}

              {/* Top pages table */}
              {analytics.topPages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Top Pages</h3>
                  <div className="space-y-2">
                    {analytics.topPages.map((page, i) => (
                      <div key={page.path} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-[#E5E7EB]">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#787778] w-5">#{i + 1}</span>
                          <span className="text-sm font-medium text-[#0F172A] font-mono">{page.path}</span>
                        </div>
                        <Badge className="bg-[#F4F4F5] text-[#0F172A] hover:bg-[#EBEBED]">
                          {page.views.toLocaleString()} views
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.totalViews === 0 && (
                <div className="text-center py-8 text-[#787778]">
                  <Eye className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No page views recorded yet. Analytics will appear after visitors view your published site.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}