import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Separator } from './ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  User,
  HelpCircle,
  Bell,
  FileCheck,
  AlertCircle,
  MessageSquare,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  GraduationCap,
  Search,
  Menu,
  X
} from 'lucide-react';

interface PersianStudentDashboardProps {
  onNavigate: (page: string) => void;
  onViewApplication: (id: string) => void;
  onLanguageSwitch?: (language: 'english' | 'persian') => void;
}

// Mock applications data in Persian
const mockApplications = [
  {
    id: 'app-001',
    type: 'مجوز تحصیل',
    submissionDate: '۱۴۰۳/۰۸/۱۵',
    status: 'approved'
  },
  {
    id: 'app-002',
    type: 'ویزای توریستی',
    submissionDate: '۱۴۰۳/۰۸/۲۰',
    status: 'under-review'
  },
  {
    id: 'app-003',
    type: 'مجوز کار',
    submissionDate: '۱۴۰۳/۰۸/۲۵',
    status: 'requires-action'
  },
  {
    id: 'app-004',
    type: 'تمدید ویزای دانشجویی',
    submissionDate: '۱۴۰۳/۰۹/۰۱',
    status: 'under-review'
  }
];

// Mock notifications in Persian
const mockNotifications = [
  {
    id: 1,
    message: 'تمدید ویزای شما تایید شده است',
    timestamp: '۲ ساعت پیش',
    type: 'success'
  },
  {
    id: 2,
    message: 'مدارک اضافی برای درخواست مجوز کار مورد نیاز است',
    timestamp: '۵ ساعت پیش',
    type: 'warning'
  },
  {
    id: 3,
    message: 'پیام جدید از امور دانشجویی',
    timestamp: '۱ روز پیش',
    type: 'info'
  },
  {
    id: 4,
    message: 'درخواست مجوز تحصیل شما در دست بررسی است',
    timestamp: '۲ روز پیش',
    type: 'info'
  },
  {
    id: 5,
    message: 'تایید پرداخت دریافت شد',
    timestamp: '۳ روز پیش',
    type: 'success'
  }
];

// Persian status badges with correct colors matching English version
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 border-0 px-2.5 py-0.5 rounded-full font-medium text-xs">
          تایید شده
        </Badge>
      );
    case 'under-review':
      return (
        <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-0 px-2.5 py-0.5 rounded-full font-medium text-xs">
          در حال بررسی
        </Badge>
      );
    case 'requires-action':
      return (
        <Badge className="bg-red-600 text-white hover:bg-red-700 border-0 px-2.5 py-0.5 rounded-full font-medium text-xs">
          نیازمند اقدام
        </Badge>
      );
    default:
      return <Badge variant="secondary" className="text-xs">{status}</Badge>;
  }
};

// Persian sidebar items
const sidebarItems = [
  { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard, active: true },
  { id: 'new-application', label: 'درخواست جدید', icon: FileText, active: false },
  { id: 'my-applications', label: 'درخواست‌های من', icon: FolderOpen, active: false },
  { id: 'my-profile', label: 'پروفایل من', icon: User, active: false },
  { id: 'support', label: 'پشتیبانی', icon: HelpCircle, active: false }
];

