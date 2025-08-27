// start of components/AppShell.tsx
// src/components/AppShell.tsx
import React, { useState } from 'react';
import { StudentSidebar } from './StudentSidebar';
import { StaffSidebar } from './StaffSidebar';
import { StudentHeader } from './StudentHeader';
import { StaffHeader } from './StaffHeader';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

interface AppShellProps {
  role: 'student' | 'staff' | 'institution' | 'admin';
  pageTitle: string;
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
  onNavigate: (page: string, id?: string) => void;
  onLogout: () => void; // This prop is now required for all roles
}

export function AppShell({ role, pageTitle, sidebarItems, children, onNavigate, onLogout }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isRTL = role !== 'student';
  
  // Conditionally render the correct sidebar and header with their required props
  const SidebarComponent = () => {
    if (isRTL) {
      // StaffSidebar and InstitutionSidebar require these props
      return (
        <StaffSidebar 
          items={sidebarItems} 
          onNavigate={onNavigate} 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          onLogout={onLogout} // Correctly passed here
          mainTitle={role === 'institution' ? "پنل موسسه" : "پنل کارشناسان"}
          subTitle="پورتال جامع دانشجویی"
        />
      );
    }
    // StudentSidebar has a simpler prop structure and a different logout button location
    return (
      <StudentSidebar 
        items={sidebarItems} 
        onNavigate={onNavigate} 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
    );
  };

  const HeaderComponent = () => {
    if (isRTL) {
      // StaffHeader requires pageSubtitle
      return (
        <StaffHeader 
          pageTitle={pageTitle}
          pageSubtitle="مدیریت درخواست‌های دانشجویان بین‌المللی"
          onToggleSidebar={toggleSidebar}
        />
      );
    }
    // StudentHeader has different props
    return (
      <StudentHeader 
        pageTitle={pageTitle}
        onToggleSidebar={toggleSidebar}
        onNewApplication={() => onNavigate('select-application-type')}
        onProfile={() => onNavigate('my-profile')}
      />
    );
  };


  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`flex min-h-screen bg-muted/30 ${isRTL ? 'persian-text' : ''}`}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <SidebarComponent />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderComponent />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
// end of components/AppShell.tsx