// start of frontend/src/components/MyProfile.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Shield, Bell, Save, Edit3, LogOut, Camera, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';

interface MyProfileProps {
  onBack: () => void;
  onLogOut: () => void;
}

// State for profile data
interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  profilePicture: string | null;
}
// State for password form
interface PasswordForm {
  old_password: string;
  new_password: string;
  new_password2: string;
}

export function MyProfile({ onBack, onLogOut }: MyProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '', email: '', phone: '', profilePicture: null
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    old_password: '', new_password: '', new_password2: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.get('/v1/me/profile/');
        setProfileData({
          fullName: response.data.full_name || '',
          email: user?.email || '', // Email is not on profile endpoint, get from auth context
          phone: response.data.phone_number || '',
          profilePicture: response.data.profile_picture || null,
        });
      } catch (error) {
        toast.error("Could not load your profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const payload = new FormData();
      payload.append('full_name', profileData.fullName);
      payload.append('phone_number', profileData.phone);
      // Handle file upload if a new image was selected
      // For simplicity, we'll assume a file state `newProfileImage: File | null`
      // if (newProfileImage) { payload.append('profile_picture', newProfileImage); }

      await apiService.patch('/v1/me/profile/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password2) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      await apiService.put('/v1/me/profile/change-password/', passwordForm);
      toast.success("Password changed successfully!");
      setPasswordForm({ old_password: '', new_password: '', new_password2: '' });
    } catch (error: any) {
      toast.error("Password Change Failed", {
        description: error.response?.data?.old_password?.[0] || "Please check your current password."
      });
    }
  };

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="container-modern py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <Button onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}>
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="card-modern sticky top-6">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-6">
                  <Avatar className="w-32 h-32 border-4"><AvatarImage src={profileData.profilePicture || undefined} /><AvatarFallback className="text-4xl">{profileData.fullName.charAt(0)}</AvatarFallback></Avatar>
                  {isEditing && <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer"><Camera className="w-4 h-4 text-primary-foreground" /><input type="file" accept="image/*" className="hidden" /></label>}
                </div>
                <h3 className="text-xl font-bold">{profileData.fullName}</h3>
                <p className="text-sm text-muted-foreground mt-2">{profileData.email}</p>
                <div className="mt-6"><Button onClick={onLogOut} variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"><LogOut className="w-4 h-4 mr-2" />Log Out</Button></div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal"><User className="w-4 h-4 mr-2" />Personal</TabsTrigger>
                <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" />Security</TabsTrigger>
                <TabsTrigger value="preferences"><Bell className="w-4 h-4 mr-2" />Preferences</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="mt-6">
                <Card className="card-modern"><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Full Name</Label><Input value={profileData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} disabled={!isEditing} /></div>
                        <div className="space-y-2"><Label>Email</Label><Input value={profileData.email} disabled className="bg-muted" /></div>
                        <div className="space-y-2"><Label>Phone Number</Label><Input value={profileData.phone} onChange={e => handleInputChange('phone', e.target.value)} disabled={!isEditing} /></div>
                    </div>
                </CardContent></Card>
              </TabsContent>
              <TabsContent value="security" className="mt-6">
                <Card className="card-modern"><CardHeader><CardTitle>Security Settings</CardTitle></CardHeader><CardContent className="space-y-6">
                    <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={passwordForm.old_password} onChange={e => handlePasswordChange('old_password', e.target.value)} /></div>
                    <div className="space-y-2"><Label>New Password</Label><Input type="password" value={passwordForm.new_password} onChange={e => handlePasswordChange('new_password', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={passwordForm.new_password2} onChange={e => handlePasswordChange('new_password2', e.target.value)} /></div>
                    <Button onClick={handleChangePassword}>Update Password</Button>
                </CardContent></Card>
              </TabsContent>
              <TabsContent value="preferences" className="mt-6">
                 <Card className="card-modern"><CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader><CardContent><p>Notification settings will be available in a future update.</p></CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
// end of frontend/src/components/MyProfile.tsx