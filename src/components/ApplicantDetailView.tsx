// start of components/ApplicantDetailView.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowRight, User, GraduationCap, FileText, Download, Building, Phone, Mail, Globe, RefreshCw } from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

interface ApplicantDetailViewProps {
  applicantId: string | null; // This will be the application tracking_code
  onBack: () => void;
}

// Type matching the backend's ApplicationDetailSerializer
interface ApiApplicationDetail {
  tracking_code: string;
  status: string;
  full_name: string;
  country_of_residence: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  university_choices: { priority: number; university: { name: string }; program: { name: string }; }[];
  academic_histories: { degree_level: string; university_name: string; gpa: string; }[];
  documents: { document_type: string; file: string; }[];
}

const getStatusBadge = (status: string) => {
    if (status === 'APPROVED') return <Badge className="status-badge-approved">تایید شده</Badge>;
    if (status === 'PENDING_REVIEW') return <Badge className="status-badge-review">در حال بررسی</Badge>;
    if (status === 'PENDING_CORRECTION') return <Badge className="status-badge-pending">نیازمند اصلاح</Badge>;
    if (status === 'REJECTED') return <Badge className="status-badge-rejected">رد شده</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

export function ApplicantDetailView({ applicantId, onBack }: ApplicantDetailViewProps) {
  const [application, setApplication] = useState<ApiApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!applicantId) {
        setIsLoading(false);
        return;
    }
    const fetchApplication = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.get(`/v1/applications/${applicantId}/`);
            setApplication(response.data);
        } catch (error) {
            toast.error("Failed to load applicant details.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchApplication();
  }, [applicantId]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center p-8"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  if (!application) {
    return <div className="p-8 text-center">Applicant not found.</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-8" dir="rtl">
        <button onClick={onBack} className="flex items-center space-x-2 space-x-reverse text-primary hover:underline mb-6">
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به لیست متقاضیان</span>
        </button>
      
        <div >
            <div className="lg:col-span-2 space-y-6">


                <Card className="card-modern">
                    <CardHeader><CardTitle className="flex items-center">خلاصه درخواست</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <p>نام کامل: </p><strong>{application.full_name}</strong>
                        <div><strong className="text-muted-foreground">تاریخ تولد:</strong> {formatDate(application.date_of_birth)}</div>
                        <div><strong className="text-muted-foreground">وضعیت:</strong> {getStatusBadge(application.status)}</div>
                    </CardContent>
                </Card>
                <Card className="card-modern">
                    <CardHeader><CardTitle className="flex items-center"><Building className="w-5 h-5 ml-2"/>دانشگاه‌های انتخابی</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {application.university_choices.sort((a,b) => a.priority - b.priority).map(choice => (
                            <div key={choice.priority} className="p-3 border rounded-lg">
                                <strong>اولویت {choice.priority}:</strong> {choice.university.name} - {choice.program.name}
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card className="card-modern">
                    <CardHeader><CardTitle className="flex items-center"><GraduationCap className="w-5 h-5 ml-2"/>سوابق تحصیلی</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {application.academic_histories.map((history, i) => (
                             <div key={i} className="p-3 border rounded-lg">
                                <strong>{history.degree_level}:</strong> {history.university_name} (معدل: {history.gpa})
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="card-modern">
                    <CardHeader><CardTitle className="flex items-center"><FileText className="w-5 h-5 ml-2"/>مدارک</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {application.documents.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <span>{doc.document_type}</span>
                                <a href={doc.file} target="_blank" rel="noreferrer"><Button variant="outline" size="sm"><Download className="w-4 h-4 ml-2"/>دانلود</Button></a>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}