// start of components/StaffProfile.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  User,
  Shield,
  Bell,
  Edit3,
  LogOut,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';

interface StaffProfileProps {
  onNavigate: (page: string) => void;
}

interface ProfileInfo {
  fullName: string;
  role: string;
  department: string;
  phoneNumber: string;
  email: string;
  profilePicture: string | null;
}

// --- FIX: Modified to show only the very first letter of the name ---
const getInitials = (name: string = '') => 
    name.charAt(0).toUpperCase() || '...';

export function StaffProfile({ onNavigate }: StaffProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('user-info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<ProfileInfo>({
    fullName: user?.full_name || '',
    role: user?.roles?.[0]?.name || 'کارشناس',
    department: user?.organization_unit || 'واحد سازمانی نامشخص',
    email: user?.email || '',
    phoneNumber: user?.phone_number || '',
    profilePicture: user?.profile_picture || null,
  });
  
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', new_password2: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await apiService.get('/v1/me/profile/');
        setUserInfo(prev => ({
            ...prev,
            fullName: response.data.full_name || prev.fullName,
            phoneNumber: response.data.phone_number || '',
            profilePicture: response.data.profile_picture || prev.profilePicture,
        }));
      } catch (error) {
        toast.error("خطا در بارگذاری اطلاعات پروفایل.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (field: keyof ProfileInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();
      payload.append('phone_number', userInfo.phoneNumber);
      
      await apiService.patch('/v1/me/profile/', payload);
      toast.success('تغییرات با موفقیت ذخیره شد');
      setIsEditing(false);
    } catch (error) {
      toast.error('خطا در ذخیره سازی تغییرات.');
    }
  };
  
  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password2) {
      toast.error("رمزهای عبور جدید با هم مطابقت ندارند.");
      return;
    }
    try {
      await apiService.put('/v1/me/profile/change-password/', passwordForm);
      toast.success("رمز عبور با موفقیت تغییر کرد!");
      setPasswordForm({ old_password: '', new_password: '', new_password2: '' });
    } catch (error: any) {
      toast.error("تغییر رمز عبور ناموفق بود", {
        description: error.response?.data?.old_password?.[0] || "لطفا رمز عبور فعلی خود را بررسی کنید."
      });
    }
  };

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground persian-heading">پروفایل کاربری و تنظیمات</h1>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
          <Edit3 className="w-4 h-4 ml-2" />
          {isEditing ? 'ذخیره تغییرات' : 'ویرایش پروفایل'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="card-modern sticky top-6">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-6">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                    <AvatarImage src={userInfo.profilePicture || undefined} alt={userInfo.fullName}/>
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                        {getInitials(userInfo.fullName)}
                    </AvatarFallback>
                </Avatar>
                {isEditing && <label className="absolute bottom-0 left-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer"><Camera className="w-4 h-4" /><input type="file" className="hidden" accept="image/*"/></label>}
              </div>
              <h3 className="text-xl font-bold">{userInfo.fullName}</h3>
              <Badge className="mt-2">{userInfo.role}</Badge>
              <p className="text-sm text-muted-foreground mt-2">{userInfo.department}</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
            <TabsList className="grid w-full grid-cols-3 bg-card border rounded-lg p-1">
              <TabsTrigger value="user-info" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"><User className="w-4 h-4 ml-2" />اطلاعات کاربری</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"><Shield className="w-4 h-4 ml-2" />امنیت</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"><Bell className="w-4 h-4 ml-2" />اعلان‌ها</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user-info" className="mt-6">
              <Card className="card-modern">
                <CardHeader><CardTitle>اطلاعات شخصی</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-right"><Label>نام کامل</Label><Input value={userInfo.fullName} disabled className="bg-muted"/></div>
                    <div className="space-y-2 text-right"><Label>نقش سازمانی</Label><Input value={userInfo.role} disabled className="bg-muted"/></div>
                    <div className="space-y-2 text-right"><Label>ایمیل</Label><Input value={userInfo.email} disabled className="bg-muted"/></div>
                    <div className="space-y-2 text-right"><Label>شماره تماس</Label><Input value={userInfo.phoneNumber} onChange={e => handleInputChange('phoneNumber', e.target.value)} disabled={!isEditing} /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <Card className="card-modern">
                <CardHeader><CardTitle>تغییر رمز عبور</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-right"><Label>رمز عبور فعلی</Label><Input type="password" value={passwordForm.old_password} onChange={e => handlePasswordChange('old_password', e.target.value)} /></div>
                  <div className="space-y-2 text-right"><Label>رمز عبور جدید</Label><Input type="password" value={passwordForm.new_password} onChange={e => handlePasswordChange('new_password', e.target.value)} /></div>
                  <div className="space-y-2 text-right"><Label>تکرار رمز عبور جدید</Label><Input type="password" value={passwordForm.new_password2} onChange={e => handlePasswordChange('new_password2', e.target.value)} /></div>
                  <div className="flex justify-end"><Button onClick={handleChangePassword}>تغییر رمز</Button></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
               <Card className="card-modern">
                <CardHeader><CardTitle>تنظیمات اعلان‌ها</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="text-right">
                      <h4 className="font-medium">اعلان‌های ایمیل</h4>
                      <p className="text-sm text-muted-foreground">دریافت بروزرسانی وضعیت پرونده‌ها از طریق ایمیل</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
// end of components/StaffProfile.tsx