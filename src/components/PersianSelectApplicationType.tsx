import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { 
  ArrowRight, 
  ArrowLeft,
  GraduationCap, 
  Globe, 
  Plane, 
  BookOpen, 
  HelpCircle,
  FileText,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Home,
  User,
  FolderOpen,
  Headphones,
  Menu,
  X
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Separator } from './ui/separator';

interface PersianSelectApplicationTypeProps {
  onBack: () => void;
  onSelectType: (type: string) => void;
  onNavigate?: (page: string) => void;
  onLanguageSwitch?: (language: 'english' | 'persian') => void;
}

const applicationCategories = [
  {
    id: "admissions",
    title: "پذیرش و بورسیه",
    icon: GraduationCap,
    description: "درخواست پذیرش و فرصت‌های بورسیه تحصیلی",
    applications: [
      { 
        id: "persian-new-admission", 
        title: "درخواست پذیرش جدید",
        description: "درخواست پذیرش در مقاطع کارشناسی، ارشد و دکتری",
        icon: FileText
      },
      { 
        id: "persian-faculty-scholarship", 
        title: "ثبت نام بورسیه هیئت علمی",
        description: "ثبت نام در برنامه‌های بورسیه تحت حمایت هیئت علمی",
        icon: Award
      }
    ]
  },
  {
    id: "consular",
    title: "امور کنسولی",
    icon: Globe,
    description: "مدیریت مدارک ویزا و اقامت شما",
    applications: [
      { 
        id: "persian-visa-extension", 
        title: "تمدید روادید",
        description: "تمدید روادید دانشجویی فعلی",
        icon: Clock
      },
      { 
        id: "persian-residence-permit", 
        title: "درخواست/تمدید اقامت",
        description: "درخواست یا تمدید پروانه اقامت",
        icon: CheckCircle2
      },
      { 
        id: "persian-residence-transfer", 
        title: "انتقال اقامت به گذرنامه جدید",
        description: "انتقال پروانه اقامت به گذرنامه جدید",
        icon: Users
      }
    ]
  },
  {
    id: "travel",
    title: "امور تردد و خروج",
    icon: Plane,
    description: "درخواست مجوزهای سفر و انتقال دانشگاه",
    applications: [
      { 
        id: "persian-internal-exit", 
        title: "درخواست خروج داخلی",
        description: "اخذ مجوز انتقال به دانشگاه دیگر در داخل کشور",
        icon: Users
      },
      { 
        id: "persian-final-exit", 
        title: "درخواست خروج قطعی",
        description: "درخواست مجوز خروج قطعی از کشور",
        icon: Plane
      }
    ]
  },
  {
    id: "academic",
    title: "امور آموزشی",
    icon: BookOpen,
    description: "مدیریت مدارک تحصیلی و درخواست‌های ویژه",
    applications: [
      { 
        id: "persian-diploma-issuance", 
        title: "درخواست صدور دانشنامه",
        description: "درخواست صدور دانشنامه و ریز نمرات رسمی",
        icon: Award
      },
      { 
        id: "persian-document-authentication", 
        title: "درخواست تایید مدارک",
        description: "تایید و تصدیق مدارک تحصیلی",
        icon: CheckCircle2
      }
    ]
  },
  {
    id: "support",
    title: "پشتیبانی عمومی",
    icon: HelpCircle,
    description: "دریافت کمک و ارسال شکایات یا درخواست‌های پشتیبانی",
    applications: [
      { 
        id: "persian-support-ticket", 
        title: "ثبت تیکت پشتیبانی",
        description: "دریافت کمک برای مسائل فنی یا اداری",
        icon: HelpCircle
      },
      { 
        id: "persian-file-complaint", 
        title: "ثبت شکایت",
        description: "گزارش مشکلات یا ارسال شکایات رسمی",
        icon: FileText
      }
    ]
  }
];

