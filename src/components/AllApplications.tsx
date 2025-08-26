// start of frontend/src/components/AllApplications.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Eye, FileText, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'sonner';

// Type for the application data from the API list view
interface ApiApplication {
  tracking_code: string;
  application_type: string;
  created_at: string;
  status: 'PENDING_REVIEW' | 'PENDING_CORRECTION' | 'APPROVED' | 'REJECTED';
  full_name: string;
  applicant: {
    email: string;
    full_name: string;
  };
}

// Map backend status to frontend display styles
const statusMap: { [key: string]: { label: string; badge: React.ReactNode } } = {
  APPROVED: { label: 'Approved', badge: <Badge className="bg-success/10 text-success border-success/20"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge> },
  REJECTED: { label: 'Rejected', badge: <Badge className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge> },
  PENDING_REVIEW: { label: 'Under Review', badge: <Badge className="bg-primary/10 text-primary border-primary/20"><Clock className="w-3 h-3 mr-1" />Under Review</Badge> },
  PENDING_CORRECTION: { label: 'Requires Action', badge: <Badge className="bg-warning/10 text-warning border-warning/20"><AlertTriangle className="w-3 h-3 mr-1" />Requires Action</Badge> },
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

interface AllApplicationsProps {
    onViewApplication: (trackingCode: string) => void;
}

export function AllApplications({ onViewApplication }: AllApplicationsProps) {
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add more state for filtering and pagination as needed

  useEffect(() => {
    const fetchAllApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.get('/v1/applications/all/');
        setApplications(response.data.results || response.data); // Handle paginated or non-paginated response
      } catch (err) {
        console.error("Failed to fetch all applications:", err);
        setError("Could not load applications. Please try again later.");
        toast.error("Failed to load applications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllApplications();
  }, []); // Dependency array would include filters if they existed

  return (
    <div className="flex-1 section-padding bg-muted/30">
        <div className="container-modern space-y-8">
            <Card className="card-modern">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-6 h-6 text-primary" />
                        <span className="text-2xl">All System Applications</span>
                    </CardTitle>
                    <p className="text-muted-foreground">A complete overview of every application submitted to the system.</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tracking Code</TableHead>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Application Type</TableHead>
                                    <TableHead>Submission Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-12">Loading applications...</TableCell></TableRow>
                                ) : error ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-destructive">{error}</TableCell></TableRow>
                                ) : applications.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-12">No applications found in the system.</TableCell></TableRow>
                                ) : (
                                    applications.map((app) => (
                                        <TableRow key={app.tracking_code}>
                                            <TableCell className="font-mono text-primary">{app.tracking_code}</TableCell>
                                            <TableCell className="font-medium">{app.full_name || app.applicant.full_name}</TableCell>
                                            <TableCell>{app.application_type}</TableCell>
                                            <TableCell>{formatDate(app.created_at)}</TableCell>
                                            <TableCell>{statusMap[app.status]?.badge || <Badge variant="secondary">{app.status}</Badge>}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={() => onViewApplication(app.tracking_code)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
// end of frontend/src/components/AllApplications.tsx