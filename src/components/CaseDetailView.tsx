import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  User,
  Calendar,
  MapPin,
  CreditCard,
  GraduationCap,
  FileText,
  Download,
  Eye,
  Clock,
  Building,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Send
} from 'lucide-react';

interface CaseDetailViewProps {
  caseId: string;
  onBack: () => void;
  backLabel?: string;
}

// Mock data for internal messages
const mockMessages = [
  {
    id: 1,
    author: 'احمد محمدی',
    role: 'کارشناس ارشد',
    message: 'پرونده بررسی شد. مدرک ترجمه رسمی ناقص است. متقاضی باید نسخه معتبر ارائه دهد.',
    timestamp: '2024-02-15 14:20',
    avatar: 'ا.م'
  },
  {
    id: 2,
    author: 'فاطمه علیزاده',
    role: 'مسئول واحد',
    message: 'با توجه به بررسی انجام شده، لطفاً از متقاضی درخواست کنید تا ترجمه رسمی مدرک تحصیلی خود را از مراجع رسمی دریافت و ارسال نماید.',
    timestamp: '2024-02-15 11:30',
    avatar: 'ف.ع'
  },
  {
    id: 3,
    author: 'محمد حسنی',
    role: 'کارشناس',
    message: 'سایر مدارک مورد تایید هستند. فقط مشکل ترجمه رسمی باقی مانده است.',
    timestamp: '2024-02-14 16:45',
    avatar: 'م.ح'
  }
];

// Mock data for the case
const mockCase = {
  id: 'APP-2024-002',
  trackingCode: 'TRK-2024-002',
  student: {
    name: 'مریم کریمی',
    nationality: 'افغانستانی',
    passportNumber: 'P1234567',
    profileImage: null,
    email: 'maryam.karimi@email.com',
    phone: '+93 700 123 456',
    dateOfBirth: '1995-05-15',
    placeOfBirth: 'کابل، افغانستان'
  },
  application: {
    type: 'تمدید ویزا دانشجویی',
    status: 'دارای نقص',
    statusDescription: 'در انتظار بررسی کارشناس سازمان',
    submitDate: '2024-02-14',
    university: 'دانشگاه صنعتی شریف',
    degree: 'کارشناسی ارشد مهندسی کامپیوتر',
    expectedGraduation: '2025-06-30',
    currentSemester: 'ترم 3'
  },
  documents: [
    {
      id: 'doc-1',
      name: 'تصویر پرسنلی',
      type: 'image',
      status: 'uploaded',
      uploadDate: '2024-02-14'
    },
    {
      id: 'doc-2',
      name: 'کپی پاسپورت',
      type: 'pdf',
      status: 'uploaded',
      uploadDate: '2024-02-14'
    },
    {
      id: 'doc-3',
      name: 'مدرک تحصیلی',
      type: 'pdf',
      status: 'uploaded',
      uploadDate: '2024-02-14'
    },
    {
      id: 'doc-4',
      name: 'ترجمه رسمی مدرک',
      type: 'pdf',
      status: 'missing',
      uploadDate: null
    },
    {
      id: 'doc-5',
      name: 'گواهی زبان انگلیسی',
      type: 'pdf',
      status: 'uploaded',
      uploadDate: '2024-02-14'
    }
  ],
  workflow: [
    {
      id: 1,
      action: 'ثبت درخواست',
      actor: 'متقاضی',
      date: '2024-02-14',
      time: '09:30',
      status: 'completed'
    },
    {
      id: 2,
      action: 'بررسی اولیه مدارک',
      actor: 'سیستم خودکار',
      date: '2024-02-14',
      time: '09:35',
      status: 'completed'
    },
    {
      id: 3,
      action: 'ارجاع به کارشناس',
      actor: 'سیستم خودکار',
      date: '2024-02-14',
      time: '10:00',
      status: 'completed'
    },
    {
      id: 4,
      action: 'بررسی کارشناسی',
      actor: 'احمد محمدی',
      date: '2024-02-15',
      time: '14:20',
      status: 'in-progress'
    }
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'جدید':
      return <Badge className="status-badge-review">جدید</Badge>;
    case 'دارای نقص':
      return <Badge className="status-badge-rejected">دارای نقص</Badge>;
    case 'در حال بررسی':
      return <Badge className="status-badge-pending">در حال بررسی</Badge>;
    case 'تایید شده':
      return <Badge className="status-badge-approved">تایید شده</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <Eye className="w-6 h-6 text-blue-600" />
      </div>;
    case 'pdf':
      return <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <FileText className="w-6 h-6 text-red-600" />
      </div>;
    default:
      return <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <FileText className="w-6 h-6 text-gray-600" />
      </div>;
  }
};

