// start of components/StaffSidebar.tsx
import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  GraduationCap,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

interface StaffSidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onNavigate: (page: string) => void;
  onClose: () => void;
  mainTitle: string;
  subTitle: string;
  onLogout: () => void;
}

// --- FIX: Modified to show only the very first letter of the name ---
const getInitials = (name: string = '') => 
    name.charAt(0).toUpperCase() || '...';

export function StaffSidebar({ items, isOpen, onNavigate, onClose, subTitle, mainTitle, onLogout }: StaffSidebarProps) {
  const { user } = useAuth();
  
  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };
  
  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-sidebar border-l border-sidebar-border transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col sidebar-modern`}>
      <div className="flex flex-col h-full w-full">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </Button>
          <h2 className="font-semibold text-sidebar-foreground persian-heading">{mainTitle}</h2>
        </div>
        
        {/* Desktop Header */}
        <div className="p-6 border-b border-sidebar-border hidden md:block">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-sidebar-primary rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">{mainTitle}</h2>
              <p className="text-sm text-sidebar-foreground/70">{subTitle}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Standardized User Profile & Logout Section */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="bg-primary-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse gap-2">
                      <Avatar className="w-10 h-10">
                          <AvatarImage src={user?.profile_picture || undefined} alt={user?.full_name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user?.full_name)}
                          </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-primary text-sm">{user?.full_name || '...'}</h3>
                          <p className="text-xs text-primary/80 truncate">{user?.roles?.[0]?.name || 'Staff'}</p>
                      </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={onLogout}
                    title="خروج از حساب"
                  >
                      <LogOut className="w-5 h-5" />
                  </Button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// end of components/StaffSidebar.tsx