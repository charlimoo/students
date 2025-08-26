// start of App.tsx
// src/App.tsx
import React, { useState, useEffect } from 'react';

// --- Core & Authentication ---
import { useAuth } from './context/AuthContext';
import { ImpersonationBanner } from './components/ImpersonationBanner';
import { AppShell } from './components/AppShell';
import { RefreshCw } from 'lucide-react';

// --- Standalone Pages (Public) ---
import { LoginPage } from './components/LoginPage';
import { StudentRegistration } from './components/StudentRegistration';
import { InstitutionRegistration } from './components/InstitutionRegistration';
import { StaffRegistrationInfo } from './components/StaffRegistrationInfo';

// --- Applicant Panel Components ---
import { Dashboard } from './components/Dashboard';
import { SelectApplicationType } from './components/SelectApplicationType';
import { NewAdmissionApplication } from './components/NewAdmissionApplication';
import { MyApplications } from './components/MyApplications';
import { ApplicationStatus } from './components/ApplicationStatus';
import { MyProfile } from './components/MyProfile';
import { SupportCenter } from './components/SupportCenter';
import { TicketDetail } from './components/TicketDetail';

// --- Staff Panel Components (Persian) ---
import { StaffWorkbench } from './components/StaffWorkbench';
import { MyAllApplications } from './components/MyAllApplications';
import { CaseSearch } from './components/CaseSearch';
import { Reports } from './components/Reports';
import { StaffProfile } from './components/StaffProfile';
import { NewAdmissionDetailView } from './components/NewAdmissionDetailView';

// --- Admin Panel Components (Persian) ---
import { UserRoleManagement } from './components/UserRoleManagement';
import { AllApplications } from './components/AllApplications';
import { OrganizationalChart } from './components/OrganizationalChart';
import { PermitManagement } from './components/PermitManagement';
import { AlertManagement } from './components/AlertManagement';
import { SystemSettings } from './components/SystemSettings';

// --- Institution Panel Components (Persian) ---
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { PersianNewApplicationFormByInstitution } from './components/PersianNewApplicationFormByInstitution';
import { ApplicantDetailView } from './components/ApplicantDetailView';

// --- Icons for Sidebar Configurations ---
import {
  LayoutDashboard, FileText, FolderOpen, User, HelpCircle, ClipboardList,
  Search, BarChart3, Building2, Shield, Settings, AlertTriangle, Users as UsersIcon, Home
} from 'lucide-react';