const faqItems = [
  {
    question: "چه مداركي براي درخواست پذيرش جديد نياز دارم؟",
    answer: "گذرنامه، مدارك تحصيلي، گواهي‌نامه‌هاي زبان، انگيزه‌نامه و توصيه‌نامه‌ها مورد نياز است. ممكن است بسته به رشته شما مدارك اضافي درخواست شود."
  },
  {
    question: "پردازش تمديد ويزا چقدر طول مي‌كشد؟",
    answer: "پردازش استاندارد تمديد ويزا ۲-۴ هفته طول مي‌كشد. توصيه مي‌كنيم حداقل ۶ هفته قبل از انقضاي ويزاي فعلي‌تان درخواست دهيد."
  },
  {
    question: "آيا مي‌توانم وضعيت درخواستم را آنلاين پيگيري كنم؟",
    answer: "بله! پس از ارسال درخواست، شماره پيگيري دريافت خواهيد كرد. مي‌توانيد پيشرفت درخواست‌تان را در بخش 'درخواست‌هاي من' ببينيد."
  },
  {
    question: "اگر در انتخاب نوع درخواست مناسب به كمك نياز دارم چطور؟",
    answer: "از طريق مركز پشتيباني با تيم ما تماس بگيريد يا جلسه مشاوره با مشاوران تحصيلي ما رزرو كنيد."
  },
  {
    question: "آيا هزينه‌اي براي درخواست‌ها وجود دارد؟",
    answer: "هزينه‌ها بر اساس نوع درخواست متفاوت است. اكثر درخواست‌ها نياز به هزينه پردازش دارند كه قبل از ارسال نمايش داده مي‌شود."
  }
];

// Persian sidebar items - exact match with PersianStudentDashboard
const sidebarItems = [
  { id: 'dashboard', label: 'داشبورد', icon: Home, active: false },
  { id: 'new-application', label: 'درخواست جدید', icon: FileText, active: true },
  { id: 'my-applications', label: 'درخواست‌های من', icon: FolderOpen, active: false },
  { id: 'my-profile', label: 'پروفایل من', icon: User, active: false },
  { id: 'support', label: 'پشتیبانی', icon: HelpCircle, active: false }
];

