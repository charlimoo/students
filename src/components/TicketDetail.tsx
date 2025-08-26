import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Paperclip, Send, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TicketDetailProps {
  ticketId: string | null;
  onBack: () => void;
}

export function TicketDetail({ ticketId, onBack }: TicketDetailProps) {
  const [replyText, setReplyText] = useState('');

  const ticketData = {
    id: 'TKT-001',
    subject: 'Unable to upload documents',
    status: 'in-progress',
    createdDate: '2024-02-20',
    lastUpdate: '2024-02-22',
    priority: 'medium',
    category: 'Technical',
    student: { name: 'Aylin Yılmaz', studentId: 'STU-2024-001' },
    conversation: [
      { id: 1, sender: 'student', senderName: 'Aylin Yılmaz', timestamp: '2024-02-20 14:30', message: 'Hello,\n\nI am trying to upload my academic documents, but I keep receiving a "File format not supported" error.\n\nMy file is a PDF and is 2MB in size. Is there an issue with the system? Please advise.\n\nThanks,' },
      { id: 2, sender: 'staff', senderName: 'John Doe - Tech Support', timestamp: '2024-02-21 09:15', message: 'Hello Aylin,\n\nWe received your message. This issue is often caused by browser settings or cached data. Please try the following steps:\n\n1. Clear your browser cache\n2. Use Chrome or Firefox\n3. Ensure the filename does not contain special characters\n\nIf the issue persists, please send us the file directly so we can investigate.\n\nBest regards,' },
      { id: 3, sender: 'student', senderName: 'Aylin Yılmaz', timestamp: '2024-02-22 16:45', message: 'Hi,\n\nThank you for the guidance. Unfortunately, after trying all the suggested steps, I am still facing the same error.\n\nI have attached the file for your review.\n\nAttachment: degree_certificate.pdf', attachments: [{ name: 'degree_certificate.pdf', size: '1.8 MB' }] }
    ]
  };

  const getStatusBadge = () => {
    switch (ticketData.status) {
      case 'open': return <Badge className="status-badge-pending">Open</Badge>;
      case 'in-progress': return <Badge className="status-badge-review">In Progress</Badge>;
      case 'resolved': return <Badge className="status-badge-approved">Resolved</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  return (
    <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="space-y-6">
                <Card className="card-modern">
                    <CardHeader>
                        <CardTitle className="text-lg">Ticket Details: {ticketData.subject}</CardTitle>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Ticket ID: {ticketData.id}</span>
                            <span>Created: {new Date(ticketData.createdDate).toLocaleDateString()}</span>
                            <span>Status: {getStatusBadge()}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {ticketData.conversation.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-[80%]">
                                        <div className={`flex items-center space-x-2 mb-2 ${message.sender === 'student' ? 'justify-end' : ''}`}>
                                            <span className="text-sm font-semibold">{message.senderName}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(message.timestamp.split(' ')[0]).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`rounded-lg p-4 ${message.sender === 'student' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p className="leading-relaxed whitespace-pre-line">{message.message}</p>
                                        </div>
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
                            <div className="flex items-center justify-between">
                                <Button variant="outline"><Paperclip className="w-4 h-4 mr-2" />Attach File</Button>
                                <Button onClick={handleSendReply} disabled={!replyText.trim()}><Send className="w-4 h-4 mr-2" />Send Reply</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}