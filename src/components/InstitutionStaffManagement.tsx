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

export function InstitutionStaffManagement() {
  const [staff, setStaff] = useState<ApiStaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '' });

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get('/v1/institution-staff/');
      setStaff(response.data.results || response.data);
    } catch (error) {
      toast.error("خطا در بارگذاری لیست کارشناسان.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (field: keyof typeof newUser, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStaff = async () => {
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
      const errorMsg = error.response?.data?.email?.[0] || "خطا در افزودن کارشناس.";
      toast.error("عملیات ناموفق بود", { description: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteStaff = async (userId: number, name: string) => {
    if (window.confirm(`آیا از حذف کارشناس ${name} اطمینان دارید؟`)) {
      try {
        await apiService.delete(`/v1/institution-staff/${userId}/`);
        toast.success(`کارشناس ${name} حذف شد.`);
        fetchStaff();
      } catch (error) {
        toast.error("خطا در حذف کارشناس.");
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
                {/* --- FIX: WRAP DIALOG CONTENT IN A DIV TO RESOLVE REF WARNING --- */}
                <div>
                  <DialogHeader>
                      <DialogTitle>افزودن کارشناس جدید</DialogTitle>
                      <DialogDescription>این کاربر به دانشگاه‌های شما دسترسی خواهد داشت و نقش "کارشناس دانشگاه" را دریافت می‌کند.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label htmlFor="name">نام کامل</Label><Input id="name" value={newUser.full_name} onChange={e => handleInputChange('full_name', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="email">ایمیل</Label><Input id="email" type="email" value={newUser.email} onChange={e => handleInputChange('email', e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="password">رمز عبور</Label><Input id="password" type="password" value={newUser.password} onChange={e => handleInputChange('password', e.target.value)} /></div>
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
              <TableHeader><TableRow><TableHead>نام کامل</TableHead><TableHead>ایمیل</TableHead><TableHead>دانشگاه‌های مرتبط</TableHead><TableHead className="text-left">عملیات</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={4} className="text-center p-8"><RefreshCw className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow> 
                : staff.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><div className="flex flex-wrap gap-1">{user.universities.map(u => <Badge key={u.name} variant="secondary">{u.name}</Badge>)}</div></TableCell>
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