export function PersianSelectApplicationType({ onBack, onSelectType, onNavigate, onLanguageSwitch }: PersianSelectApplicationTypeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open for desktop

  const handleApplicationClick = (applicationId: string) => {
    if (applicationId === 'persian-internal-exit') {
      onSelectType('persian-internal-exit-form');
    } else if (applicationId === 'persian-document-authentication') {
      onSelectType('persian-document-authentication-form');
    } else if (applicationId === 'persian-residence-transfer') {
      onSelectType('persian-residence-transfer-form');
    } else if (applicationId === 'persian-faculty-scholarship') {
      onSelectType('persian-faculty-scholarship');
    } else {
      onSelectType(applicationId);
    }
  };

  const handleSidebarClick = (itemId: string) => {
    // CRITICAL FIX: Use exact page names from App.tsx navigation mapping
    if (itemId === 'dashboard') {
      // Navigate to "داشبورد دانشجو" using exact App.tsx page name
      if (onNavigate) {
        onNavigate('persian-student-dashboard');
      } else {
        onBack(); // Fallback
      }
    } else if (itemId === 'my-applications') {
      // Navigate to "درخواست‌های من" using exact App.tsx page name
      if (onNavigate) {
        onNavigate('persian-my-applications');
      }
    } else if (itemId === 'my-profile') {
      // Navigate to "پروفایل من" using exact App.tsx page name
      if (onNavigate) {
        onNavigate('persian-my-profile');
      }
    } else if (itemId === 'support') {
      // Navigate to "مرکز پشتیبانی" using exact App.tsx page name
      if (onNavigate) {
        onNavigate('persian-support-center');
      }
    } else if (itemId === 'new-application') {
      // Already on this page - do nothing
    }
    // Note: Do NOT close sidebar after navigation - let user control this
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

              {/* User Profile Header - Desktop Only */}
              <div className="p-5 border-b border-sidebar-border hidden md:block">
                <div className="flex items-center space-x-12 space-x-reverse">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md flex-shrink-0 mr-3">
                    <span className="text-lg font-semibold text-primary-foreground persian-text">آ</span>
                  </div>
                  <div className="text-right flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-sidebar-foreground persian-heading truncate">آیلین ییلماز</h2>
                    <p className="text-sm text-sidebar-foreground/70 persian-text truncate">علوم کامپیوتر</p>
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
                    onClick={() => handleSidebarClick('support')}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Enhanced Header with Fixed Layout and Spacing */}
          <div className="bg-white border-b border-border shadow-sm">
            <div className="px-4 md:px-6 py-4 md:py-5">
              {/* FIX 1: Improved header layout - hamburger and back button closer together */}
              <div className="flex items-center justify-start space-x-1">
                {/* Desktop Sidebar Toggle Hamburger Icon */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="hidden md:block p-2 hover:bg-muted rounded-lg transition-all duration-200"
                  title="تغییر وضعیت نوار کناری"
                >
                  <Menu className="w-6 h-6 text-muted-foreground hover:text-foreground font-semibold" />
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

                {/* Back button - Very close spacing to hamburger (space-x-1) */}
                <button 
                  onClick={onBack}
                  className="flex items-center space-x-2 space-x-reverse text-primary hover:text-primary-600 hover:underline transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium persian-text">بازگشت به داشبورد</span>
                </button>
              </div>
              
              {/* FIX 2: Right-aligned subtitle with proper Persian typography */}
              <div className="space-y-2 text-right mt-6">
                <h1 className="text-3xl font-bold text-foreground persian-heading text-right">انتخاب نوع درخواست</h1>
                <p className="text-base text-muted-foreground persian-text text-right">
                  دسته‌ای که متناسب با نیازهای شما است را انتخاب کنید، سپس نوع درخواست مشخص را انتخاب نمایید.<br />
                  روی هر دسته کلیک کنید تا گزینه‌های موجود را ببینید.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area - Two Column Layout */}
          <div className="flex-1 p-6">
            <div className="container-modern">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Application Categories - Right Column (Mobile full width, Desktop 2/3) */}
                <div className="lg:col-span-2">
                  <Accordion type="single" collapsible className="space-y-4">
                    {applicationCategories.map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <AccordionItem 
                          key={category.id} 
                          value={category.id}
                          className="border border-border rounded-xl bg-card shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                            <div className="flex items-center space-x-6 space-x-reverse text-right w-full">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 mr-4 ml-4">
                                <CategoryIcon className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1 text-right">
                                <h3 className="text-xl font-semibold text-foreground mb-1 persian-heading text-right group-hover:text-primary-600 transition-colors">
                                  {category.title}
                                </h3>
                                <p className="text-base text-muted-foreground persian-text text-right leading-relaxed">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                              {category.applications.map((app) => {
                                const AppIcon = app.icon;
                                return (
                                  <div
                                    key={app.id}
                                    onClick={() => handleApplicationClick(app.id)}
                                    className="group cursor-pointer p-4 border-2 border-border rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 hover:from-primary-50/30 hover:to-primary-50/10 transform hover:scale-[1.02] flex flex-col justify-between min-h-[140px]"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-start space-x-2 space-x-reverse mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-200 shadow-sm">
                                          <AppIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-right flex flex-col">
                                          <h4 className="font-semibold text-foreground group-hover:text-primary-700 transition-colors leading-tight text-base persian-text text-right min-h-[2.75rem] flex items-start mb-1 pt-2.5">
                                            {app.title}
                                          </h4>
                                          <p className="text-sm text-muted-foreground leading-relaxed persian-text text-right">
                                            {app.description}
                                          </p>
                                        </div>
                                        <div className="flex-shrink-0 ml-3 pt-2.5">
                                          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary-600 transition-all duration-200 group-hover:translate-x-1" />
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Horizontally centered bottom-aligned button */}
                                    <div className="mt-auto pt-2 flex justify-center">
                                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary group-hover:shadow-sm transition-all duration-200 persian-text">
                                        شروع درخواست
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>

                {/* FAQ Section - Left Column (Mobile full width, Desktop 1/3) */}
                <div className="lg:col-span-1">
                  <Card className="bg-card border border-border shadow-sm sticky top-4">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2 space-x-reverse text-right persian-heading">
                        <span>سوالات متداول (FAQ)<sup className="text-xs mr-1"><HelpCircle className="w-3 h-3 text-primary inline" /></sup></span>
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground text-right persian-text">
                        سوالات رایج درباره درخواست‌ها و فرآیندها
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Accordion type="single" collapsible>
                        {faqItems.map((faq, index) => (
                          <AccordionItem key={index} value={`faq-${index}`} className="border-b border-border last:border-b-0">
                            <AccordionTrigger className="py-3 hover:no-underline text-right">
                              <span className="text-base font-medium text-foreground pr-2 text-right persian-text">
                                {faq.question}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3">
                              <p className="text-base text-muted-foreground leading-relaxed text-justify persian-text">
                                {faq.answer}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Page Footer */}
          <footer className="bg-white border-t border-border mt-auto">
            <div className="container-modern py-8">
              <div className="text-center space-y-4">
                {/* Footer Links */}
                <div className="flex flex-col md:flex-row md:justify-center items-center space-y-3 md:space-y-0 md:space-x-12">
                  <a href="#" className="text-primary hover:text-primary-600 transition-colors persian-text text-center">
                    سیاست حفظ حریم خصوصی
                  </a>
                  <a href="#" className="text-primary hover:text-primary-600 transition-colors persian-text text-center">
                    شرایط خدمات
                  </a>
                  <a href="#" className="text-primary hover:text-primary-600 transition-colors persian-text text-center">
                    تماس با ما
                  </a>
                </div>
                
                {/* Copyright Notice */}
                <div className="pt-4 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground persian-text text-center">
                    © 2025 سازمان امور دانشجویان. کلیه حقوق محفوظ است.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}