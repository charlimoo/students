import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Menu,
  Search,
  Plus
} from 'lucide-react';

interface StudentHeaderProps {
  pageTitle: string;
  onToggleSidebar: () => void;
  onNewApplication: () => void;
  onProfile: () => void;
}

export function StudentHeader({ pageTitle, onToggleSidebar, onNewApplication, onProfile }: StudentHeaderProps) {
  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-30">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="p-2 hover:bg-muted rounded-lg transition-all duration-200 md:hidden"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{pageTitle}</h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden lg:block">
              {/* FIX: Search icon is now on the left for LTR layout */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {/* FIX: Padding is now on the left (pl-10) */}
              <input
                type="text"
                placeholder="Search applications..."
                className="input-modern pl-10 w-48 xl:w-64 text-sm"
              />
            </div>

            <Button onClick={onNewApplication} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Application</span>
              <span className="sm:hidden">New</span>
            </Button>

            {/* FIX: Notification Bell has been completely removed */}

            <Avatar onClick={onProfile} className="w-10 h-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">A</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}