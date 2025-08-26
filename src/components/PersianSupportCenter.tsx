import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowRight, Upload, FileText, Clock, CheckCircle, AlertTriangle, Send, Plus } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface PersianSupportCenterProps {
  onBack: () => void;
  onViewTicket: (ticketId: string) => void;
  onLanguageSwitch?: (language: 'english' | 'persian') => void;
}

export function PersianSupportCenter({ onBack, onViewTicket, onLanguageSwitch }: PersianSupportCenterProps) {
  const [activeTab, setActiveTab] = useState('new-ticket');
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    attachedFile: null as File | null
  });

  // Mock tickets data
  const tickets = [
    {
      id: 'TCK-98765',
      subject: 'مشکل در بارگذاری مدارک',
      category: 'فنی',
      lastUpdate: '۱۴۰۳/۰۸/۲۲',
      status: 'in-progress'
    },
    {
      id: 'TCK-98764',
      subject: 'سوال در مورد وضعیت درخواست',
      category: 'عمومی',
      lastUpdate: '۱۴۰۳/۰۸/۲۰',
      status: 'resolved'
    },
    {
      id: 'TCK-98763',
      subject: 'مشکل در ورود به سامانه',
      category: 'فنی',
      lastUpdate: '۱۴۰۳/۰۸/۱۸',
      status: 'closed'
    },
    {
      id: 'TCK-98762',
      subject: 'درخواست تغییر اطلاعات شخصی',
      category: 'اداری',
      lastUpdate: '۱۴۰۳/۰۸/۱۵',
      status: 'open'
    },
    {
      id: 'TCK-98761',
      subject: 'پرسش در مورد مدارک مورد نیاز',
      category: 'عمومی',
      lastUpdate: '۱۴۰۳/۰۸/۱۲',
      status: 'resolved'
    }
  ];

  const categories = [
    { value: 'technical', label: 'فنی' },
    { value: 'general', label: 'عمومی' },
    { value: 'administrative', label: 'اداری' },
    { value: 'academic', label: 'آموزشی' },
    { value: 'financial', label: 'مالی' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachedFile: file
      }));
    }
  };

  const handleSubmitTicket = () => {
    console.log('Submitting ticket:', formData);
    // Here you would typically submit the ticket to the backend
    alert('تیکت شما با موفقیت ثبت شد!');
    
    // Reset form
    setFormData({
      category: '',
      subject: '',
      description: '',
      attachedFile: null
    });
  };

  const isFormValid = formData.category && formData.subject && formData.description;

  return (
    <div className="min-h-screen bg-background persian-text" dir="rtl">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 space-x-reverse text-primary hover:underline mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="persian-text">بازگشت به داشبورد</span>
          </button>
          
          <div className="text-right">
            <h1 className="text-3xl text-foreground persian-heading mb-2">مرکز پشتیبانی</h1>
            <p className="text-muted-foreground persian-text">
              برای دریافت کمک و پاسخ به سوالات خود، تیکت ثبت کنید یا تیکت‌های قبلی خود را مشاهده کنید
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="new-ticket" className="persian-text">
              <Plus className="w-4 h-4 ml-2" />
              ثبت تیکت جدید
            </TabsTrigger>
            <TabsTrigger value="my-tickets" className="persian-text">
              <FileText className="w-4 h-4 ml-2" />
              تیکت‌های من
            </TabsTrigger>
          </TabsList>

          {/* New Ticket Tab */}
          <TabsContent value="new-ticket">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="persian-heading text-xl">ثبت تیکت جدید</CardTitle>
                <p className="text-muted-foreground persian-text">
                  لطفاً اطلاعات کامل مشکل یا سوال خود را وارد کنید تا بتوانیم بهترین پاسخ را ارائه دهیم
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="persian-text">
                      دسته‌بندی <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="w-full text-right" dir="rtl">
                        <SelectValue placeholder="انتخاب دسته‌بندی" className="persian-text" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="persian-text text-right">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="persian-text">
                      موضوع <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="عنوان کوتاه مشکل یا سوال خود را وارد کنید"
                      className="input-modern text-right persian-text"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="persian-text">
                    شرح کامل مشکل <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="لطفاً مشکل یا سوال خود را به صورت کامل و واضح شرح دهید. هر چه توضیحات بیشتری ارائه دهید، پاسخ دقیق‌تری دریافت خواهید کرد."
                    className="min-h-[150px] resize-none text-right persian-text"
                    dir="rtl"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="persian-text">پیوست فایل</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <p className="persian-text text-muted-foreground">
                        {formData.attachedFile ? formData.attachedFile.name : 'کلیک کنید یا فایل را اینجا بکشید'}
                      </p>
                      <p className="text-xs text-muted-foreground persian-text">
                        فرمت‌های مجاز: PDF, JPG, PNG, DOC, DOCX (حداکثر ۱۰ مگابایت)
                      </p>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSubmitTicket}
                    disabled={!isFormValid}
                    className="button-primary persian-text px-8"
                  >
                    <Send className="w-4 h-4 ml-2" />
                    ارسال تیکت
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help Information */}
            <Card className="card-modern mt-6 bg-muted/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="persian-heading text-lg text-primary">نکات مهم برای ثبت تیکت</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm persian-text">
                    <div className="p-4 bg-background/50 rounded-lg text-right">
                      <h4 className="persian-heading text-primary mb-2">زمان پاسخگویی</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        تیکت‌های فنی: حداکثر ۲۴ ساعت<br />
                        تیکت‌های عمومی: حداکثر ۴۸ ساعت<br />
                        تیکت‌های اداری: ۲-۳ روز کاری
                      </p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg text-right">
                      <h4 className="persian-heading text-primary mb-2">نحوه نگارش</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        موضوع را واضح و مختصر بنویسید<br />
                        مشکل را به تفصیل شرح دهید<br />
                        در صورت امکان، تصویر ضمیمه کنید
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Tickets Tab */}
          <TabsContent value="my-tickets">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="persian-heading text-xl">تیکت‌های من</CardTitle>
                <p className="text-muted-foreground persian-text">
                  مشاهده و پیگیری تمامی تیکت‌های ثبت شده توسط شما
                </p>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="persian-heading text-lg mb-2">تیکتی یافت نشد</h3>
                    <p className="text-muted-foreground persian-text mb-4">
                      شما هنوز هیچ تیکتی ثبت نکرده‌اید
                    </p>
                    <Button
                      onClick={() => setActiveTab('new-ticket')}
                      className="button-primary persian-text"
                    >
                      ثبت اولین تیکت
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right persian-text">شماره تیکت</TableHead>
                          <TableHead className="text-right persian-text">موضوع</TableHead>
                          <TableHead className="text-right persian-text">دسته‌بندی</TableHead>
                          <TableHead className="text-right persian-text">آخرین بروزرسانی</TableHead>
                          <TableHead className="text-right persian-text">وضعیت</TableHead>
                          <TableHead className="text-right persian-text">عملیات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.map((ticket) => (
                          <TableRow key={ticket.id} className="hover:bg-muted/50">
                            <TableCell className="text-right font-mono">
                              {ticket.id}
                            </TableCell>
                            <TableCell className="text-right persian-text font-medium">
                              {ticket.subject}
                            </TableCell>
                            <TableCell className="text-right persian-text">
                              {ticket.category}
                            </TableCell>
                            <TableCell className="text-right persian-text">
                              {ticket.lastUpdate}
                            </TableCell>
                            <TableCell className="text-right">
                              {getStatusBadge(ticket.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onViewTicket(ticket.id)}
                                className="persian-text"
                              >
                                مشاهده جزئیات
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            {tickets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card className="card-modern text-center">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-primary">{tickets.length}</p>
                      <p className="text-sm text-muted-foreground persian-text">کل تیکت‌ها</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-modern text-center">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-warning">{tickets.filter(t => t.status === 'in-progress').length}</p>
                      <p className="text-sm text-muted-foreground persian-text">در حال رسیدگی</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-modern text-center">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-success">{tickets.filter(t => t.status === 'resolved').length}</p>
                      <p className="text-sm text-muted-foreground persian-text">حل شده</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-modern text-center">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-muted-foreground">{tickets.filter(t => t.status === 'closed').length}</p>
                      <p className="text-sm text-muted-foreground persian-text">بسته شده</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Language Switcher Footer */}
        {onLanguageSwitch && (
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex justify-center">
              <LanguageSwitcher
                currentLanguage="persian"
                onLanguageChange={onLanguageSwitch}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}