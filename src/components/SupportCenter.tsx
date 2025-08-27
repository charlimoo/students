// start of components/SupportCenter.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { 
  HelpCircle, 
  Paperclip, 
  Send, 
  Eye, 
  CheckCircle, 
  Upload,
  MessageSquare,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '../api/apiService';

interface SupportCenterProps {
  onBack: () => void;
  onViewTicket: (ticketId: string) => void;
  initialTab?: string;
}

// --- Type Definitions for API Data ---
interface ApiTicket {
  ticket_id: string;
  subject: string;
  category: string;
  updated_at: string;
  status: 'OPEN' | 'AWAITING_REPLY' | 'CLOSED';
}

interface ApiTicketDetail extends ApiTicket {
  // Can be extended if more detail is needed
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'OPEN': return <Badge className="status-badge-review">Open</Badge>;
    case 'CLOSED': return <Badge className="status-badge-approved">Closed</Badge>;
    case 'AWAITING_REPLY': return <Badge className="status-badge-pending">Awaiting Your Reply</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function SupportCenter({ onBack, onViewTicket, initialTab }: SupportCenterProps) {
  const [activeTab, setActiveTab] = useState(initialTab || 'submit');
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({ category: '', subject: '', description: '', attachments: null as File | null });
  const [newTicketId, setNewTicketId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await apiService.get('/v1/support/tickets/');
        setTickets(response.data.results || response.data);
    } catch (err) {
        setError("Could not load your support tickets. Please try again later.");
        toast.error("Failed to load tickets.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-tickets') {
        fetchTickets();
    }
  }, [activeTab]);

  const handleFormChange = (field: string, value: string) => setTicketForm(prev => ({ ...prev, [field]: value }));
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setTicketForm(prev => ({ ...prev, attachments: file }));
  };

  const removeAttachment = () => {
    setTicketForm(prev => ({ ...prev, attachments: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitTicket = async () => {
    if (!ticketForm.category || !ticketForm.subject || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const payload = new FormData();
    payload.append('subject', ticketForm.subject);
    payload.append('category', ticketForm.category);
    payload.append('message', ticketForm.description);
    if (ticketForm.attachments) {
        payload.append('attachment', ticketForm.attachments);
    }
    
    try {
        const response = await apiService.post('/v1/support/tickets/', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        setNewTicketId(response.data.ticket_id);
        setTicketForm({ category: '', subject: '', description: '', attachments: null });
        removeAttachment();
        setShowSuccessDialog(true);
        toast.success('Support ticket submitted successfully!');
    } catch (error) {
        toast.error('Submission Failed', { description: 'Could not submit your ticket. Please try again.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container-modern py-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
            <p className="text-muted-foreground">Get help with your questions and technical issues</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card border rounded-lg p-1">
            <TabsTrigger value="submit">Submit New Ticket</TabsTrigger>
            <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="animate-fade-in">
            <Card className="card-modern">
                <CardHeader><CardTitle>Submit a New Support Ticket</CardTitle></CardHeader>
                <CardContent className="space-y-6 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3"><Label htmlFor="category">Category *</Label><Select value={ticketForm.category} onValueChange={(v) => handleFormChange('category', v)}><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent><SelectItem value="Technical Issue">Technical Issue</SelectItem><SelectItem value="Application Question">Application Question</SelectItem><SelectItem value="Financial Inquiry">Financial Inquiry</SelectItem><SelectItem value="General">General Inquiry</SelectItem></SelectContent></Select></div>
                        <div className="space-y-3"><Label htmlFor="subject">Subject *</Label><Input id="subject" value={ticketForm.subject} onChange={(e) => handleFormChange('subject', e.target.value)} /></div>
                    </div>
                    <div className="space-y-3"><Label htmlFor="description">Description *</Label><Textarea id="description" value={ticketForm.description} onChange={(e) => handleFormChange('description', e.target.value)} className="min-h-[120px]" /></div>
                    <div className="space-y-3"><Label htmlFor="attachments">Attachment</Label>
                        <div className="border-2 border-dashed rounded-xl p-6 text-center"><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Choose File</Button><input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
                            {ticketForm.attachments && (<div className="flex items-center justify-center mt-3 p-3 bg-muted/50 rounded-lg"><Paperclip className="w-4 h-4" /><span>{ticketForm.attachments.name}</span><Button type="button" variant="ghost" size="sm" onClick={removeAttachment}><Trash2 className="w-4 h-4" /></Button></div>)}
                        </div>
                    </div>
                    <div className="pt-6 border-t"><Button onClick={handleSubmitTicket} disabled={isSubmitting}>{isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}Submit Ticket</Button></div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-tickets">
            <Card className="card-modern">
              <CardHeader><CardTitle>My Support Tickets</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Ticket ID</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Last Updated</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto" /></TableCell></TableRow>
                        : error ? <TableRow><TableCell colSpan={6} className="text-center py-10 text-destructive">{error}</TableCell></TableRow>
                        : tickets.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-10">You have no support tickets.</TableCell></TableRow>
                        : tickets.map((ticket) => (
                        <TableRow key={ticket.ticket_id}>
                          <TableCell className="font-mono">{ticket.ticket_id}</TableCell>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>{formatDate(ticket.updated_at)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => onViewTicket(ticket.ticket_id)}><Eye className="w-4 h-4 mr-1" /> View</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center"><div className="mx-auto w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mb-6"><CheckCircle className="w-8 h-8 text-success" /></div><DialogTitle>Ticket Submitted!</DialogTitle><DialogDescription>Your ticket ID is <strong className="text-foreground">{newTicketId}</strong>.</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button onClick={() => { setShowSuccessDialog(false); onViewTicket(newTicketId); }}>View Ticket</Button>
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>Submit Another</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// end of components/SupportCenter.tsx