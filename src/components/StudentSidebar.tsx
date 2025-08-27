import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  User,
  HelpCircle,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

interface StudentSidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onNavigate: (page: string) => void;
  onClose: () => void;
}

export function StudentSidebar({ items, isOpen, onNavigate, onClose }: StudentSidebarProps) {
  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose(); // Close sidebar on mobile after navigation
  };
  
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
      {/* FIX: The entire component is now a flex column with h-full to enable sticky footer */}
      <div className="flex flex-col h-full">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="font-semibold text-sidebar-foreground">Student Portal</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Desktop Header */}
        <div className="p-5 border-b border-sidebar-border hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-sidebar-foreground">Student Portal</h2>
              <p className="text-xs text-sidebar-foreground/70">International Students</p>
            </div>
          </div>
        </div>

        {/* FIX: Navigation is now wrapped in a div that grows and scrolls independently */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-3 py-5 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                    item.active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>


      </div>
    </div>
  );
}