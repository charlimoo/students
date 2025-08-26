import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowRight, Paperclip, Send, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface PersianSupportTicketDetailProps {
  ticketId: string | null;
  onBack: () => void;
}

export function PersianSupportTicketDetail({ ticketId, onBack }: PersianSupportTicketDetailProps) {
  const [replyText, setReplyText] = useState('');

  // Mock ticket data
  const ticketData = {
    id: 'TCK-98765',
    subject: 'مشکل در بارگذاری مدارک',
    status: 'in-progress',
    createdDate: '۱۴۰۳/۰۸/۲۰',
    lastUpdate: '۱۴۰۳/۰۸/۲۲',
    priority: 'medium',
    category: 'فنی',
    
    student: {
      name: 'مریم احمدی',
      email: 'maryam.ahmadi@student.edu.ir',
      studentId: 'STU-2023-4567'
    },

    conversation: [
      {
        id: 1,
        sender: 'student',
        senderName: 'مریم احمدی',
        timestamp: '۱۴۰۳/۰۸/۲۰ - ۱۴:۳۰',
        message: 'سلام\n\nمن در تلاش برای بارگذاری مدارک تحصیلی خود در سامانه هستم، اما هر بار که فایل PDF خود را انتخاب می‌کنم، پیغام خطا می‌گیرم که می‌گوید "فرمت فایل پشتیبانی نمی‌شود". \n\nفایل من با فرمت PDF و حجم ۲ مگابایت است. آیا مشکلی در سامانه وجود دارد؟ لطفاً راهنمایی کنید.\n\nبا تشکر',
        isRead: true
      },
      {
        id: 2,
        sender: 'staff',
        senderName: 'احمد رضایی - پشتیبانی فنی',
        timestamp: '۱۴۰۳/۰۸/۲۱ - ۰۹:۱۵',
        message: 'سلام جناب احمدی\n\nپیغام شما دریافت شد. این مشکل معمولاً به دلیل تنظیمات مرورگر یا کش ذخیره شده ایجاد می‌شود.\n\nلطفاً مراحل زیر را انجام دهید:\n\n۱. کش مرورگر خود را پاک کنید\n۲. از مرورگر کروم یا فایرفاکس استفاده کنید\n۳. مطمئن شوید فایل شما کمتر از ۵ مگابایت باشد\n۴. نام فایل شامل کاراکتر فارسی نباشد\n\nاگر مشکل همچنان ادامه داشت، لطفاً فایل را برای ما ارسال کنید تا بررسی کنیم.\n\nموفق باشید',
        isRead: true
      },
      {
        id: 3,
        sender: 'student',
        senderName: 'مریم احمدی',
        timestamp: '۱۴۰۳/۰۸/۲۲ - ۱۶:۴۵',
        message: 'سلام\n\nمتشکرم از راهنمایی‌تان. متأسفانه پس از انجام تمامی مراحل پیشنهادی شما، هنوز هم با همان خطا مواجه می‌شوم.\n\nفایل را با نام انگلیسی ذخیره کردم و از مرورگر کروم استفاده می‌کنم. آیا امکان بررسی فایل توسط تیم فنی وجود دارد؟\n\nضمیمه: فایل مدرک تحصیلی',
        attachments: [
          {
            name: 'degree_certificate.pdf',
            size: '۱.۸ مگابایت'
          }
        ],
        isRead: false
      }
    ]
  };

  const getStatusBadge = () => {
    switch (ticketData.status) {
      case 'open':
        return <Badge className="status-badge-pending persian-text">باز</Badge>;
      case 'in-progress':
        return <Badge className="status-badge-review persian-text">در حال رسیدگی</Badge>;
      case 'resolved':
        return <Badge className="status-badge-approved persian-text">حل شده</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="persian-text">بسته شده</Badge>;
      default:
        return <Badge variant="secondary" className="persian-text">نامشخص</Badge>;
    }
  };

  const getPriorityIcon = () => {
    switch (ticketData.priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log('Sending reply:', replyText);
      setReplyText('');
      // Here you would typically send the reply to the backend
    }
  };

  const handleFileAttachment = () => {
    console.log('Opening file picker for attachment');
    // Here you would typically open a file picker
  };

  return (
    <div className="min-h-screen bg-background persian-text" dir="rtl">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 space-x-reverse text-primary hover:underline mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="persian-text">بازگشت به لیست تیکت‌ها</span>
          </button>
          
          <div className="space-y-6 text-right">
            <div>
              <h1 className="text-2xl text-foreground persian-heading mb-3">
                موضوع: {ticketData.subject}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground persian-text">
                    شماره تیکت: <span className="font-semibold text-foreground">{ticketData.id}</span>
                  </p>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                    <span className="persian-text">تاریخ ایجاد: {ticketData.createdDate}</span>
                    <span className="persian-text">آخرین بروزرسانی: {ticketData.lastUpdate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {getPriorityIcon()}
                    <span className="text-sm persian-text text-muted-foreground">اولویت متوسط</span>
                  </div>
                  {getStatusBadge()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Conversation */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Ticket Information */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="persian-heading text-lg">اطلاعات تیکت</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground persian-text">دسته‌بندی: </span>
                  <span className="font-semibold persian-text">{ticketData.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground persian-text">نام دانشجو: </span>
                  <span className="font-semibold persian-text">{ticketData.student.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground persian-text">شماره دانشجویی: </span>
                  <span className="font-semibold persian-text">{ticketData.student.studentId}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Thread */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="persian-heading text-lg">تاریخچه مکالمه</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ticketData.conversation.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.sender === 'student' ? 'order-2' : 'order-1'}`}>
                      {/* Message Header */}
                      <div className={`flex items-center space-x-2 space-x-reverse mb-2 ${
                        message.sender === 'student' ? 'justify-end' : 'justify-start'
                      }`}>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-semibold persian-text">
                            {message.senderName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground persian-text">
                          {message.timestamp}
                        </span>
                        {!message.isRead && message.sender === 'student' && (
                          <Badge variant="secondary" className="text-xs persian-text">جدید</Badge>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`rounded-lg p-4 ${
                        message.sender === 'student' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="persian-text leading-relaxed whitespace-pre-line">
                          {message.message}
                        </div>

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-primary-foreground/20">
                            <p className="text-sm font-semibold mb-2 persian-text">فایل‌های ضمیمه:</p>
                            <div className="space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2 space-x-reverse text-sm">
                                  <Paperclip className="w-4 h-4" />
                                  <span className="persian-text">{attachment.name}</span>
                                  <span className="text-xs opacity-75 persian-text">({attachment.size})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reply Box */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="persian-heading text-lg">ارسال پاسخ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="پاسخ خود را اینجا بنویسید..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[120px] resize-none persian-text text-right pr-4"
                    dir="rtl"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFileAttachment}
                      className="persian-text"
                    >
                      <Paperclip className="w-4 h-4 ml-2" />
                      ضمیمه فایل
                    </Button>
                    <span className="text-xs text-muted-foreground persian-text">
                      حداکثر حجم: ۱۰ مگابایت
                    </span>
                  </div>

                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="button-primary persian-text"
                  >
                    <Send className="w-4 h-4 ml-2" />
                    ارسال پاسخ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Information */}
          <Card className="card-modern bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="persian-heading text-lg text-primary">راهنمای استفاده از تیکت پشتیبانی</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm persian-text">
                  <div className="p-4 bg-background/50 rounded-lg text-right">
                    <h4 className="persian-heading text-primary mb-2">زمان پاسخگویی</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      پاسخ به تیکت‌های فنی: حداکثر ۲۴ ساعت<br />
                      پاسخ به سوالات عمومی: حداکثر ۴۸ ساعت
                    </p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg text-right">
                    <h4 className="persian-heading text-primary mb-2">نکات مهم</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      لطفاً تا دریافت پاسخ، تیکت جدید ایجاد نکنید.<br />
                      برای مشکلات فوری با شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}