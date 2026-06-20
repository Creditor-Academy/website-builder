import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    MessageSquare, Bell, CheckCircle, ArrowRight, Search, X, Mail, User, Calendar,
    Clock, Filter, Trash2, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import formsApi from '@/api/forms';
import websiteApi from '@/api/website';

export default function DashboardMessages() {
    const navigate = useNavigate();
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
            case 'replied': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>Messages | Buildora</title>
            </Helmet>

            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            className="text-slate-600 hover:text-slate-900"
                        >
                            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                            Back to Dashboard
                        </Button>
                        <div className="h-8 w-px bg-slate-300" />
                        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
                    </div>
                    <p className="text-slate-600">
                        Manage contact form submissions from your website visitors. View, respond to, and organize your messages.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Messages</CardTitle>
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-slate-900">{stats.total || 0}</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-sm font-medium text-slate-600">Unread</CardTitle>
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                                <Bell className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-amber-600">{stats.unread || 0}</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-sm font-medium text-slate-600">Read</CardTitle>
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-green-600">{stats.read || 0}</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-sm font-medium text-slate-600">Replied</CardTitle>
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-purple-600">{stats.replied || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search messages by name, email, subject, or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 rounded-xl bg-white border-slate-200 shadow-sm"
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
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-600">Website</label>
                        <select
                            value={selectedWebsiteId}
                            onChange={(e) => handleWebsiteChange(e.target.value)}
                            disabled={isLoadingWebsites}
                            className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700"
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
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                                        <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                        <div className="h-3 bg-slate-100 rounded-full w-full" />
                                        <div className="h-3 bg-slate-100 rounded-full w-2/3" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredMessages.length === 0 ? (
                        <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
                            <CardContent className="p-12 text-center">
                                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                    {searchTerm ? 'No messages found' : 'No messages yet'}
                                </h3>
                                <p className="text-slate-400">
                                    {searchTerm 
                                        ? 'Try adjusting your search terms or filters' 
                                        : 'When visitors fill out your contact forms, messages will appear here'
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredMessages.map((message) => (
                            <Card 
                                key={message.id} 
                                className={cn(
                                    "cursor-pointer transition-all hover:shadow-lg border-2",
                                    message.status === 'unread' 
                                        ? 'border-amber-200 bg-amber-50/30' 
                                        : 'border-slate-200 bg-white'
                                )}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-slate-900">{message.name}</h4>
                                                <span className="text-sm text-slate-500">{message.email}</span>
                                                <div className={cn(
                                                    "px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1.5",
                                                    getStatusColor(message.status)
                                                )}>
                                                    {getStatusIcon(message.status)}
                                                    {message.status}
                                                </div>
                                            </div>
                                            {message.subject && (
                                                <p className="font-medium text-slate-700 mb-2">{message.subject}</p>
                                            )}
                                            {message.website?.name && (
                                                <p className="text-sm text-slate-500 mb-2">Website: {message.website.name}</p>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(message.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 line-clamp-2 mb-4">{message.message}</p>
                                    
                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMessage(message);
                                            }}
                                            className="rounded-full"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                        {message.status === 'unread' && (
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(message.id);
                                                }}
                                                className="rounded-full"
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
                                            className="rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
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
                                <DialogContent className="sm:max-w-3xl rounded-[2rem] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 sticky top-0 z-10">
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
                                    <div className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                                                    <User className="w-4 h-4" />
                                                    Name
                                                </label>
                                                <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg">{selectedMessage.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                                                    <Mail className="w-4 h-4" />
                                                    Email
                                                </label>
                                                <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg">{selectedMessage.email}</p>
                                            </div>
                                        </div>
                                        {selectedMessage.subject && (
                                            <div>
                                                <label className="text-sm font-medium text-slate-500 mb-2">Subject</label>
                                                <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg">{selectedMessage.subject}</p>
                                            </div>
                                        )}
                                        {selectedMessage.website?.name && (
                                            <div>
                                                <label className="text-sm font-medium text-slate-500 mb-2">Website</label>
                                                <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg">{selectedMessage.website.name}</p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm font-medium text-slate-500 mb-2">Message</label>
                                            <div className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                {selectedMessage.message}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div className="text-sm text-slate-500 flex items-center gap-2">
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
