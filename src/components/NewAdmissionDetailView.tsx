// src/components/NewAdmissionDetailView.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import {
  ArrowRight,
  User,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  Send,
  MessageSquare,
  RefreshCw,
  Building,
  Download,
  University
} from 'lucide-react';
import apiService from '../api/apiService';
import { useAuth } from '../context/AuthContext';

// --- (Type Definitions are unchanged) ---
interface ApiActor { id: number; email: string; full_name: string; }
interface ApiUniversity { id: number; name: string; }
interface ApiProgram { id: number; name: string; }
interface ApiLog { id: number; actor: ApiActor | null; action: string; comment: string | null; timestamp: string; }
interface ApiTask { id: number; university: ApiUniversity; status: 'UNCLAIMED' | 'ASSIGNED' | 'COMPLETED'; decision: 'PENDING' | 'APPROVED' | 'REJECTED'; }
interface ApiInternalNote { id: number; author: ApiActor | null; message: string; timestamp: string; }
interface ApiApplicationDetail {
  tracking_code: string;
  full_name: string;
  status: 'PENDING_REVIEW' | 'PENDING_CORRECTION' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
  date_of_birth: string;
  country_of_residence: string;
  father_name: string;
  grandfather_name?: string;
  email: string;
  applicant: { id: number; email: string; full_name: string; };
  academic_histories: { id: number; degree_level: string; country: string; university_name: string; field_of_study: string; gpa: string; }[];
  university_choices: { id: number; university: ApiUniversity; program: ApiProgram; priority: number; }[];
  documents: { id: number; document_type: string; file: string | null; }[];
  logs: ApiLog[];
  tasks: ApiTask[];
  internal_notes: ApiInternalNote[]; 
}

interface NewAdmissionDetailViewProps {
  applicationId: string;
  onBack: () => void;
  backLabel?: string;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
const formatDateTime = (dateTimeString: string) => new Date(dateTimeString).toLocaleString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export function NewAdmissionDetailView({ applicationId, onBack, backLabel = "بازگشت" }: NewAdmissionDetailViewProps) {
  const { user } = useAuth();
  const [application, setApplication] = useState<ApiApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isClaiming, setIsClaiming] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [correctionDetails, setCorrectionDetails] = useState('');
  
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const fetchApplicationDetails = async () => {
    // No need to set loading to true here, as it's for refreshing
    setError(null);
    try {
      const response = await apiService.get(`/v1/applications/${applicationId}/`);
      setApplication(response.data);
    } catch (err) {
      setError("امکان بارگذاری جزئیات درخواست وجود ندارد. لطفا مجددا تلاش کنید.");
      toast.error("خطا در بارگذاری جزئیات درخواست.");
    } finally {
      setIsLoading(false); // Ensure loading is false even on refresh
    }
  };

  useEffect(() => {
    if (applicationId) {
        setIsLoading(true);
        fetchApplicationDetails();
    }
  }, [applicationId]);

