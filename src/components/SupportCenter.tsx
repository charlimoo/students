//
//  nouvel-Lime-Sour-Jaguar
//
// 1. START of components/SupportCenter.tsx (Full Replacement)

import React, { useState, useRef } from 'react';
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
  Clock,
  AlertCircle,
  FileText,
  Zap,
  CreditCard,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface SupportCenterProps {
  onBack: () => void;
  onViewTicket: (ticketId: string) => void;
  initialTab?: string;
}

const mockTickets = [
  { id: 'TKT-001', subject: 'Unable to upload documents', category: 'Technical Issue', lastUpdated: '2024-02-26', status: 'open' },
  { id: 'TKT-002', subject: 'Question about visa extension timeline', category: 'Application Question', lastUpdated: '2024-02-25', status: 'awaiting-reply' },
  { id: 'TKT-003', subject: 'Payment processing issue', category: 'Financial Inquiry', lastUpdated: '2024-02-24', status: 'closed' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open': return <Badge className="status-badge-review">Open</Badge>;
    case 'closed': return <Badge className="status-badge-approved">Closed</Badge>;
    case 'awaiting-reply': return <Badge className="status-badge-pending">Awaiting Your Reply</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'technical-issue': return <Zap className="w-5 h-5 text-destructive" />;
    case 'application-question': return <FileText className="w-5 h-5 text-primary" />;
    case 'financial-inquiry': return <CreditCard className="w-5 h-5 text-warning" />;
    default: return <HelpCircle className="w-5 h-5 text-muted-foreground" />;
  }
};

export function SupportCenter({ onBack, onViewTicket, initialTab }: SupportCenterProps) {
  const [activeTab, setActiveTab] = useState(initialTab || 'submit');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [ticketForm, setTicketForm] = useState({ category: '', subject: '', description: '', attachments: [] as File[] });
  const [newTicketId, setNewTicketId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormChange = (field: string, value: string) => setTicketForm(prev => ({ ...prev, [field]: value }));
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setTicketForm(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };
  const removeAttachment = (index: number) => setTicketForm(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));

  const handleSubmitTicket = () => {
    if (!ticketForm.category || !ticketForm.subject || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    const ticketId = `TKT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setNewTicketId(ticketId);
    setTicketForm({ category: '', subject: '', description: '', attachments: [] });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowSuccessDialog(true);
    toast.success('Support ticket submitted successfully!');
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <TabsTrigger value="submit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Submit New Ticket</TabsTrigger>
            <TabsTrigger value="my-tickets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">My Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="card-modern">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="flex items-center space-x-2"><MessageSquare className="w-5 h-5 text-primary" /><span>Submit a New Support Ticket</span></CardTitle>
                    <p className="text-muted-foreground">Describe your issue in detail and our support team will assist you promptly.</p>
                  </CardHeader>
                  <CardContent className="space-y-6 p-8">
                    <div className="space-y-3"><Label htmlFor="category">Category *</Label><Select value={ticketForm.category} onValueChange={(v) => handleFormChange('category', v)}><SelectTrigger className="input-modern"><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent><SelectItem value="technical-issue">Technical Issue</SelectItem><SelectItem value="application-question">Application Question</SelectItem><SelectItem value="financial-inquiry">Financial Inquiry</SelectItem></SelectContent></Select></div>
                    <div className="space-y-3"><Label htmlFor="subject">Subject *</Label><Input id="subject" placeholder="Brief description of your issue" value={ticketForm.subject} onChange={(e) => handleFormChange('subject', e.target.value)} className="input-modern" /></div>
                    <div className="space-y-3"><Label htmlFor="description">Description *</Label><Textarea id="description" placeholder="Provide a detailed description of your issue..." value={ticketForm.description} onChange={(e) => handleFormChange('description', e.target.value)} className="input-modern min-h-[120px]" /></div>
                    <div className="space-y-3">
                      <Label htmlFor="attachments">Attachments</Label>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50"><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Choose Files</Button><input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" /><p className="text-sm text-muted-foreground mt-2">Max 10MB each</p></div>
                        {ticketForm.attachments.length > 0 && (<div className="space-y-2">{ticketForm.attachments.map((file, index) => (<div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"><div className="flex items-center space-x-3"><Paperclip className="w-4 h-4" /><div><p className="font-medium">{file.name}</p><p className="text-xs">{formatFileSize(file.size)}</p></div></div><Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}><Trash2 className="w-4 h-4" /></Button></div>))}</div>)}
                      </div>
                    </div>
                    <div className="pt-6 border-t"><Button onClick={handleSubmitTicket} className="button-primary"><Send className="w-4 h-4 mr-2" />Submit Ticket</Button></div>
                  </CardContent>
                </Card>
              </div>

              {/* FIX: Restored the helpful sidebar cards */}
              <div className="space-y-6">
                <Card className="card-modern">
                  <CardHeader><CardTitle className="text-lg">Need Quick Help?</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                        <div className="font-medium">Common Issues</div>
                        <div className="text-sm text-muted-foreground">Password reset, login problems</div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                        <div className="font-medium">Application Guide</div>
                        <div className="text-sm text-muted-foreground">Step-by-step instructions</div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                        <div className="font-medium">Contact Info</div>
                        <div className="text-sm text-muted-foreground">Phone and email support</div>
                      </button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-modern border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <Clock className="w-8 h-8 text-primary mx-auto" />
                      <h3 className="font-semibold">Fast Response</h3>
                      <p className="text-sm text-muted-foreground">Our support team typically responds within 2 hours during business hours.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-tickets">
            <Card className="card-modern">
              <CardHeader><CardTitle>My Support Tickets</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Ticket ID</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Last Updated</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {mockTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono">{ticket.id}</TableCell>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>{formatDate(ticket.lastUpdated)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => onViewTicket(ticket.id)}><Eye className="w-4 h-4 mr-1" /> View</Button></TableCell>
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
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mb-6"><CheckCircle className="w-8 h-8 text-success" /></div>
            <DialogTitle className="text-xl">Ticket Submitted Successfully!</DialogTitle>
            <DialogDescription className="space-y-3">
              <p>Your support ticket has been created with ID: <strong className="text-foreground">{newTicketId}</strong></p>
              <p>You can track the status in the "My Tickets" tab.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button onClick={() => { setShowSuccessDialog(false); setActiveTab('my-tickets'); }} className="w-full">View My Tickets</Button>
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)} className="w-full">Submit Another Ticket</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// 1. END of components/SupportCenter.tsx (Full Replacement)