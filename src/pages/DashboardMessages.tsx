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
import { DashboardPageShell, dashboardFilterPillClass, dashboardSearchInputClass, dashboardFilterScrollClass, dashboardToolbarClass } from '@/components/dashboard/DashboardPageShell';
import {
  DashboardStatCard,
  DashboardListCard,
  DashboardCardSecondaryAction,
  dashboardCardClass,
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
            case 'unread': return <Bell className="w-4 h-4" />;
            case 'read': return <CheckCircle className="w-4 h-4" />;
            case 'replied': return <Reply className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
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
                <div className={dashboardToolbarClass}>
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
                        <Input
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(dashboardSearchInputClass, 'h-9 rounded-full pl-9')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                        { label: 'Total Messages', value: stats.total || 0, icon: MessageSquare },
                        { label: 'Unread', value: stats.unread || 0, icon: Bell, accent: 'text-amber-600' },
                        { label: 'Read', value: stats.read || 0, icon: CheckCircle, accent: 'text-emerald-600' },
                        { label: 'Replied', value: stats.replied || 0, icon: Reply, accent: 'text-white' },
                    ].map(({ label, value, icon: Icon, accent }) => (
                        <DashboardStatCard key={label} className="rounded-3xl border-[#E8E8E8] bg-[#0F172A] p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-white">{label}</p>
                                <div className="flex items-center justify-center  text-white">
                                    <Icon className="h-4 w-4" />
                                </div>
                            </div>
                            <div className={cn('text-2xl sm:text-3xl font-bold text-white', accent)}>{value}</div>
                        </DashboardStatCard>
                    ))}
                </div>

                <div className={dashboardToolbarClass}>
                    <div className={dashboardFilterScrollClass}>
                        {['all', 'unread', 'read', 'replied'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={dashboardFilterPillClass(filterStatus === status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full lg:w-auto lg:ml-auto">
                        <label className="text-sm font-medium text-[#45464d] shrink-0">Website</label>
                        <select
                            value={selectedWebsiteId}
                            onChange={(e) => handleWebsiteChange(e.target.value)}
                            disabled={isLoadingWebsites}
                            className="h-11 px-3 rounded-lg border border-[#c6c6cd] bg-white text-sm text-[#1b1b1d] w-full sm:min-w-[180px]"
                        >
                            <option value="all">All websites</option>
                            {websites.map((website) => (
                                <option key={website.id} value={website.id}>
                                    {website.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={cn(dashboardCardClass, 'animate-pulse p-6')}>
                                <div className="space-y-4">
                                    <div className="h-4 bg-[#eae7e9] rounded-full w-3/4" />
                                    <div className="h-3 bg-[#eae7e9] rounded-full w-1/2" />
                                    <div className="h-3 bg-[#eae7e9] rounded-full w-full" />
                                </div>
                            </div>
                        ))
                    ) : filteredMessages.length === 0 ? (
                        <div className="border border-dashed border-[#c6c6cd] rounded-lg bg-[#f6f3f5] p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-[#76777d] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#1b1b1d] mb-2">
                                {searchTerm ? 'No messages found' : 'No messages yet'}
                            </h3>
                            <p className="text-[#45464d]">
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
                                    'rounded-3xl border-[#E8E8E8] bg-white',
                                    message.status === 'unread' && 'border-amber-200'
                                )}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-2">
                                            <h4 className="text-lg sm:text-[22px] font-semibold text-[#000000] leading-snug break-words">{message.name}</h4>
                                            <span className="text-xs sm:text-sm text-[#45464d] break-all">{message.email}</span>
                                            <div className={cn(
                                                "px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 border w-fit",
                                                getStatusColor(message.status)
                                            )}>
                                                {getStatusIcon(message.status)}
                                                {message.status}
                                            </div>
                                        </div>
                                        {message.subject && (
                                            <p className="font-medium text-[#1b1b1d] mb-2">{message.subject}</p>
                                        )}
                                        {message.website?.name && (
                                            <p className="text-sm text-[#45464d] mb-2">Website: {message.website.name}</p>
                                        )}
                                    </div>
                                    <div className="text-xs sm:text-sm text-[#45464d] flex items-center gap-1 shrink-0">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-[14px] text-[#45464d] line-clamp-2 mb-4">{message.message}</p>

                                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 pt-4 border-t border-[#c6c6cd]">
                                    <DashboardCardSecondaryAction
                                        className="inline-flex items-center justify-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedMessage(message);
                                        }}
                                    >
                                        <Eye className="w-4 h-4" /> View Details
                                    </DashboardCardSecondaryAction>
                                    {message.status === 'unread' && (
                                        <button
                                            type="button"
                                            className={dashboardCardActionPrimaryClass}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(message.id);
                                            }}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="text-[14px] font-medium text-[#ba1a1a] hover:text-[#93000a] transition-colors sm:ml-auto text-center py-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(message.id);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 inline mr-1" /> Delete
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
                                <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-3xl rounded-2xl sm:rounded-[2rem] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-5 sm:py-6 sticky top-0 z-10">
                                        <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center justify-between gap-2">
                                            Message Details
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedMessage(null)}
                                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </DialogTitle>
                                    </div>
                                    <div className="rounded-b-3xl bg-white p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-[#747781] flex items-center gap-2 mb-2">
                                                    <User className="w-4 h-4" />
                                                    Name
                                                </label>
                                                <p className="font-semibold text-[#0F172A] bg-[#F4F4F5] p-3 rounded-xl">{selectedMessage.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[#747781] flex items-center gap-2 mb-2">
                                                    <Mail className="w-4 h-4" />
                                                    Email
                                                </label>
                                                <p className="font-semibold text-[#0F172A] bg-[#F4F4F5] p-3 rounded-xl">{selectedMessage.email}</p>
                                            </div>
                                        </div>
                                        {selectedMessage.subject && (
                                            <div>
                                                <label className="text-sm font-medium text-[#747781] mb-2">Subject</label>
                                                <p className="font-semibold text-[#0F172A] bg-[#F4F4F5] p-3 rounded-xl">{selectedMessage.subject}</p>
                                            </div>
                                        )}
                                        {selectedMessage.website?.name && (
                                            <div>
                                                <label className="text-sm font-medium text-[#747781] mb-2">Website</label>
                                                <p className="font-semibold text-[#0F172A] bg-[#F4F4F5] p-3 rounded-xl">{selectedMessage.website.name}</p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm font-medium text-[#747781] mb-2">Message</label>
                                            <div className="text-[#0F172A] leading-relaxed bg-[#F4F4F5] p-4 rounded-xl border border-[#E5E7EB]">
                                                {selectedMessage.message}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-[#E8E8E8]">
                                            <div className="text-sm text-[#747781] flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                                            </div>
                                            <div className="flex gap-2">
                                                {selectedMessage.status === 'unread' && (
                                                    <Button
                                                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                                                        className="rounded-full"
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleDelete(selectedMessage.id)}
                                                    className="rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
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