export function PersianStudentDashboard({ onNavigate, onViewApplication, onLanguageSwitch }: PersianStudentDashboardProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open for desktop
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleSidebarClick = (itemId: string) => {
    if (itemId === 'my-profile') {
      onNavigate('persian-my-profile');
    } else if (itemId === 'new-application') {
      onNavigate('persian-select-application-type');
    } else if (itemId === 'my-applications') {
      onNavigate('persian-my-applications');
    } else if (itemId === 'support') {
      onNavigate('persian-support-center');
    }
    // Close mobile sidebar after navigation
    setSidebarOpen(false);
  };

  const handleStartNewApplication = () => {
    onNavigate('persian-select-application-type');
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'info':
        return <MessageSquare className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background persian-text" dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="responsive-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Enhanced Sidebar - Right side for RTL */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} h-screen transition-all duration-300 ease-in-out md:block`}>
          <div className={`fixed inset-y-0 right-0 z-50 w-64 h-screen bg-sidebar border-l border-sidebar-border transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 sidebar-modern ${sidebarOpen ? 'md:block' : 'md:hidden'}`}>
            <div className="flex flex-col h-full">
              {/* Close button for mobile */}
              <div className="flex items-center justify-between p-4 md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </Button>
                <h2 className="font-semibold text-sidebar-foreground persian-heading">پورتال دانشجو</h2>
              </div>

              {/* Header - Hidden on mobile due to close button */}
              <div className="p-5 border-b border-sidebar-border hidden md:block">
                <div className="flex items-center space-x-20 space-x-reverse">
                  <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center shadow-md">
                    <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-sidebar-foreground persian-heading">پورتال دانشجو</h2>
                    <p className="text-xs text-sidebar-foreground/70 persian-text">دانشجویان بین‌المللی</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="px-3 py-5 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSidebarClick(item.id)}
                      className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-2.5 rounded-lg transition-all duration-200 text-sm persian-text ${
                        item.active
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-medium'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <span className="text-right flex-1">{item.label}</span>
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </nav>

              {/* Need Help Card - Positioned right after navigation */}
              <div className="px-3 mt-4">
                <Separator className="mb-4" />
                <div className="bg-primary-50 rounded-lg p-3.5 mb-4">
                  <h3 className="font-medium text-primary mb-1.5 text-sm text-right persian-heading">کمک می‌خواهید؟</h3>
                  <p className="text-xs text-primary/80 mb-3 leading-relaxed text-right persian-text">
                    تیم پشتیبانی ما ۲۴/۷ در خدمت شما هستند.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => onNavigate('persian-support-center')}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-600 text-xs py-2 persian-text"
                  >
                    تماس با پشتیبانی
                  </Button>
                </div>
              </div>

              {/* Language Switcher - Bottom */}
              {onLanguageSwitch && (
                <div className="mt-auto p-3 border-t border-sidebar-border">
                  <div className="flex justify-center">
                    <div className="transform scale-110">
                      <LanguageSwitcher
                        currentLanguage="persian"
                        onLanguageChange={onLanguageSwitch}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Enhanced Header */}
          <div className="bg-white border-b border-border shadow-sm">
            <div className="px-4 md:px-6 py-4 md:py-5">
              <div className="flex items-center justify-between">
                {/* Left side - Hamburger menu and Welcome message */}
                <div className="space-y-1 flex-1 text-left">
                  <div className="flex items-center justify-start space-x-3">
                    {/* Desktop Sidebar Toggle Hamburger Icon - Far Left */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSidebar}
                      className="hidden md:block p-2 hover:bg-muted rounded-lg transition-all duration-200"
                      title="تغییر وضعیت نوار کناری"
                    >
                      <Menu className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    
                    {/* Mobile hamburger button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSidebar}
                      className="block md:hidden p-1.5"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground persian-heading">آیلین ییلماز، خوش آمدید!</h1>
                  </div>
                  <p className="text-muted-foreground text-sm md:text-base pl-0 md:pl-0 persian-text text-right">
                    از اینجا می‌توانید درخواست‌های خود را مدیریت کرده<br />
                    و مسیر تحصیلی‌تان را پیگیری کنید
                  </p>
                </div>

                {/* Right side - Actions and profile elements */}
                <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
                  {/* Search - Hidden on mobile */}
                  <div className="relative hidden lg:block">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="جستجوی درخواست‌ها..."
                      className="input-modern pr-10 w-48 xl:w-64 text-sm text-right persian-text"
                      dir="rtl"
                    />
                  </div>

                  {/* Start New Application Button */}
                  <Button 
                    onClick={handleStartNewApplication}
                    className="button-primary shadow-md hover:shadow-lg mobile-full-width md:w-auto persian-text"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 ml-1 md:ml-2" />
                    <span className="hidden sm:inline">ثبت درخواست جدید</span>
                    <span className="sm:hidden">درخواست جدید</span>
                  </Button>

                  {/* Notification Bell */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={handleNotificationClick}
                      className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                    >
                      <Bell className="w-5 h-5" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                    </button>

                    {/* Enhanced Notification Dropdown */}
                    {isNotificationOpen && (
                      <div className="absolute left-0 top-full mt-3 w-80 md:w-96 bg-card border border-border rounded-xl shadow-lg z-50 animate-slide-up">
                        <div className="p-3 md:p-4 border-b border-border">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs persian-text">
                              {mockNotifications.length} جدید
                            </Badge>
                            <h3 className="font-semibold text-foreground text-sm persian-heading">اعلان‌ها</h3>
                          </div>
                        </div>
                        <div className="max-h-80 md:max-h-96 overflow-y-auto">
                          {mockNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="p-3 md:p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-start space-x-3 space-x-reverse">
                                <div className="flex-1 space-y-1 text-right">
                                  <p className="text-sm text-foreground font-medium persian-text">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground persian-text">{notification.timestamp}</p>
                                </div>
                                <div className="flex-shrink-0 mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full persian-text"
                          >
                            مشاهده همه اعلان‌ها
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Avatar */}
                  <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200 shadow-md hover:shadow-lg" onClick={() => onNavigate('persian-my-profile')}>
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      ع
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 section-padding bg-muted/30">
            <div className="container-modern space-y-6">
              {/* Static Summary Cards with Simple Icons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: در حال بررسی - Blue Theme with Static Icon */}
                <Card className="card-modern relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-blue-50 hover:bg-blue-100 border border-gray-200">
                  <CardContent className="p-6">
                    {/* Thin vertical colored bar on RIGHT side for RTL */}
                    <div className="absolute top-0 right-0 w-1 h-full bg-blue-600"></div>
                    
                    {/* Layout: icon on LEFT, text on RIGHT */}
                    <div className="flex items-center justify-between">
                      {/* Simple Static Icon on LEFT side with number badge */}
                      <div className="relative">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                          <FileCheck className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        {/* Simple number badge on top-left corner */}
                        <div className="absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs font-bold text-white persian-text">۲</span>
                        </div>
                      </div>
                      
                      {/* Content stacked vertically and RIGHT-aligned */}
                      <div className="text-right space-y-3">
                        <div className="text-4xl md:text-5xl font-bold text-blue-900 persian-text" style={{ fontFamily: 'Vazirmatn, Inter, system-ui, sans-serif', fontWeight: '800' }}>
                          ۲
                        </div>
                        <div className="text-base font-semibold text-blue-800 persian-text">
                          در حال بررسی
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: نیازمند اقدام - Amber Theme with Static Icon */}
                <Card className="card-modern relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-amber-50 hover:bg-amber-100 border border-gray-200">
                  <CardContent className="p-6">
                    {/* Thin vertical colored bar on RIGHT side for RTL */}
                    <div className="absolute top-0 right-0 w-1 h-full bg-amber-600"></div>
                    
                    {/* Layout: icon on LEFT, text on RIGHT */}
                    <div className="flex items-center justify-between">
                      {/* Simple Static Icon on LEFT side with number badge */}
                      <div className="relative">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        {/* Simple number badge on top-left corner */}
                        <div className="absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs font-bold text-white persian-text">۱</span>
                        </div>
                      </div>
                      
                      {/* Content stacked vertically and RIGHT-aligned */}
                      <div className="text-right space-y-3">
                        <div className="text-4xl md:text-5xl font-bold text-amber-900 persian-text" style={{ fontFamily: 'Vazirmatn, Inter, system-ui, sans-serif', fontWeight: '800' }}>
                          ۱
                        </div>
                        <div className="text-base font-semibold text-amber-800 persian-text">
                          نیازمند اقدام
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: پیام‌های جدید - Purple Theme with Static Icon */}
                <Card className="card-modern relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-purple-50 hover:bg-purple-100 border border-gray-200">
                  <CardContent className="p-6">
                    {/* Thin vertical colored bar on RIGHT side for RTL */}
                    <div className="absolute top-0 right-0 w-1 h-full bg-purple-600"></div>
                    
                    {/* Layout: icon on LEFT, text on RIGHT */}
                    <div className="flex items-center justify-between">
                      {/* Simple Static Icon on LEFT side with number badge */}
                      <div className="relative">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                          <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        {/* Simple number badge on top-left corner */}
                        <div className="absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs font-bold text-white persian-text">۳</span>
                        </div>
                      </div>
                      
                      {/* Content stacked vertically and RIGHT-aligned */}
                      <div className="text-right space-y-3">
                        <div className="text-4xl md:text-5xl font-bold text-purple-900 persian-text" style={{ fontFamily: 'Vazirmatn, Inter, system-ui, sans-serif', fontWeight: '800' }}>
                          ۳
                        </div>
                        <div className="text-base font-semibold text-purple-800 persian-text">
                          پیام‌های جدید
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Recent Applications Table with Proper RTL Layout */}
              <Card className="card-modern">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    {/* Section title aligned to the LEFT */}
                    <div className="text-left">
                      <CardTitle className="text-lg md:text-xl persian-heading text-right">آخرین درخواست‌ها</CardTitle>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 persian-text text-right">
                        آخرین درخواست‌های ارسالی خود را پیگیری کنید
                      </p>
                    </div>
                    
                    {/* "مشاهده همه" button aligned to the RIGHT */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('persian-my-applications')}
                      className="text-primary border-primary hover:bg-primary hover:text-primary-foreground text-xs md:text-sm persian-text"
                    >
                      مشاهده همه
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Desktop Table - Mirrored RTL Structure */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border hover:bg-transparent">
                          {/* Column order RIGHT to LEFT: نوع درخواست, تاریخ ثبت, وضعیت, عملیات */}
                          <TableHead className="font-bold text-sm text-right persian-text">نوع درخواست</TableHead>
                          <TableHead className="font-bold text-sm text-right persian-text">تاریخ ثبت</TableHead>
                          <TableHead className="font-bold text-sm text-right persian-text">وضعیت</TableHead>
                          <TableHead className="font-bold text-sm text-right persian-text">عملیات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockApplications.map((app) => (
                          <TableRow 
                            key={app.id} 
                            className="hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                          >
                            {/* Data cells in RTL order: نوع درخواست, تاریخ ثبت, وضعیت, عملیات */}
                            <TableCell className="font-medium py-3 text-right text-sm persian-text">{app.type}</TableCell>
                            <TableCell className="text-muted-foreground py-3 text-right text-sm persian-text">
                              {app.submissionDate}
                            </TableCell>
                            <TableCell className="py-3 text-right">{getStatusBadge(app.status)}</TableCell>
                            <TableCell className="text-right py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewApplication(app.id)}
                                className="text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground text-xs persian-text"
                              >
                                مشاهده جزئیات
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card Layout */}
                  <div className="block md:hidden mobile-card-stack p-4">
                    {mockApplications.map((app) => (
                      <Card key={app.id} className="border border-border p-4 hover:shadow-md transition-all">
                        <div className="space-y-3 text-right">
                          <div className="flex items-center justify-between">
                            {getStatusBadge(app.status)}
                            <h4 className="font-medium text-sm persian-text">{app.type}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground persian-text">
                            تاریخ ثبت: {app.submissionDate}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewApplication(app.id)}
                            className="w-full text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground text-xs persian-text"
                          >
                            مشاهده جزئیات
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}