// start of components/MyApplicants.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Eye,
  RefreshCw
} from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

interface MyApplicantsProps {
  onBack: () => void;
  onViewApplication: (applicationId: string) => void;
}

interface ApiApplication {
    tracking_code: string;
    full_name: string;
    applicant: { email: string };
    country_of_residence: string;
    application_type: string;
    created_at: string;
    status: 'PENDING_REVIEW' | 'PENDING_CORRECTION' | 'APPROVED' | 'REJECTED';
}

const statusOptions = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'APPROVED', label: 'تایید شده' },
  { value: 'PENDING_REVIEW', label: 'در حال بررسی' },
  { value: 'PENDING_CORRECTION', label: 'نیازمند اصلاح' },
  { value: 'REJECTED', label: 'رد شده' }
];

export function MyApplicants({ onBack, onViewApplication }: MyApplicantsProps) {
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [filteredApps, setFilteredApps] = useState<ApiApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
        const response = await apiService.get('/v1/applications/my-submitted/');
        const appData = response.data.results || response.data;
        setApplications(appData);
        setFilteredApps(appData);
    } catch (error) {
        toast.error("Failed to load applicant list.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    let result = applications;
    if (statusFilter !== 'all') {
        result = result.filter(app => app.status === statusFilter);
    }
    if (searchTerm) {
        result = result.filter(app => 
            app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            app.tracking_code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    setFilteredApps(result);
  }, [searchTerm, statusFilter, applications]);

  const getStatusBadge = (status: string) => {
    if (status === 'APPROVED') return <Badge className="status-badge-approved">تایید شده</Badge>;
    if (status === 'PENDING_REVIEW') return <Badge className="status-badge-review">در حال بررسی</Badge>;
    if (status === 'PENDING_CORRECTION') return <Badge className="status-badge-pending">نیازمند اصلاح</Badge>;
    if (status === 'REJECTED') return <Badge className="status-badge-rejected">رد شده</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="flex-1 overflow-auto p-8" dir="rtl">
        <div className="mb-8">
            <h1 className="text-3xl text-foreground persian-heading">همه متقاضیان ثبت شده</h1>
            <p className="text-muted-foreground">مدیریت و بررسی درخواست‌های دانشجویان ثبت شده توسط موسسه شما</p>
        </div>

        <Card className="card-modern mb-8">
          <CardHeader><CardTitle>فیلتر و جستجو</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>فیلتر بر اساس وضعیت</Label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>جستجو بر اساس نام یا کد رهگیری</Label><Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="جستجو..." /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader><div className="flex justify-between items-center"><CardTitle>لیست متقاضیان ({filteredApps.length})</CardTitle><Button variant="outline" size="sm" onClick={fetchApplicants} disabled={isLoading}><RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} /> بروزرسانی</Button></div></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table><TableHeader><TableRow><TableHead>نام دانشجو</TableHead><TableHead>ملیت</TableHead><TableHead>نوع درخواست</TableHead><TableHead>تاریخ ثبت</TableHead><TableHead>وضعیت</TableHead><TableHead>عملیات</TableHead></TableRow></TableHeader>
                <TableBody>
                  {isLoading ? <TableRow><TableCell colSpan={6} className="text-center p-8"><RefreshCw className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow> 
                  : filteredApps.map((applicant) => (
                    <TableRow key={applicant.tracking_code}>
                      <TableCell><div className="font-medium">{applicant.full_name}</div><div className="text-sm text-muted-foreground">{applicant.applicant.email}</div></TableCell>
                      <TableCell>{applicant.country_of_residence}</TableCell>
                      <TableCell>{applicant.application_type}</TableCell>
                      <TableCell>{formatDate(applicant.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                      <TableCell><Button variant="outline" size="sm" onClick={() => onViewApplication(applicant.tracking_code)}><Eye className="w-4 h-4 ml-2" />مشاهده جزئیات</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}