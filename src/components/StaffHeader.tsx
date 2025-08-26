import React from 'react';
import { Button } from './ui/button';
import { Menu, Settings } from 'lucide-react';
import { Separator } from './ui/separator';

interface StaffHeaderProps {
  pageTitle: string;
  pageSubtitle: string;
  onToggleSidebar: () => void;
}

export function StaffHeader({ pageTitle, pageSubtitle, onToggleSidebar }: StaffHeaderProps) {
  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-30">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="p-2 hover:bg-muted rounded-lg transition-all duration-200 md:hidden"
              title="تغییر وضعیت نوار کناری"
            >
              <Menu className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Button>
            <Separator orientation="vertical" className="h-6 md:hidden" />
            <div className="space-y-1 text-right">
              <h1 className="text-2xl font-bold text-foreground persian-heading">{pageTitle}</h1>
              <p className="text-muted-foreground">{pageSubtitle}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 space-x-reverse">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground persian-caption">
              پنل مدیریت سیستم
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}