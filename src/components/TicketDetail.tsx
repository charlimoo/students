// start of components/TicketDetail.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Paperclip, Send, User, RefreshCw, ArrowLeft, Trash2 } from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

interface TicketDetailProps {
  ticketId: string | null;
  onBack: () => void;
}

// --- Type Definitions for API Data ---
interface ApiUser {
    full_name: string;
}
interface ApiMessage {
    id: number;
    sender: ApiUser;
    message: string;
    attachment: string | null;
    timestamp: string;
}
interface ApiTicketDetail {
    ticket_id: string;
    subject: string;
    status: 'OPEN' | 'AWAITING_REPLY' | 'CLOSED';
    created_at: string;
    updated_at: string;
    category: string;
    user: ApiUser;
    messages: ApiMessage[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <Badge className="status-badge-review">Open</Badge>;
      case 'CLOSED': return <Badge className="status-badge-approved">Closed</Badge>;
      case 'AWAITING_REPLY': return <Badge className="status-badge-pending">Awaiting Your Reply</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
};

const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatFileSize = (bytes: number) => { /* ... as in previous component ... */ return `${bytes} B`; };


export function TicketDetail({ ticketId, onBack }: TicketDetailProps) {
  const [ticketData, setTicketData] = useState<ApiTicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTicketDetail = async () => {
      if (!ticketId) return;
      setError(null);
      try {
          const response = await apiService.get(`/v1/support/tickets/${ticketId}/`);
          setTicketData(response.data);
      } catch (err) {
          setError("Could not load ticket details.");
          toast.error("Failed to load ticket details.");
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTicketDetail();
  }, [ticketId]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !ticketId) return;

    setIsReplying(true);
    const payload = new FormData();
    payload.append('message', replyText);
    if (attachment) {
        payload.append('attachment', attachment);
    }
    
    try {
        await apiService.post(`/v1/support/tickets/${ticketId}/messages/`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Reply sent successfully!");
        setReplyText('');
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchTicketDetail(); // Refresh conversation
    } catch (error) {
        toast.error("Failed to send reply.");
    } finally {
        setIsReplying(false);
    }
  };

  if (isLoading) return <div className="flex h-screen w-full items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  if (error || !ticketData) return <div className="p-8 text-center text-destructive">{error || "Ticket not found."}</div>;

  return (
    <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
            <Button onClick={onBack} variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to All Tickets</Button>
            
            <Card className="card-modern">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">{ticketData.subject}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Ticket ID: {ticketData.ticket_id}</p>
                        </div>
                        {getStatusBadge(ticketData.status)}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {ticketData.messages.map((message) => (
                            <div key={message.id} className="flex space-x-4">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">{message.sender.full_name.charAt(0)}</div>
                                <div className="flex-1">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="font-semibold">{message.sender.full_name}</span>
                                        <span className="text-xs text-muted-foreground">{formatDateTime(message.timestamp)}</span>
                                    </div>
                                    <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">{message.message}</div>
                                    {message.attachment && <a href={message.attachment} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center text-sm text-primary"><Paperclip className="w-4 h-4 mr-1"/>{message.attachment.split('/').pop()}</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="card-modern">
                <CardHeader><CardTitle>Send a Reply</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Textarea placeholder="Type your reply here..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="min-h-[120px]" />
                        <input ref={fileInputRef} type="file" onChange={e => setAttachment(e.target.files?.[0] || null)} className="hidden"/>
                        {attachment && <div className="flex items-center p-3 bg-muted/50 rounded-lg"><Paperclip className="w-4 h-4" /><span>{attachment.name}</span><Button variant="ghost" size="sm" onClick={() => { setAttachment(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}><Trash2 className="w-4 h-4" /></Button></div>}
                        <div className="flex items-center justify-between">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Paperclip className="w-4 h-4 mr-2" />Attach File</Button>
                            <Button onClick={handleSendReply} disabled={isReplying || !replyText.trim()}>{isReplying ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4 mr-2" />}Send Reply</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
// end of components/TicketDetail.tsx