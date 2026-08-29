import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    MessageSquare, Bell, CheckCircle, Reply, Search, X, Mail, User, Calendar,
    Clock, Trash2, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import formsApi from '@/api/forms';
import websiteApi from '@/api/website';
import { DashboardPageShell, dashboardFilterPillClass, dashboardSearchInputClass, dashboardFilterScrollClass } from '@/components/dashboard/DashboardPageShell';
import Loading from '@/components/Common/LoadingUI';
import {
  DashboardStatCard,
  DashboardListCard,
  DashboardCardSecondaryAction,
  dashboardCardActionPrimaryClass,
} from '@/components/dashboard/DashboardCard';

export default function DashboardMessages() {
    const location = useLocation();
    const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
    const [searchParams, setSearchParams] = useSearchParams();
    const { toast } = useToast();
    const [messages, setMessages] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [websites, setWebsites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingWebsites, setIsLoadingWebsites] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>(searchParams.get('websiteId') || 'all');
    const [searchTerm, setSearchTerm] = useState('');

    const { isAdmin } = useOutletContext<{ isAdmin: boolean }>() || { isAdmin: false };

    const fetchWebsites = async () => {
        try {
            setIsLoadingWebsites(true);
            const res = isAdmin 
                ? await websiteApi.getWebsitesAll() 
                : await websiteApi.getWebsites();
            const rawWebsites = res?.data?.websites || [];
            const fetchedWebsites = Array.isArray(rawWebsites) ? rawWebsites : (rawWebsites.websites || []);
            setWebsites(fetchedWebsites);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        } finally {
            setIsLoadingWebsites(false);
        }
    };

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const params: any = {
                status: filterStatus !== 'all' ? filterStatus : undefined,
                websiteId: selectedWebsiteId !== 'all' ? selectedWebsiteId : undefined,
                limit: 50
            };
            const [messagesRes, statsRes] = await Promise.all([
                formsApi.getUserSubmissions(params),
                formsApi.getStats({ websiteId: params.websiteId })
            ]);

            setMessages(messagesRes.data?.data || []);
            setStats(statsRes.data?.data || {});
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            toast({ 
                title: 'Failed to load messages', 
                variant: 'destructive' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWebsites();
    }, [isAdmin]);

    useEffect(() => {
        fetchMessages();
    }, [filterStatus, selectedWebsiteId]);

    useEffect(() => {
        const websiteId = searchParams.get('websiteId');
        setSelectedWebsiteId(websiteId || 'all');
    }, [searchParams]);

    const handleWebsiteChange = (websiteId: string) => {
        setSelectedWebsiteId(websiteId);
        if (websiteId === 'all') {
            searchParams.delete('websiteId');
            setSearchParams(searchParams, { replace: true });
            return;
        }
        searchParams.set('websiteId', websiteId);
        setSearchParams(searchParams, { replace: true });
    };

    const handleMarkAsRead = async (messageId: string) => {
        try {
            await formsApi.markAsRead(messageId);
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === messageId ? { ...msg, status: 'read' } : msg
                )
            );
            setStats(prev => ({
                ...prev,
                unread: Math.max(0, prev.unread - 1),
                read: prev.read + 1
            }));
            toast({ title: 'Message marked as read' });
        } catch (error) {
            toast({ 
                title: 'Failed to update message', 
                variant: 'destructive' 
            });
        }
    };

    const handleDelete = async (messageId: string) => {
        try {
            await formsApi.deleteSubmission(messageId);
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            const deletedMessage = messages.find(msg => msg.id === messageId);
            if (deletedMessage) {
                setStats(prev => ({
                    ...prev,
                    [deletedMessage.status]: Math.max(0, prev[deletedMessage.status] - 1),
                    total: Math.max(0, prev.total - 1)
                }));
            }
            toast({ title: 'Message deleted' });
        } catch (error) {
            toast({ 
                title: 'Failed to delete message', 
                variant: 'destructive' 
            });
        }
    };

    const filteredMessages = messages.filter(msg => 
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'unread': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'read': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'replied': return 'bg-[#dedfeb] text-[#191b24] border-[#c6c6cd]';
            default: return 'bg-[#f6f3f5] text-[#45464d] border-[#c6c6cd]';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'unread': return <Bell className="w-3 h-3" />;
            case 'read': return <CheckCircle className="w-3 h-3" />;
            case 'replied': return <Reply className="w-3 h-3" />;
            default: return <MessageSquare className="w-3 h-3" />;
        }
    };

    return (
        <>
            <Helmet>
                <title>Messages | Buildora</title>
            </Helmet>

            <DashboardPageShell
                basePath={basePath}
                title="Messages"
                description="Manage contact form submissions from your website visitors."
            >
                <div className="mb-4 flex flex-col gap-3 lg:mb-5 lg:flex-row lg:items-center">
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
                        <Input
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(dashboardSearchInputClass, 'h-9 rounded-full pl-9')}
                        />
                    </div>
                    <div className={cn(dashboardFilterScrollClass, 'lg:flex-none')}>
                        {['all', 'unread', 'read', 'replied'].map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    dashboardFilterPillClass(filterStatus === status),
                                    filterStatus !== status && 'hover:border-[#131924] hover:bg-[#131924] hover:text-white',
                                    filterStatus === status && 'bg-[#131924] border-transparent',
                                )}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    <select
                        value={selectedWebsiteId}
                        onChange={(e) => handleWebsiteChange(e.target.value)}
                        disabled={isLoadingWebsites}
                        aria-label="Filter by website"
                        className="h-9 w-full shrink-0 rounded-full border border-[#c6c6cd] bg-white px-3 text-sm text-[#1b1b1d] lg:w-[200px]"
                    >
                        <option value="all">All websites</option>
                        {websites.map((website) => (
                            <option key={website.id} value={website.id}>
                                {website.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 lg:mb-5 md:grid-cols-4">
                    {[
                        { label: 'Total', value: stats.total || 0, icon: MessageSquare },
                        { label: 'Unread', value: stats.unread || 0, icon: Bell },
                        { label: 'Read', value: stats.read || 0, icon: CheckCircle },
                        { label: 'Replied', value: stats.replied || 0, icon: Reply },
                    ].map(({ label, value, icon: Icon }) => (
                        <DashboardStatCard
                            key={label}
                            className="rounded-lg border border-[#f3f4f6] bg-[#131924] p-3 sm:p-4"
                        >
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <p className="truncate text-xs font-medium text-white/80 sm:text-sm">{label}</p>
                                <Icon className="h-3.5 w-3.5 shrink-0 text-white/70" />
                            </div>
                            <div className="text-xl font-bold text-white sm:text-2xl">{value}</div>
                        </DashboardStatCard>
                    ))}
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <Loading label="Loading messages" />
                    ) : filteredMessages.length === 0 ? (
                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-[#c6c6cd] bg-[#f6f3f5] px-6 py-10 text-center">
                            <MessageSquare className="mb-3 h-10 w-10 text-[#76777d]" />
                            <h3 className="text-base font-semibold text-[#1b1b1d]">
                                {searchTerm ? 'No messages found' : 'No messages yet'}
                            </h3>
                            <p className="mt-1 max-w-md text-sm text-[#45464d]">
                                {searchTerm
                                    ? 'Try adjusting your search terms or filters'
                                    : 'When visitors fill out your contact forms, messages will appear here'}
                            </p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <DashboardListCard
                                key={message.id}
                                className={cn(
                                    'rounded-lg border border-[#f3f4f6] bg-[#fcf8fa] p-3 sm:p-4',
                                    message.status === 'unread' && 'border-amber-200 bg-white',
                                )}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <h4 className="text-sm font-semibold leading-snug text-[#000000] sm:text-base">
                                                {message.name}
                                            </h4>
                                            <span className="break-all text-xs text-[#45464d]">{message.email}</span>
                                            <div className={cn(
                                                'flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                                getStatusColor(message.status),
                                            )}>
                                                {getStatusIcon(message.status)}
                                                {message.status}
                                            </div>
                                        </div>
                                        {message.subject && (
                                            <p className="truncate text-sm font-medium text-[#1b1b1d]">{message.subject}</p>
                                        )}
                                        {message.website?.name && (
                                            <p className="mt-0.5 text-xs text-[#45464d]">Website: {message.website.name}</p>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1 text-xs text-[#45464d]">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="mb-3 line-clamp-2 text-sm leading-snug text-[#45464d]">{message.message}</p>

                                <div className="flex flex-wrap items-center gap-2 border-t border-[#f3f4f6] pt-2">
                                    <DashboardCardSecondaryAction
                                        className="inline-flex h-8 w-auto items-center justify-center gap-1.5 px-0 text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedMessage(message);
                                        }}
                                    >
                                        <Eye className="h-3.5 w-3.5" /> View
                                    </DashboardCardSecondaryAction>
                                    {message.status === 'unread' && (
                                        <button
                                            type="button"
                                            className={cn(dashboardCardActionPrimaryClass, 'h-8 px-3 text-xs')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                void handleMarkAsRead(message.id);
                                            }}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="ml-auto inline-flex h-8 items-center gap-1 text-xs font-medium text-[#ba1a1a] transition-colors hover:text-[#93000a]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            void handleDelete(message.id);
                                        }}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </button>
                                </div>
                            </DashboardListCard>
                        ))
                    )}
                </div>
            </DashboardPageShell>

                {/* Message Detail Modal */}
                <AnimatePresence>
                    {selectedMessage && (
                        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DialogContent className="w-[calc(100vw-2rem)] max-h-[90vh] overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
                                    <div className="sticky top-0 z-10 bg-[#131924] px-4 py-4 sm:px-6">
                                        <DialogTitle className="flex items-center justify-between gap-2 text-lg font-semibold text-white">
                                            Message Details
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedMessage(null)}
                                                className="h-8 w-8 rounded-full p-0 text-white/80 hover:bg-white/10 hover:text-white"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </DialogTitle>
                                    </div>
                                    <div className="max-h-[min(70vh,32rem)] space-y-4 overflow-y-auto bg-white p-4 sm:p-6 no-scrollbar">
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#747781]">
                                                    <User className="h-3.5 w-3.5" />
                                                    Name
                                                </label>
                                                <p className="rounded-lg bg-[#F4F4F5] p-2.5 text-sm font-semibold text-[#0F172A]">{selectedMessage.name}</p>
                                            </div>
                                            <div>
                                                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#747781]">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    Email
                                                </label>
                                                <p className="rounded-lg bg-[#F4F4F5] p-2.5 text-sm font-semibold text-[#0F172A]">{selectedMessage.email}</p>
                                            </div>
                                        </div>
                                        {selectedMessage.subject && (
                                            <div>
                                                <label className="mb-1.5 text-xs font-medium text-[#747781]">Subject</label>
                                                <p className="rounded-lg bg-[#F4F4F5] p-2.5 text-sm font-semibold text-[#0F172A]">{selectedMessage.subject}</p>
                                            </div>
                                        )}
                                        {selectedMessage.website?.name && (
                                            <div>
                                                <label className="mb-1.5 text-xs font-medium text-[#747781]">Website</label>
                                                <p className="rounded-lg bg-[#F4F4F5] p-2.5 text-sm font-semibold text-[#0F172A]">{selectedMessage.website.name}</p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="mb-1.5 text-xs font-medium text-[#747781]">Message</label>
                                            <div className="rounded-lg border border-[#f3f4f6] bg-[#F4F4F5] p-3 text-sm leading-relaxed text-[#0F172A]">
                                                {selectedMessage.message}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 border-t border-[#f3f4f6] pt-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-[#747781]">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(selectedMessage.createdAt).toLocaleString()}
                                            </div>
                                            <div className="flex gap-2">
                                                {selectedMessage.status === 'unread' && (
                                                    <Button
                                                        onClick={() => void handleMarkAsRead(selectedMessage.id)}
                                                        className="h-9 rounded-full bg-[#131924] px-4 text-xs hover:bg-[#202838]"
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    onClick={() => void handleDelete(selectedMessage.id)}
                                                    className="h-9 rounded-full px-4 text-xs text-[#ba1a1a] hover:border-[#ba1a1a] hover:bg-rose-50 hover:text-[#93000a]"
                                                >
                                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </motion.div>
                        </Dialog>
                    )}
                </AnimatePresence>
        </>
    );
}
