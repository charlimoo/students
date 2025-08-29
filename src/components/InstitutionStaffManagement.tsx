// start of components/InstitutionStaffManagement.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Plus, Trash2, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '../api/apiService';

interface ApiStaffUser {
  id: number;
  email: string;
  full_name: string;
  universities: { name: string }[];
}

// NEW: Define a type for our form errors state
interface FormErrors {
  full_name?: string;
  email?: string;
  password?: string;
  non_field_errors?: string; // For general form errors
}

export function InstitutionStaffManagement() {
  const [staff, setStaff] = useState<ApiStaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '' });
  // NEW: State to hold validation errors for the form fields
  const [formErrors, setFormErrors] = useState<FormErrors>({});


  const fetchStaff = async () => {
    setIsLoading(true);
    setStaff([]); // Clear previous data
    try {
      const response = await apiService.get('/v1/institution-staff/');
      setStaff(response.data.results || response.data);
    } catch (error) {
      toast.error("خطا در بارگذاری لیست کارشناسان.", {
        description: "لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (field: keyof typeof newUser, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
    // NEW: Clear the error for a field when the user starts typing in it
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddStaff = async () => {
    // Clear previous errors before a new submission
    setFormErrors({});

    if (!newUser.full_name || !newUser.email || !newUser.password) {
      toast.error("لطفاً تمام فیلدها را پر کنید.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.post('/v1/institution-staff/', newUser);
      toast.success(`کارشناس ${newUser.full_name} با موفقیت اضافه شد.`);
      setShowAddDialog(false);
      setNewUser({ full_name: '', email: '', password: '' });
      fetchStaff();
    } catch (error: any) {
      // --- IMPROVED: Comprehensive error handling ---
      if (error.response && error.response.data) {
        // This is a validation error from the backend (e.g., 400 Bad Request)
        const backendErrors = error.response.data;
        const newErrors: FormErrors = {};
        for (const key in backendErrors) {
          // Store the first error message for each field
          if (Array.isArray(backendErrors[key]) && backendErrors[key].length > 0) {
            newErrors[key as keyof FormErrors] = backendErrors[key][0];
          }
        }
        setFormErrors(newErrors);
        toast.error("اطلاعات نامعتبر است", { description: "لطفاً خطاهای نمایش داده شده در فرم را برطرف کنید." });
      } else if (error.request) {
        // The request was made but no response was received (network error)
        toast.error("خطای شبکه", { description: "امکان برقراری ارتباط با سرور وجود ندارد. لطفاً اتصال خود را بررسی کنید." });
      } else {
        // Something else happened while setting up the request
        toast.error("خطای غیرمنتظره", { description: "یک خطای پیش‌بینی نشده رخ داد. لطفاً دوباره تلاش کنید." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteStaff = async (userId: number, name: string) => {
    if (window.confirm(`آیا از حذف کارشناس ${name} اطمینان دارید؟`)) {
      try {
        await apiService.delete(`/v1/institution-staff/${userId}/`);
        toast.success(`کارشناس ${name} حذف شد.`);
        setStaff(prevStaff => prevStaff.filter(user => user.id !== userId)); // Optimistic UI update
      } catch (error) {
        toast.error("خطا در حذف کارشناس.");
        fetchStaff(); // Refresh list on failure to ensure consistency
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8" dir="rtl">
      <Card className="card-modern">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Users className="w-6 h-6 text-primary" />
              <span>مدیریت کارشناسان دانشگاه</span>
            </CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 ml-2" /> افزودن کارشناس</Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                {/* --- FIX: WRAP DIALOG CONTENT IN A SINGLE DIV TO RESOLVE REF WARNING --- */}
                {/* This single <div> is now the only direct child, so React can attach the ref to it. */}
                <div> 
                  <DialogHeader className="text-right">
                      <DialogTitle>افزودن کارشناس جدید</DialogTitle>
                      <DialogDescription className="text-right">اطلاعات کارشناس جدید را برای ایجاد حساب کاربری وارد کنید.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="name">نام کامل</Label>
                      <Input id="name" value={newUser.full_name} onChange={e => handleInputChange('full_name', e.target.value)} />
                      {/* NEW: Display specific error for this field */}
                      {formErrors.full_name && <p className="text-sm text-red-500 mt-1">{formErrors.full_name}</p>}
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="email">ایمیل</Label>
                      <Input id="email" type="email" value={newUser.email} onChange={e => handleInputChange('email', e.target.value)} />
                      {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="password">رمز عبور</Label>
                      <Input id="password" type="password" value={newUser.password} onChange={e => handleInputChange('password', e.target.value)} />
                      {formErrors.password && <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>انصراف</Button>
                    <Button onClick={handleAddStaff} disabled={isSubmitting}>
                      {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin ml-2" />}
                      ایجاد کاربر
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام کامل</TableHead>
                  <TableHead className="text-right">ایمیل</TableHead>
                  <TableHead className="text-right">دانشگاه‌های مرتبط</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center p-8"><RefreshCw className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow> 
                ) : staff.length === 0 ? (
                  // NEW: Better empty state message
                  <TableRow><TableCell colSpan={4} className="text-center p-8 text-muted-foreground">هنوز کارشناسی اضافه نشده است.</TableCell></TableRow>
                ) : staff.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.universities.length > 0 
                          ? user.universities.map(u => <Badge key={u.name} variant="secondary">{u.name}</Badge>)
                          : <span className="text-xs text-muted-foreground">-</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-left"><Button variant="ghost" size="sm" onClick={() => handleDeleteStaff(user.id, user.full_name)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// end of components/InstitutionStaffManagement.tsx