const getDocumentStatus = (status: string) => {
  switch (status) {
    case 'uploaded':
      return <Badge className="bg-green-100 text-green-800 border-green-200">آپلود شده</Badge>;
    case 'missing':
      return <Badge className="bg-red-100 text-red-800 border-red-200">ناقص</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">در انتظار</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function CaseDetailView({ caseId, onBack, backLabel = 'بازگشت به میزکار' }: CaseDetailViewProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewReason, setReviewReason] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleApprove = () => {
    console.log('Approving case:', caseId);
    // Handle approval logic
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      console.log('Rejecting case:', caseId, 'Reason:', rejectReason);
      setIsRejectModalOpen(false);
      setRejectReason('');
      // Handle rejection logic
    }
  };

  const handleSendForReview = () => {
    if (reviewReason.trim()) {
      console.log('Sending for review:', caseId, 'Reason:', reviewReason);
      setIsReviewModalOpen(false);
      setReviewReason('');
      // Handle send for review logic
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        author: 'احمد محمدی',
        role: 'کارشناس ارشد',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleString('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        avatar: 'ا.م'
      };
      
      setMessages([message, ...messages]);
      setNewMessage('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = formatDate(dateString);
    return `${date} - ${timeString}`;
  };

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="persian-text">{backLabel}</span>
              </Button>
              <div>
                <h1 className="text-3xl persian-heading text-foreground">جزئیات پرونده</h1>
                <p className="text-muted-foreground persian-body">
                  کد رهگیری: <span className="font-mono">{mockCase.trackingCode}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground persian-caption">
                آخرین بروزرسانی: {formatDate('2024-02-15')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Student Summary & Internal Messages */}
            <div className="lg:col-span-1 space-y-6">
              {/* Student Summary Card */}
              <Card className="card-modern">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <Avatar className="w-24 h-24 border-4 border-primary/10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl persian-text">
                        {mockCase.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl persian-heading">{mockCase.student.name}</CardTitle>
                  <div className="flex items-center justify-center space-x-2 space-x-reverse mt-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground persian-caption">{mockCase.student.nationality}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground persian-caption">شماره پاسپورت</p>
                        <p className="font-mono text-sm">{mockCase.student.passportNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground persian-caption">ایمیل</p>
                        <p className="text-sm">{mockCase.student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground persian-caption">تلفن</p>
                        <p className="text-sm font-mono">{mockCase.student.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground persian-caption">تاریخ تولد</p>
                        <p className="text-sm persian-body">{formatDate(mockCase.student.dateOfBirth)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground persian-caption">محل تولد</p>
                        <p className="text-sm persian-body">{mockCase.student.placeOfBirth}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="space-y-3">
                      <h4 className="persian-heading text-base">نوع درخواست</h4>
                      <p className="persian-body text-sm bg-muted p-3 rounded-lg">
                        {mockCase.application.type}
                      </p>
                    </div>

                    <div className="mt-4">
                      <h4 className="persian-heading text-base mb-2">وضعیت فعلی</h4>
                      <div className="space-y-2">
                        {getStatusBadge(mockCase.application.status)}
                        <p className="text-sm text-muted-foreground persian-body">
                          {mockCase.application.statusDescription}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Building className="w-4 h-4 text-primary" />
                        <h4 className="persian-heading text-base">دانشگاه</h4>
                      </div>
                      <p className="text-sm text-muted-foreground persian-body mt-1">
                        {mockCase.application.university}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Messages Card */}
              <Card className="card-modern">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 space-x-reverse persian-heading">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span>یادداشت‌ها و پیام‌های داخلی</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Messages Display Area */}
                  <ScrollArea className="h-64 w-full rounded-lg border border-border bg-muted/20 p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground persian-caption">
                            هنوز پیامی ثبت نشده است
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div key={message.id} className="space-y-2 p-3 bg-background rounded-lg border border-border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-primary text-primary-foreground text-xs persian-text">
                                    {message.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium persian-text">{message.author}</p>
                                  <p className="text-xs text-muted-foreground persian-caption">{message.role}</p>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground font-mono">
                                {message.timestamp}
                              </span>
                            </div>
                            <p className="text-sm persian-body leading-relaxed">
                              {message.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* Message Input Area */}
                  <div className="space-y-3">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="پیام جدید خود را بنویسید..."
                      className="resize-none persian-body"
                      rows={3}
                      dir="rtl"
                    />
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="w-full bg-primary hover:bg-primary-600 text-primary-foreground flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      <Send className="w-4 h-4" />
                      <span className="persian-text">ارسال پیام</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Action Buttons */}
                <Card className="card-modern">
                  <CardContent className="p-6">
                    <h3 className="persian-heading text-lg mb-4">اقدامات</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={handleApprove}
                        className="bg-success hover:bg-success/90 text-success-foreground flex items-center space-x-2 space-x-reverse"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span className="persian-text">تایید نهایی</span>
                      </Button>

                      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex items-center space-x-2 space-x-reverse"
                          >
                            <XCircle className="w-5 h-5" />
                            <span className="persian-text">رد درخواست</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="persian-text" dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="persian-heading">رد درخواست</DialogTitle>
                            <DialogDescription className="persian-body">
                              لطفاً دلیل رد درخواست را در قسمت زیر وارد کنید. این اطلاعات به متقاضی ارسال خواهد شد.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="persian-caption text-sm font-medium">دلیل رد درخواست:</label>
                              <Textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="لطفاً دلیل رد درخواست را شرح دهید..."
                                className="mt-2 persian-body"
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-end space-x-2 space-x-reverse">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsRejectModalOpen(false)}
                                className="persian-text"
                              >
                                انصراف
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                                className="persian-text"
                              >
                                تایید رد
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center space-x-2 space-x-reverse"
                          >
                            <RotateCcw className="w-5 h-5" />
                            <span className="persian-text">ارسال برای بازبینی</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="persian-text" dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="persian-heading">ارسال برای بازبینی</DialogTitle>
                            <DialogDescription className="persian-body">
                              لطفاً دلیل ارسال برای بازبینی را در قسمت زیر وارد کنید. این درخواست به سرپرست ارسال خواهد شد.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="persian-caption text-sm font-medium">دلیل ارسال برای بازبینی:</label>
                              <Textarea
                                value={reviewReason}
                                onChange={(e) => setReviewReason(e.target.value)}
                                placeholder="لطفاً دلیل ارسال برای بازبینی را شرح دهید..."
                                className="mt-2 persian-body"
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-end space-x-2 space-x-reverse">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsReviewModalOpen(false)}
                                className="persian-text"
                              >
                                انصراف
                              </Button>
                              <Button
                                type="button"
                                onClick={handleSendForReview}
                                disabled={!reviewReason.trim()}
                                className="persian-text"
                              >
                                ارسال
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabbed Content */}
                <Card className="card-modern">
                  <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
                    <TabsList className="grid w-full grid-cols-3 p-1 bg-muted rounded-lg">
                      <TabsTrigger value="summary" className="persian-text text-sm">خلاصه پرونده</TabsTrigger>
                      <TabsTrigger value="documents" className="persian-text text-sm">مدارک</TabsTrigger>
                      <TabsTrigger value="workflow" className="persian-text text-sm">گردش کار</TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="mt-6">
                      <div className="space-y-6 p-6">
                        <h3 className="persian-heading text-xl">اطلاعات درخواست</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="persian-caption text-sm text-muted-foreground">تاریخ ثبت درخواست</label>
                              <p className="persian-body mt-1">{formatDate(mockCase.application.submitDate)}</p>
                            </div>
                            
                            <div>
                              <label className="persian-caption text-sm text-muted-foreground">دانشگاه</label>
                              <p className="persian-body mt-1">{mockCase.application.university}</p>
                            </div>
                            
                            <div>
                              <label className="persian-caption text-sm text-muted-foreground">رشته تحصیلی</label>
                              <p className="persian-body mt-1">{mockCase.application.degree}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="persian-caption text-sm text-muted-foreground">ترم فعلی</label>
                              <p className="persian-body mt-1">{mockCase.application.currentSemester}</p>
                            </div>
                            
                            <div>
                              <label className="persian-caption text-sm text-muted-foreground">تاریخ پیش‌بینی فارغ‌التحصیلی</label>
                              <p className="persian-body mt-1">{formatDate(mockCase.application.expectedGraduation)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="mt-6">
                      <div className="space-y-6 p-6">
                        <h3 className="persian-heading text-xl">مدارک بارگذاری شده</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mockCase.documents.map((doc) => (
                            <Card key={doc.id} className="card-modern hover:shadow-lg transition-all duration-200">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-4 space-x-reverse mb-3">
                                  {getDocumentIcon(doc.type)}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="persian-caption font-medium text-sm truncate">{doc.name}</h4>
                                    <p className="text-xs text-muted-foreground persian-body">
                                      {doc.uploadDate ? formatDate(doc.uploadDate) : 'بارگذاری نشده'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  {getDocumentStatus(doc.status)}
                                  {doc.status === 'uploaded' && (
                                    <div className="flex space-x-2 space-x-reverse">
                                      <Button size="sm" variant="outline" className="p-2">
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="outline" className="p-2">
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Workflow Tab */}
                    <TabsContent value="workflow" className="mt-6">
                      <div className="space-y-6 p-6">
                        <h3 className="persian-heading text-xl">تاریخچه پرونده</h3>
                        
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="text-right persian-caption font-semibold">اقدام</TableHead>
                                <TableHead className="text-right persian-caption font-semibold">اقدام کننده</TableHead>
                                <TableHead className="text-right persian-caption font-semibold">تاریخ و زمان</TableHead>
                                <TableHead className="text-right persian-caption font-semibold">وضعیت</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mockCase.workflow.map((step) => (
                                <TableRow key={step.id} className="hover:bg-muted/50 transition-colors">
                                  <TableCell className="persian-body">{step.action}</TableCell>
                                  <TableCell className="persian-body">{step.actor}</TableCell>
                                  <TableCell className="persian-body text-sm">
                                    {formatDateTime(step.date, step.time)}
                                  </TableCell>
                                  <TableCell>
                                    {step.status === 'completed' && (
                                      <Badge className="bg-success text-success-foreground">انجام شده</Badge>
                                    )}
                                    {step.status === 'in-progress' && (
                                      <Badge className="bg-primary text-primary-foreground">در حال انجام</Badge>
                                    )}
                                    {step.status === 'pending' && (
                                      <Badge className="bg-warning text-warning-foreground">در انتظار</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}