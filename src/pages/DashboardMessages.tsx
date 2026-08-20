import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    MessageSquare, Bell, CheckCircle, ArrowRight, Search, X, Mail, User, Calendar,
    Clock, Filter, Trash2, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import formsApi from '@/api/forms';
import websiteApi from '@/api/website';
import messagesHeroImg from '@/assets/admin_dashboard/pngtree-message-icon-cartoon-vector-illustration-clipart-png-image_12696555.avif';

export default function DashboardMessages() {
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
            case 'unread': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'read': return 'bg-green-100 text-green-700 border-green-200';
            case 'replied': return 'bg-[#F4F4F5] text-[#0F172A] border-[#E8E8E8]';
            default: return 'bg-[#F4F4F5] text-[#0F172A] border-[#E8E8E8]';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'unread': return <Bell className="w-4 h-4" />;
            case 'read': return <CheckCircle className="w-4 h-4" />;
            case 'replied': return <ArrowRight className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    return (
        <div className="admin-page">
            <Helmet>
                <title>Messages | Buildora</title>
            </Helmet>

            <div className="w-full">
                {/* Hero + stats: banner left, 2×2 cards right */}
                <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
                    <div className="relative flex min-h-[220px] items-center overflow-hidden rounded-3xl bg-[#0F172A] px-7 py-6 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)] lg:min-h-[240px]">
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-48 translate-x-8 skew-x-[-15deg] bg-white/5" />
                        <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />
                        <div className="relative z-10 max-w-[55%] pr-2 sm:max-w-[48%]">
                            <p className="text-sm font-medium text-white/60">Inbox</p>
                            <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">Messages</h1>
                            <p className="mt-1.5 max-w-sm text-xs text-white/45">
                                Manage contact form submissions from your website visitors.
                            </p>
                        </div>
                        <img
                            src={messagesHeroImg}
                            alt=""
                            className="pointer-events-none absolute -bottom-1 right-2 h-[78%] w-auto max-w-[46%] object-contain object-bottom sm:right-4 sm:h-[85%] sm:max-w-[52%] lg:-bottom-2 lg:h-[90%] lg:max-w-[55%]"
                            draggable={false}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {
                                label: 'Total Messages',
                                value: isLoading ? '…' : (stats.total || 0),
                                icon: <MessageSquare className="w-4 h-4" />,
                                iconBg: 'bg-[#F4F4F5] text-[#0F172A]',
                                valueClass: 'text-[#0F172A]',
                            },
                            {
                                label: 'Unread',
                                value: isLoading ? '…' : (stats.unread || 0),
                                icon: <Bell className="w-4 h-4" />,
                                iconBg: 'bg-amber-50 text-amber-600',
                                valueClass: 'text-amber-600',
                            },
                            {
                                label: 'Read',
                                value: isLoading ? '…' : (stats.read || 0),
                                icon: <CheckCircle className="w-4 h-4" />,
                                iconBg: 'bg-emerald-50 text-emerald-600',
                                valueClass: 'text-emerald-600',
                            },
                            {
                                label: 'Replied',
                                value: isLoading ? '…' : (stats.replied || 0),
                                icon: <ArrowRight className="w-4 h-4" />,
                                iconBg: 'bg-[#F4F4F5] text-[#0F172A]',
                                valueClass: 'text-[#0F172A]',
                            },
                        ].map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.07 }}
                                className="rounded-3xl border border-[#E8E8E8] bg-white p-5"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[#747781]">{s.label}</p>
                                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', s.iconBg)}>
                                        {s.icon}
                                    </div>
                                </div>
                                <p className={cn('text-3xl font-bold', s.valueClass)}>{s.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#787778]" />
                        <Input
                            placeholder="Search messages by name, email, subject, or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 rounded-xl bg-white border-[#E8E8E8] shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'unread', 'read', 'replied'].map(status => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? 'default' : 'outline'}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "rounded-full h-12 px-6 capitalize font-medium transition-all",
                                    filterStatus === status 
                                        ? "bg-[#0F172A] text-white shadow-none" 
                                        : "bg-white text-[#0F172A] border-[#E8E8E8] hover:bg-[#F4F4F5]"
                                )}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-[#747781]">Website</label>
                        <select
                            value={selectedWebsiteId}
                            onChange={(e) => handleWebsiteChange(e.target.value)}
                            disabled={isLoadingWebsites}
                            className="h-10 px-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#0F172A]"
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

                {/* Messages List */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-3xl border border-[#E8E8E8] bg-white p-6"
                            >
                                <div className="space-y-4">
                                    <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                                    <div className="h-3 w-1/2 rounded-full bg-[#F4F4F5]" />
                                    <div className="h-3 w-full rounded-full bg-[#F4F4F5]" />
                                    <div className="h-3 w-2/3 rounded-full bg-[#F4F4F5]" />
                                </div>
                            </div>
                        ))
                    ) : filteredMessages.length === 0 ? (
                        <div className="col-span-full rounded-3xl border-2 border-dashed border-slate-300 bg-[#F4F4F5]/50 p-12 text-center">
                            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                            <h3 className="mb-2 text-xl font-semibold text-[#747781]">
                                {searchTerm ? 'No messages found' : 'No messages yet'}
                            </h3>
                            <p className="text-[#787778]">
                                {searchTerm
                                    ? 'Try adjusting your search terms or filters'
                                    : 'When visitors fill out your contact forms, messages will appear here'
                                }
                            </p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedMessage(message)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setSelectedMessage(message);
                                    }
                                }}
                                className={cn(
                                    'cursor-pointer rounded-3xl border bg-white p-6 shadow-sm transition-colors',
                                    'hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:shadow-md',
                                    message.status === 'unread'
                                        ? 'border-amber-200 bg-amber-50/30'
                                        : 'border-[#E8E8E8]'
                                )}
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <h4 className="font-semibold text-[#0F172A]">{message.name}</h4>
                                            <span className="truncate text-sm text-[#747781]">{message.email}</span>
                                            <div className={cn(
                                                'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium',
                                                getStatusColor(message.status)
                                            )}>
                                                {getStatusIcon(message.status)}
                                                {message.status}
                                            </div>
                                        </div>
                                        {message.subject && (
                                            <p className="mb-2 font-medium text-[#0F172A]">{message.subject}</p>
                                        )}
                                        {message.website?.name && (
                                            <p className="mb-2 text-sm text-[#747781]">Website: {message.website.name}</p>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1 text-sm text-[#747781]">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="mb-4 line-clamp-2 text-[#747781]">{message.message}</p>

                                <div className="flex flex-wrap items-center gap-2 border-t border-[#E8E8E8] pt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedMessage(message);
                                        }}
                                        className="rounded-full border-[#E5E7EB] bg-white text-[#0F172A] shadow-none hover:bg-gray-100 hover:text-[#0F172A] hover:shadow-none hover:scale-100"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Button>
                                    {message.status === 'unread' && (
                                        <Button
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(message.id);
                                            }}
                                            className="rounded-full bg-[#0F172A] text-white shadow-none hover:bg-[#1E293B] hover:shadow-none hover:scale-100"
                                        >
                                            Mark as Read
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(message.id);
                                        }}
                                        className="rounded-full border-rose-200 text-rose-600 shadow-none hover:bg-rose-50 hover:text-rose-700 hover:shadow-none hover:scale-100"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

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
                                <DialogContent className="sm:max-w-3xl rounded-3xl sm:rounded-3xl border-0 p-0 overflow-hidden max-h-[90vh] overflow-y-auto gap-0 shadow-xl [&>button]:hidden">
                                    <div className="rounded-t-3xl bg-[#0F172A] px-8 py-6 sticky top-0 z-10">
                                        <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
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
            </div>
        </div>
    );
}
