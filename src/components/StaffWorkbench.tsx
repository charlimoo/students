import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Eye, Clock, FileCheck, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

interface StaffWorkbenchProps {
  onNavigate: (page: string) => void;
  onViewCase: (caseId: string) => void;
}

// Type for data from the /workbench/ endpoint
interface ApiWorkbenchApplication {
  tracking_code: string;
  full_name: string;
  created_at: string;
  status: 'PENDING_REVIEW' | 'PENDING_CORRECTION'; // Workbench typically shows actionable items
  // Add other relevant fields if the API provides them
  country_of_residence: string; 
}

// Status mapping for badges
const statusMap: { [key: string]: { label: string; badge: React.ReactNode } } = {
  PENDING_REVIEW: { label: 'جدید', badge: <Badge className="status-badge-review">جدید</Badge> },
  PENDING_CORRECTION: { label: 'دارای نقص', badge: <Badge className="status-badge-rejected">دارای نقص</Badge> },
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

export function StaffWorkbench({ onNavigate, onViewCase }: StaffWorkbenchProps) {
  const [applications, setApplications] = useState<ApiWorkbenchApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkbenchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.get('/v1/applications/workbench/');
        setApplications(response.data.results || response.data);
      } catch (err) {
        setError("Could not load workbench data. Please try again.");
        toast.error("Failed to load workbench.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkbenchData();
  }, []);

  const urgentCount = applications.filter(app => app.status === 'PENDING_CORRECTION').length;
  const newCount = applications.filter(app => app.status === 'PENDING_REVIEW').length;

  return (
    <div className="flex-1 section-padding bg-muted/30">
      <div className="container-modern space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">پرونده‌های فعال در کارتابل</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg"><FileCheck className="w-6 h-6 text-primary" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">نیاز به اقدام فوری</p>
                  <p className="text-3xl font-bold text-destructive">{urgentCount}</p>
                </div>
                <div className="p-3 bg-destructive-50 rounded-lg"><AlertCircle className="w-6 h-6 text-destructive" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="card-modern">
          <CardHeader className="border-b"><CardTitle className="text-xl">فهرست درخواست‌ها</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-right">نام دانشجو</TableHead>
                    <TableHead className="font-semibold text-right">کد رهگیری</TableHead>
                    <TableHead className="font-semibold text-right">تاریخ ثبت</TableHead>
                    <TableHead className="font-semibold text-right">وضعیت</TableHead>
                    <TableHead className="text-right font-semibold">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow><TableCell colSpan={5} className="text-center py-12"><RefreshCw className="w-8 h-8 mx-auto animate-spin" /></TableCell></TableRow>
                  : error ? <TableRow><TableCell colSpan={5} className="text-center py-12 text-destructive">{error}</TableCell></TableRow>
                  : applications.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-12">هیچ پرونده فعالی در کارتابل شما وجود ندارد.</TableCell></TableRow>
                  : applications.map((app) => (
                    <TableRow key={app.tracking_code}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Avatar className="w-8 h-8"><AvatarFallback>{app.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                          <span>{app.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{app.tracking_code}</TableCell>
                      <TableCell>{formatDate(app.created_at)}</TableCell>
                      <TableCell>{statusMap[app.status]?.badge || <Badge variant="secondary">{app.status}</Badge>}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => onViewCase(app.tracking_code)} className="flex items-center space-x-1 space-x-reverse">
                          <Eye className="w-4 h-4" /><span>مشاهده</span>
                        </Button>
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