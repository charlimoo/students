import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Building2,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Download,
  Settings,
  Bell,
  Search,
  Plus,
  Eye,
  BarChart3,
  Globe,
  UserPlus,
  Mail,
  Phone
} from 'lucide-react';

interface RecruitingInstitutionDashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

// Mock data for the dashboard
const dashboardStats = {
  totalApplicants: 156,
  pendingReview: 23,
  approved: 89,
  requiresAction: 12,
  newThisWeek: 18
};

const recentApplicants = [
  {
    id: 'APP-2024-001',
    name: 'Ahmad Hassan',
    nationality: 'Syria',
    program: 'Computer Science - Masters',
    submissionDate: '2024-01-15',
    status: 'pending-review'
  },
  {
    id: 'APP-2024-002',
    name: 'Fatima Al-Zahra',
    nationality: 'Iraq',
    program: 'Engineering - Bachelor',
    submissionDate: '2024-01-14',
    status: 'approved'
  },
  {
    id: 'APP-2024-003',
    name: 'Mohammed Abdullah',
    nationality: 'Jordan',
    program: 'Business Administration - Masters',
    submissionDate: '2024-01-12',
    status: 'requires-action'
  },
  {
    id: 'APP-2024-004',
    name: 'Layla Ibrahim',
    nationality: 'Lebanon',
    program: 'Medicine - Bachelor',
    submissionDate: '2024-01-10',
    status: 'approved'
  }
];

const upcomingDeadlines = [
  {
    title: 'Fall 2024 Application Review',
    date: '2024-02-15',
    type: 'deadline',
    priority: 'high'
  },
  {
    title: 'Document Verification Period',
    date: '2024-02-10',
    type: 'review',
    priority: 'medium'
  },
  {
    title: 'Interview Scheduling',
    date: '2024-02-20',
    type: 'meeting',
    priority: 'low'
  }
];

export function RecruitingInstitutionDashboard({ onNavigate }: RecruitingInstitutionDashboardProps) {
  const [notifications] = useState(5);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'approved': {
        label: 'Approved',
        className: 'status-badge-approved'
      },
      'pending-review': {
        label: 'Pending Review',
        className: 'status-badge-review'
      },
      'requires-action': {
        label: 'Requires Action',
        className: 'status-badge-pending'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: 'bg-muted text-muted-foreground'
    };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 sidebar-modern min-h-screen">
          <div className="p-6">
            {/* Institution Logo and Name */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">International Academy</h2>
                <p className="text-sm text-muted-foreground">Recruiting Portal</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => onNavigate('my-applicants')}
              >
                <Users className="w-4 h-4 mr-3" />
                My Applicants
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <FileText className="w-4 h-4 mr-3" />
                Application Forms
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Calendar className="w-4 h-4 mr-3" />
                Scheduling
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Download className="w-4 h-4 mr-3" />
                Reports
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm text-primary-foreground font-medium">IA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Institution Admin
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@intacademy.edu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container-modern section-padding">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl text-foreground mb-2">Institution Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your student applications.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>

                {/* Quick Actions */}
                <Button 
                  className="flex items-center space-x-2"
                  onClick={() => onNavigate('new-application-form')}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Submit New Application</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="card-modern">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {dashboardStats.totalApplicants}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Applicants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {dashboardStats.pendingReview}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {dashboardStats.approved}
                      </p>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {dashboardStats.requiresAction}
                      </p>
                      <p className="text-sm text-muted-foreground">Requires Action</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-secondary-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {dashboardStats.newThisWeek}
                      </p>
                      <p className="text-sm text-muted-foreground">New This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Applicants */}
              <div className="lg:col-span-2">
                <Card className="card-modern">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span>Recent Applicants</span>
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onNavigate('my-applicants')}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplicants.map((applicant) => (
                        <div key={applicant.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {applicant.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{applicant.name}</p>
                              <p className="text-sm text-muted-foreground">{applicant.program}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Globe className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{applicant.nationality}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{formatDate(applicant.submissionDate)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(applicant.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate('application-status', applicant.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Upcoming Deadlines */}
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>Upcoming Deadlines</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            deadline.priority === 'high' ? 'bg-destructive' :
                            deadline.priority === 'medium' ? 'bg-warning' : 'bg-success'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{deadline.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(deadline.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-primary" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-3" />
                      Search Applications
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-3" />
                      Export Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-3" />
                      Send Notifications
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-3" />
                      Schedule Interviews
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}