  // --- FUNCTION IMPLEMENTED ---
  const handleClaimTask = async (universityPk: number) => {
    setIsClaiming(true);
    try {
      await apiService.post(`/v1/applications/${applicationId}/claim/${universityPk}/`);
      toast.success("پرونده با موفقیت به شما ارجاع داده شد!");
      await fetchApplicationDetails(); // Refresh data to show new state
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "خطا در ارجاع پرونده.");
    } finally {
      setIsClaiming(false);
    }
  };

  // --- FUNCTION IMPLEMENTED ---
  const handleExpertAction = async (action: 'APPROVE' | 'REJECT' | 'CORRECT', universityPk: number, comment?: string) => {
    setIsSubmittingAction(true);
    try {
      await apiService.post(`/v1/applications/${applicationId}/action/${universityPk}/`, { action, comment: comment || '' });
      toast.success(`اقدام '${action}' با موفقیت ثبت شد!`);
      setShowRejectModal(false);
      setShowCorrectionModal(false);
      setRejectReason('');
      setCorrectionDetails('');
      // Go back to workbench after final decision, or refresh if sent for correction
      if (action === 'CORRECT') {
        await fetchApplicationDetails();
      } else {
        onBack(); 
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.comment?.[0] || err.response?.data?.detail || `خطا در ثبت اقدام: ${action}.`;
      toast.error("Action Failed", { description: errorMsg });
    } finally {
      setIsSubmittingAction(false);
    }
  };
  
  const handleAddNote = async () => {
    if(!newNote.trim() || !application) return;
    setIsAddingNote(true);
    try {
        await apiService.post(`/v1/applications/${application.tracking_code}/notes/`, { message: newNote });
        toast.success("یادداشت داخلی ثبت شد.");
        setNewNote('');
        await fetchApplicationDetails();
    } catch (error) {
        toast.error("خطا در ثبت یادداشت.");
    } finally {
        setIsAddingNote(false);
    }
  };

  const userRole = user?.id === application?.applicant.id ? 'applicant' : user?.roles.some((r: any) => r.name === 'UniversityExpert' || r.name === 'HeadOfOrganization') ? 'expert' : 'viewer';
  const expertUniversities = user?.universities?.map((u: any) => u.id) || [];
  const expertTaskForMyUni = userRole === 'expert' && application ? application.tasks.find(task => expertUniversities.includes(task.university.id)) : null;

  if (isLoading) return <div className="flex h-screen w-full items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error || !application) return <div className="flex h-screen w-full items-center justify-center p-8 text-destructive">{error}</div>;

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <div className="bg-white border-b p-6 sticky top-0 z-10">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2 space-x-reverse mb-4"><ArrowRight className="w-4 h-4" /><span>{backLabel}</span></Button>
        <div><h1 className="text-2xl font-bold">جزئیات درخواست: {application.tracking_code}</h1><p className="text-muted-foreground">متقاضی: {application.full_name}</p></div>
      </div>

      <div className="section-padding container-modern space-y-8">
        {expertTaskForMyUni && (
          <Card className="card-modern border-primary/20"><CardHeader><CardTitle className="flex items-center"><Edit className="w-5 h-5 ml-2 text-primary" />اقدامات کارشناس ({expertTaskForMyUni.university.name})</CardTitle></CardHeader><CardContent>
            {expertTaskForMyUni.status === 'UNCLAIMED' && application.status === 'PENDING_REVIEW' && <Button onClick={() => handleClaimTask(expertTaskForMyUni.university.id)} disabled={isClaiming} className="w-full text-lg py-6">{isClaiming ? <RefreshCw className="w-5 h-5 animate-spin"/> : "ارجاع به خود"}</Button>}
            {expertTaskForMyUni.status === 'ASSIGNED' && application.status === 'PENDING_REVIEW' && <div className="flex flex-col sm:flex-row gap-4"><Button onClick={() => handleExpertAction('APPROVE', expertTaskForMyUni.university.id)} disabled={isSubmittingAction} className="flex-1 bg-success hover:bg-success/90">تایید</Button><Button variant="outline" onClick={() => setShowCorrectionModal(true)} disabled={isSubmittingAction} className="flex-1">ارسال برای اصلاح</Button><Button variant="destructive" onClick={() => setShowRejectModal(true)} disabled={isSubmittingAction} className="flex-1">رد درخواست</Button></div>}
            {expertTaskForMyUni.status === 'COMPLETED' && <div className="text-center text-success p-4 bg-success/10 rounded-lg"><p>شما نظر خود را برای این دانشگاه ثبت کرده‌اید: <strong>{expertTaskForMyUni.decision}</strong></p></div>}
          </CardContent></Card>
        )}

        {application.status === 'PENDING_CORRECTION' && <Card className="border-warning/50 bg-warning/5 text-warning-foreground p-4"><p>این درخواست برای اصلاح به متقاضی بازگردانده شده است.</p></Card>}

        <Card className="card-modern"><CardHeader><CardTitle className="flex items-center"><User className="w-5 h-5 ml-2" />اطلاعات فردی</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><div><Label>نام کامل</Label><p>{application.full_name}</p></div><div><Label>نام پدر</Label><p>{application.father_name}</p></div>{application.grandfather_name && <div><Label>نام جد</Label><p>{application.grandfather_name}</p></div>}<div><Label>تاریخ تولد</Label><p>{formatDate(application.date_of_birth)}</p></div><div><Label>کشور اقامت</Label><p>{application.country_of_residence}</p></div><div><Label>ایمیل</Label><p>{application.email}</p></div></CardContent></Card>
        <Card className="card-modern"><CardHeader><CardTitle className="flex items-center"><GraduationCap className="w-5 h-5 ml-2" />سوابق تحصیلی</CardTitle></CardHeader><CardContent className="space-y-4">{application.academic_histories.map(h => <div key={h.id} className="p-4 border rounded-lg bg-muted/30 grid grid-cols-2 md:grid-cols-5 gap-3"><div><Label>مقطع</Label><p>{h.degree_level}</p></div><div><Label>کشور</Label><p>{h.country}</p></div><div className="md:col-span-2"><Label>دانشگاه</Label><p>{h.university_name}</p></div><div><Label>معدل</Label><p>{h.gpa}</p></div><div className="col-span-full"><Label>رشته</Label><p>{h.field_of_study}</p></div></div>)}</CardContent></Card>
        <Card className="card-modern"><CardHeader><CardTitle className="flex items-center"><University className="w-5 h-5 ml-2" />انتخاب‌های دانشگاه</CardTitle></CardHeader><CardContent className="space-y-3">{application.university_choices.sort((a,b) => a.priority - b.priority).map(c => <div key={c.id} className="flex items-center gap-4 p-3 border rounded-lg"><div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">{c.priority}</div><div><p className="font-semibold">{c.university.name}</p><p className="text-sm text-muted-foreground">{c.program.name}</p></div></div>)}</CardContent></Card>
        <Card className="card-modern"><CardHeader><CardTitle className="flex items-center"><FileText className="w-5 h-5 ml-2" />مدارک</CardTitle></CardHeader><CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">{application.documents.map(d => <div key={d.id} className="flex items-center justify-between p-3 border rounded-lg"><div><p className="font-medium">{d.document_type}</p><p className="text-xs text-muted-foreground">{d.file ? d.file.split('/').pop() : 'فایل ناموجود'}</p></div><a href={d.file || '#'} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" disabled={!d.file}><Download className="w-4 h-4 ml-2" />دانلود</Button></a></div>)}</CardContent></Card>
        
        {userRole === 'expert' && (
            <Card className="card-modern">
                <CardHeader><CardTitle className="flex items-center space-x-2 space-x-reverse"><MessageSquare className="w-5 h-5 text-primary" /><span>یادداشت‌های داخلی</span></CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-2 border-r-2 border-border">
                        {application.internal_notes?.length > 0 ? (
                            application.internal_notes.map(note => (
                                <div key={note.id} className="p-3 bg-muted rounded-lg">
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                        <strong>{note.author ? note.author.full_name : 'کاربر حذف شده'}</strong>
                                        <span>{formatDateTime(note.timestamp)}</span>
                                    </div>
                                    <p className="mt-2 text-sm whitespace-pre-wrap">{note.message}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">هیچ یادداشتی ثبت نشده است.</p>
                        )}
                    </div>
                    <div className="pt-4 border-t">
                        <Label htmlFor="new-note">افزودن یادداشت جدید</Label>
                        <Textarea id="new-note" value={newNote} onChange={e => setNewNote(e.target.value)} className="mt-2" placeholder="یادداشت خود را اینجا بنویسید..."/>
                        <Button onClick={handleAddNote} disabled={isAddingNote || !newNote.trim()} className="mt-2">
                            {isAddingNote ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                            <span className="mr-2">افزودن</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}

        <Card className="card-modern"><CardHeader><CardTitle className="flex items-center"><MessageSquare className="w-5 h-5 ml-2" />تاریخچه درخواست</CardTitle></CardHeader><CardContent className="space-y-6">{application.logs.map(log => <div key={log.id} className="flex items-start space-x-4 space-x-reverse"><div className="flex-1 min-w-0"><div className="bg-muted/30 rounded-lg p-4"><div className="flex items-center justify-between mb-2"><p className="font-medium">{log.action}</p><p className="text-sm text-muted-foreground">{formatDateTime(log.timestamp)}</p></div><p className="text-sm text-muted-foreground mb-3">توسط: {log.actor ? log.actor.full_name : 'سیستم'}</p>{log.comment && <p className="text-sm border-r-2 border-primary pr-2 bg-background p-2 rounded">{log.comment}</p>}</div></div></div>)}</CardContent></Card>
      </div>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}><DialogContent dir="rtl"><DialogHeader><DialogTitle>شرح علت رد درخواست</DialogTitle></DialogHeader><div className="py-4 space-y-2"><Label htmlFor="reject-reason">علت رد (اجباری)</Label><Textarea id="reject-reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="min-h-32" /></div><DialogFooter><Button variant="outline" onClick={() => setShowRejectModal(false)}>انصراف</Button><Button variant="destructive" onClick={() => handleExpertAction('REJECT', expertTaskForMyUni!.university.id, rejectReason)} disabled={isSubmittingAction || !rejectReason.trim()}>{isSubmittingAction ? "..." : "تایید رد"}</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={showCorrectionModal} onOpenChange={setShowCorrectionModal}><DialogContent dir="rtl"><DialogHeader><DialogTitle>موارد نیاز به اصلاح</DialogTitle></DialogHeader><div className="py-4 space-y-2"><Label htmlFor="correction-details">موارد نیاز به اصلاح (اجباری)</Label><Textarea id="correction-details" value={correctionDetails} onChange={e => setCorrectionDetails(e.target.value)} className="min-h-32" /></div><DialogFooter><Button variant="outline" onClick={() => setShowCorrectionModal(false)}>انصراف</Button><Button onClick={() => handleExpertAction('CORRECT', expertTaskForMyUni!.university.id, correctionDetails)} disabled={isSubmittingAction || !correctionDetails.trim()}>{isSubmittingAction ? "..." : "ارسال"}</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}