// start of components/ApplicationStatus.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  ArrowLeft, User, GraduationCap, FileText, Clock, CheckCircle, AlertCircle, XCircle,
  Building, MessageSquare, RefreshCw, Edit
} from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

interface ApplicationStatusProps {
  applicationId: string | null;
  onBack: () => void;
  onNavigate: (page: string, id?: string) => void;
}
// Type Definition for API Data
interface ApiApplicationDetail {
  tracking_code: string;
  status: 'PENDING_REVIEW' | 'PENDING_CORRECTION' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
  full_name: string;
  date_of_birth: string;
  country_of_residence: string;
  email: string;
  academic_histories: { id: number; degree_level: string; university_name: string; field_of_study: string; }[];
  university_choices: { id: number; university: { name: string }; program: { name: string }; priority: number; }[];
  documents: { id: number; document_type: string; file: string; }[];
  logs: { id: number; actor: { full_name: string } | null; action: string; comment: string | null; timestamp: string; }[];
}

// Helper Maps for Status Display
const statusMap: { [key: string]: { label: string; badge: React.ReactNode; icon: React.ReactNode } } = {
  APPROVED: { label: 'Approved', badge: <Badge className="bg-success text-success-foreground">Approved</Badge>, icon: <CheckCircle className="w-5 h-5 text-success" /> },
  REJECTED: { label: 'Rejected', badge: <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>, icon: <XCircle className="w-5 h-5 text-destructive" /> },
  PENDING_REVIEW: { label: 'Under Review', badge: <Badge className="bg-primary text-primary-foreground">Under Review</Badge>, icon: <Clock className="w-5 h-5 text-primary" /> },
  PENDING_CORRECTION: { label: 'Requires Action', badge: <Badge className="bg-warning text-warning-foreground">Requires Action</Badge>, icon: <AlertCircle className="w-5 h-5 text-warning" /> },
};

// Helper Functions
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const formatDateTime = (dateTimeString: string) => new Date(dateTimeString).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export function ApplicationStatus({ applicationId, onBack, onNavigate }: ApplicationStatusProps) {
  const [application, setApplication] = useState<ApiApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setError("No application ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchApplication = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.get(`/v1/applications/${applicationId}/`);
        setApplication(response.data);
      } catch (err) {
        setError("Could not load application details. Please try again later.");
        toast.error("Failed to load application details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || "Application Not Found"}</h2>
          <Button onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Back to My Applications</Button>
        </div>
      </div>
    );
  }

  const currentStatus = statusMap[application.status] || { label: application.status, badge: <Badge variant="secondary">{application.status}</Badge>, icon: <Clock className="w-5 h-5 text-muted-foreground" /> };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container-modern py-8 space-y-8">
        <div className="flex items-center justify-between">
            <Button onClick={onBack} variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to My Applications</Button>
            {application.status === 'PENDING_CORRECTION' && (
                <Button 
                  onClick={() => onNavigate('new-admission-application', application.tracking_code)}
                  className="bg-warning text-warning-foreground hover:bg-warning/90"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit & Resubmit Application
                </Button>
            )}
        </div>
        <Card className="card-modern">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-1 text-left">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-foreground">Application Status</h1>
                            {currentStatus.badge}
                        </div>
                        <p className="text-muted-foreground">Tracking ID: {application.tracking_code}</p>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <div className="text-right flex-1"><p className="text-sm text-muted-foreground">Submitted</p><p className="font-medium">{formatDate(application.created_at)}</p></div>
                        <div className="text-right flex-1"><p className="text-sm text-muted-foreground">Last Update</p><p className="font-medium">{formatDate(application.updated_at)}</p></div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="space-y-6">
            <Card><CardHeader><CardTitle className="flex items-center space-x-2"><User className="w-5 h-5 text-primary"/><span>Personal Information</span></CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><strong className="text-muted-foreground">Full Name:</strong> {application.full_name}</div><div><strong className="text-muted-foreground">Date of Birth:</strong> {formatDate(application.date_of_birth)}</div><div><strong className="text-muted-foreground">Country of Residence:</strong> {application.country_of_residence}</div><div><strong className="text-muted-foreground">Email:</strong> {application.email}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center space-x-2"><GraduationCap className="w-5 h-5 text-primary"/><span>Academic History</span></CardTitle></CardHeader><CardContent className="space-y-4">{application.academic_histories.map((item) => <div key={item.id} className="p-3 bg-muted/50 rounded-lg text-sm"><strong>{item.degree_level} in {item.field_of_study}</strong> from {item.university_name}</div>)}</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center space-x-2"><Building className="w-5 h-5 text-primary"/><span>University Programs</span></CardTitle></CardHeader><CardContent className="space-y-4">{application.university_choices.sort((a,b) => a.priority - b.priority).map(p => <div key={p.id} className="p-3 bg-muted/50 rounded-lg text-sm"><strong>Priority {p.priority}:</strong> {p.university.name} - {p.program.name}</div>)}</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center space-x-2"><FileText className="w-5 h-5 text-primary"/><span>Submitted Documents</span></CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {application.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="font-medium">{doc.document_type}</div>
                            {/* --- FIX START: Wrap Button in an anchor tag --- */}
                            <a href={doc.file} target="_blank" rel="noreferrer">
                                <Button variant="outline" size="sm" disabled={!doc.file}>
                                    View Document
                                </Button>
                            </a>
                            {/* --- FIX END --- */}
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><MessageSquare className="w-5 h-5 text-primary"/><span>Application History</span></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4">
                    <div className="mt-1">{statusMap[application.status]?.icon || <Clock className="w-5 h-5 text-muted-foreground" />}</div>
                    <div className="flex-1">
                      <strong>{log.action}</strong> by {log.actor?.full_name || 'System'}
                      <div className="text-xs text-muted-foreground">{formatDateTime(log.timestamp)}</div>
                      
                      {log.comment && (
                        <div className="mt-2 p-3 border-l-4 border-warning bg-warning/5 rounded-r-lg">
                          <p className="text-sm font-semibold text-warning-foreground">Note from Reviewer:</p>
                          <p className="text-sm text-warning-foreground whitespace-pre-wrap">{log.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
// end of components/ApplicationStatus.tsx