// --- Sidebar Configurations ---
const studentSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'select-application-type', label: 'New Application', icon: FileText },
  { id: 'my-applications', label: 'My Applications', icon: FolderOpen },
  { id: 'my-profile', label: 'My Profile', icon: User },
  { id: 'support-center', label: 'Support', icon: HelpCircle }
];
const staffSidebarItems = [
  { id: 'staff-workbench', label: 'میزکار', icon: Home },
  { id: 'my-all-applications', label: 'همه درخواست‌ها', icon: ClipboardList },
  { id: 'case-search', label: 'جستجوی پرونده', icon: Search },
  { id: 'reports', label: 'گزارش‌ها', icon: BarChart3 },
  { id: 'staff-profile', label: 'پروفایل من', icon: User }
];
const adminSidebarItems = [
  { id: 'admin-users', label: 'مدیریت کاربران', icon: UsersIcon },
  { id: 'admin-all-apps', label: 'همه درخواست‌ها', icon: ClipboardList },
  { id: 'admin-org-chart', label: 'چارت سازمانی', icon: Building2 },
  { id: 'admin-permits', label: 'مدیریت مجوزها', icon: Shield },
  { id: 'admin-alerts', label: 'مدیریت هشدارها', icon: AlertTriangle },
  { id: 'admin-settings', label: 'تنظیمات سیستمی', icon: Settings }
];
const institutionSidebarItems = [
    { id: 'institution-dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'new-application-form', label: 'ثبت درخواست جدید', icon: FileText },
    { id: 'institution-reports', label: 'گزارش‌ها', icon: BarChart3 }, 
];

export default function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
        const roles = user.roles.map(r => r.name);
        if (roles.includes('HeadOfOrganization')) setCurrentPage('admin-users');
        else if (roles.includes('UniversityExpert')) setCurrentPage('staff-workbench');
        else if (roles.includes('Recruitment Institution')) setCurrentPage('institution-dashboard');
        else setCurrentPage('dashboard');
    }
  }, [isAuthenticated, user]);

  const navigate = (page: string, id?: string) => {
    setCurrentPage(page);
    setSelectedId(id || null);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const getActiveSidebarItems = (items: typeof studentSidebarItems) => 
    items.map(item => ({ ...item, active: item.id === currentPage }));

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <RefreshCw className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (currentPage) {
      case 'student-registration':
        return <StudentRegistration onBack={() => navigate('login')} onRegister={() => navigate('login')} />;
      case 'institution-registration':
        return <InstitutionRegistration onBack={() => navigate('login')} onSubmit={() => navigate('login')} />;
      case 'staff-registration-info':
        return <StaffRegistrationInfo onBack={() => navigate('login')} />;
      case 'login':
      default:
        return <LoginPage 
                  onNavigate={navigate}
                  onSignUp={() => navigate('student-registration')}
                  onInstitutionSignUp={() => navigate('institution-registration')}
                  onStaffSignUp={() => navigate('staff-registration-info')}
                />;
    }
  }

  const renderAuthenticatedApp = () => {
    const roles = user?.roles.map(r => r.name) || [];
    let primaryRole = 'applicant';
    if (roles.includes('HeadOfOrganization')) primaryRole = 'admin';
    else if (roles.includes('UniversityExpert')) primaryRole = 'staff';
    else if (roles.includes('Recruitment Institution')) primaryRole = 'institution';

    if (primaryRole === 'applicant') {
        const studentPages: { [key: string]: React.ReactNode } = {
            'dashboard': <Dashboard onNavigate={navigate} onViewApplication={(id) => navigate('application-status', id)} />,
            'select-application-type': <SelectApplicationType onBack={() => navigate('dashboard')} onSelectType={(type) => navigate('new-admission-application', type)} />,
            'new-admission-application': <NewAdmissionApplication onBackToDashboard={() => navigate('dashboard')} onNavigate={navigate} applicationId={selectedId} />,
            'my-applications': <MyApplications onBack={() => navigate('dashboard')} onViewApplication={(id) => navigate('application-status', id)} />,
            'application-status': <ApplicationStatus applicationId={selectedId} onBack={() => navigate('my-applications')} onNavigate={navigate} />,
            'my-profile': <MyProfile onBack={() => navigate('dashboard')} onLogOut={handleLogout} />,
            'support-center': <SupportCenter onBack={() => navigate('dashboard')} onViewTicket={(ticketId) => navigate('ticket-detail', ticketId)} />,
            'ticket-detail': <TicketDetail ticketId={selectedId} onBack={() => navigate('support-center')} />,
        };
        const pageContent = studentPages[currentPage] || studentPages['dashboard'];
        const pageInfo = studentSidebarItems.find(i => i.id === currentPage) || { label: 'Student Portal' };
        return <AppShell role="student" pageTitle={pageInfo.label} sidebarItems={getActiveSidebarItems(studentSidebarItems)} onNavigate={navigate} onLogout={handleLogout}>{pageContent}</AppShell>;
    }
    
    if (primaryRole === 'staff') {
        const staffPages: { [key: string]: React.ReactNode } = {
            'staff-workbench': <StaffWorkbench onNavigate={navigate} onViewCase={(caseId) => navigate('case-detail', caseId)} />,
            'case-detail': <NewAdmissionDetailView applicationId={selectedId || ''} onBack={() => navigate('staff-workbench')} backLabel="بازگشت به میزکار" />,
            'my-all-applications': <MyAllApplications onNavigate={navigate} onViewCase={(caseId) => navigate('case-detail-from-all', caseId)} />,
            'case-detail-from-all': <NewAdmissionDetailView applicationId={selectedId || ''} onBack={() => navigate('my-all-applications')} backLabel="بازگشت به همه درخواست‌ها" />,
            'case-search': <CaseSearch onNavigate={navigate} onViewCase={(caseId) => navigate('case-detail', caseId)} />,
            'reports': <Reports onNavigate={navigate} />,
            'staff-profile': <StaffProfile onNavigate={navigate} />,
        };
        const pageContent = staffPages[currentPage] || staffPages['staff-workbench'];
        const pageInfo = staffSidebarItems.find(i => i.id === currentPage) || { label: 'پنل کارشناسان' };
        return <AppShell role="staff" pageTitle={pageInfo.label} sidebarItems={getActiveSidebarItems(staffSidebarItems)} onNavigate={navigate} onLogout={handleLogout}>{pageContent}</AppShell>;
    }

    if (primaryRole === 'admin') {
        const adminPages: { [key: string]: React.ReactNode } = {
            'admin-users': <UserRoleManagement onNavigate={navigate} />,
            'admin-all-apps': <AllApplications onViewApplication={(id) => navigate('admin-case-detail', id)} />,
            'admin-case-detail': <NewAdmissionDetailView applicationId={selectedId || ''} onBack={() => navigate('admin-all-apps')} backLabel="بازگشت به همه درخواست‌ها"/>,
            'admin-org-chart': <OrganizationalChart onNavigate={navigate} />,
            'admin-permits': <PermitManagement onNavigate={navigate} />,
            'admin-alerts': <AlertManagement onNavigate={navigate} />,
            'admin-settings': <SystemSettings onNavigate={navigate} />,
        };
        const pageContent = adminPages[currentPage] || adminPages['admin-users'];
        const pageInfo = adminSidebarItems.find(i => i.id === currentPage) || { label: 'پنل مدیریت' };
        return <AppShell role="admin" pageTitle={pageInfo.label} sidebarItems={getActiveSidebarItems(adminSidebarItems)} onNavigate={navigate} onLogout={handleLogout}>{pageContent}</AppShell>;
    }

    if (primaryRole === 'institution') {
        const institutionPages: { [key: string]: React.ReactNode } = {
            'institution-dashboard': <InstitutionDashboard onNavigate={navigate} />,
            'new-application-form': <PersianNewApplicationFormByInstitution onBack={() => navigate('institution-dashboard')} onSubmit={() => navigate('institution-dashboard')} onSaveDraft={() => navigate('institution-dashboard')} />,
            'applicant-detail': <ApplicantDetailView applicantId={selectedId} onBack={() => navigate('institution-dashboard')} />,
            'institution-reports': <Reports onNavigate={navigate} />,
        };
        const pageContent = institutionPages[currentPage] || institutionPages['institution-dashboard'];
        const pageInfo = institutionSidebarItems.find(i => i.id === currentPage) || { label: 'پنل موسسه' };
        return <AppShell role="institution" pageTitle={pageInfo.label} sidebarItems={getActiveSidebarItems(institutionSidebarItems)} onNavigate={navigate} onLogout={handleLogout}>{pageContent}</AppShell>;
    }

    return <div>Error: Unknown user role or page.</div>;
  };

  return (
    <div className="min-h-screen bg-background">
      <ImpersonationBanner />
      {renderAuthenticatedApp()}
    </div>
  );
}