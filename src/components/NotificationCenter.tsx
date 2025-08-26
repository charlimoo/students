import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileCheck,
  UserPlus,
  CreditCard,
  Calendar,
  Mail,
  Clock,
  Filter,
  CheckCheck,
  GraduationCap,
  Settings,
  Info
} from 'lucide-react';

interface NotificationCenterProps {
  onBack: () => void;
}

// Mock notifications data with more variety
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Application Approved',
    message: 'Your visa extension application has been approved and is ready for collection.',
    timestamp: '2 hours ago',
    isRead: false,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    type: 'warning',
    title: 'Documents Required',
    message: 'Additional documents required for your Work Permit application. Please submit within 7 days.',
    timestamp: '5 hours ago',
    isRead: false,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: 3,
    type: 'info',
    title: 'New Message',
    message: 'You have received a new message from the Student Affairs office regarding your enrollment.',
    timestamp: '1 day ago',
    isRead: true,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'info',
    title: 'Application Update',
    message: 'Your Study Permit application is currently under review. Expected processing time: 2-3 weeks.',
    timestamp: '2 days ago',
    isRead: true,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 5,
    type: 'success',
    title: 'Payment Confirmed',
    message: 'Payment confirmation received for your application processing fee ($150.00).',
    timestamp: '3 days ago',
    isRead: true,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 6,
    type: 'info',
    title: 'Account Created',
    message: 'Welcome to the International Student Portal! Your account has been successfully created.',
    timestamp: '5 days ago',
    isRead: true,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 7,
    type: 'warning',
    title: 'Interview Scheduled',
    message: 'Your visa interview has been scheduled for March 15th at 2:00 PM. Please arrive 30 minutes early.',
    timestamp: '1 week ago',
    isRead: false,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 8,
    type: 'success',
    title: 'Document Verified',
    message: 'Your academic transcripts have been successfully verified and accepted.',
    timestamp: '1 week ago',
    isRead: true,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  {
    id: 9,
    type: 'info',
    title: 'System Maintenance',
    message: 'The portal will undergo scheduled maintenance on March 10th from 2:00 AM to 4:00 AM EST.',
    timestamp: '2 weeks ago',
    isRead: true,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: 10,
    type: 'warning',
    title: 'Application Deadline',
    message: 'Reminder: The deadline for Fall 2024 applications is approaching (April 30th).',
    timestamp: '2 weeks ago',
    isRead: true,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }
];

export function NotificationCenter({ onBack }: NotificationCenterProps) {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (!isRead) {
      switch (type) {
        case 'success':
          return 'bg-success-50 border-success/20';
        case 'warning':
          return 'bg-warning-50 border-warning/20';
        case 'info':
          return 'bg-primary-50 border-primary/20';
        default:
          return 'bg-muted/50 border-border';
      }
    }
    return 'bg-white border-border';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.isRead;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // Less than a week
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const weeks = Math.floor(diffInHours / 168);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">All Notifications</h1>
                <p className="text-muted-foreground">
                  Stay updated with your application status and important messages
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="text-sm">
                {unreadCount} unread
              </Badge>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Notification Center
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 section-padding">
        <div className="container-modern">
          <div className="space-y-6">
            {/* Filters and Actions */}
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Filter by:</span>
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center space-x-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark All as Read</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card className="card-modern">
                  <CardContent className="p-12 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Bell className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">No notifications found</h3>
                        <p className="text-muted-foreground">
                          {filter === 'unread' 
                            ? "You're all caught up! No unread notifications." 
                            : "You don't have any notifications yet."
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`card-modern transition-all duration-200 hover:shadow-md cursor-pointer ${getNotificationBgColor(notification.type, notification.isRead)}`}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                              </div>
                              <p className={`text-sm leading-relaxed ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.message}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(notification.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More Button (if needed) */}
            {filteredNotifications.length > 0 && (
              <div className="text-center pt-6">
                <Button variant="outline" className="px-8">
                  Load More Notifications
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}