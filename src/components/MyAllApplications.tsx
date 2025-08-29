// start of components/MyAllApplications.tsx
// src/components/MyAllApplications.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  ClipboardList,
  X,
  List,
  Grid3X3,
  RefreshCw
} from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

interface MyAllApplicationsProps {
  onNavigate: (page: string) => void;
  onViewCase: (caseId: string) => void;
}

// Type for API data
interface ApiApplication {
  tracking_code: string;
  application_type: string;
  created_at: string;
  status: 'PENDING_REVIEW' | 'PENDING_CORRECTION' | 'APPROVED' | 'REJECTED';
  full_name: string;
  applicant: {
    email: string;
    full_name: string;
  };
}

const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge className="bg-success text-success-foreground">تایید شده</Badge>;
      case 'REJECTED': return <Badge className="bg-destructive text-destructive-foreground">رد شده</Badge>;
      case 'PENDING_REVIEW': return <Badge className="bg-warning text-warning-foreground">در انتظار بررسی</Badge>;
      case 'PENDING_CORRECTION': return <Badge className="bg-primary text-primary-foreground">نیازمند اصلاح</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

export function MyAllApplications({ onNavigate, onViewCase }: MyAllApplicationsProps) {
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  useEffect(() => {
    const fetchUniversityApps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- FIX: Use the new, correctly scoped endpoint for university staff ---
        const response = await apiService.get('/v1/applications/university-apps/');
        setApplications(response.data.results || response.data);
      } catch (err) {
        setError("Could not load applications. Please try again.");
        toast.error("Failed to load application data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUniversityApps();
  }, []);

  const totalApplications = applications.length;
  const approvedCount = applications.filter(app => app.status === 'APPROVED').length;
  const pendingCount = applications.filter(app => ['PENDING_REVIEW', 'PENDING_CORRECTION'].includes(app.status)).length;
  const rejectedCount = applications.filter(app => app.status === 'REJECTED').length;

  return (
    <div className="flex-1 section-padding bg-muted/30">
        <div className="container-modern space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">کل درخواست‌ها</p><p className="text-3xl font-bold">{totalApplications}</p></div><div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center"><ClipboardList className="w-8 h-8 text-primary" /></div></div></CardContent></Card>
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">تایید شده</p><p className="text-3xl font-bold text-success">{approvedCount}</p></div><div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center"><CheckCircle className="w-8 h-8 text-success" /></div></div></CardContent></Card>
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">در انتظار بررسی</p><p className="text-3xl font-bold text-warning">{pendingCount}</p></div><div className="w-16 h-16 bg-warning-50 rounded-2xl flex items-center justify-center"><Clock className="w-8 h-8 text-warning" /></div></div></CardContent></Card>
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">رد شده</p><p className="text-3xl font-bold text-destructive">{rejectedCount}</p></div><div className="w-16 h-16 bg-destructive-50 rounded-2xl flex items-center justify-center"><X className="w-8 h-8 text-destructive" /></div></div></CardContent></Card>
            </div>
            
            <Card className="card-modern">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>همه درخواست‌ها</CardTitle>
                  <div className="flex bg-muted rounded-lg p-1">
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>کد پیگیری</TableHead><TableHead>نام متقاضی</TableHead><TableHead>نوع درخواست</TableHead><TableHead>تاریخ ثبت</TableHead><TableHead>وضعیت</TableHead><TableHead className="text-center">عملیات</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto" /></TableCell></TableRow>
                        : error ? <TableRow><TableCell colSpan={6} className="text-center py-10 text-destructive">{error}</TableCell></TableRow>
                        : applications.map((app) => (
                          <TableRow key={app.tracking_code}>
                            <TableCell className="font-mono text-primary">{app.tracking_code}</TableCell>
                            <TableCell><div className="flex items-center space-x-3 space-x-reverse"><Avatar className="w-8 h-8"><AvatarFallback>{(app.full_name || 'U').split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar><span>{app.full_name || app.applicant.full_name}</span></div></TableCell>
                            <TableCell>{app.application_type}</TableCell>
                            <TableCell>{formatDate(app.created_at)}</TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                            <TableCell className="text-center">
                              <Button size="sm" variant="outline" onClick={() => onViewCase(app.tracking_code)}><Eye className="w-4 h-4 ml-2" />مشاهده</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
              </CardContent>
            </Card>
        </div>
    </div>
  );
}
// end of components/MyAllApplications.tsx