import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X, Mail, MessageSquare, Bell, Copy, Database, Globe, Settings } from 'lucide-react';

interface SystemSettingsProps {
  onNavigate: (page: string) => void;
}

const mockNotificationTemplates = [ /* ... mock data ... */ ];
const mockSystemLists = { nationalities: ['ایرانی', 'افغانستانی'], universities: ['دانشگاه تهران'], cities: ['تهران'], educationLevels: ['کارشناسی'], applicationStatuses: ['در حال بررسی'] };
const availablePlaceholders = [ { key: '[StudentName]', description: 'نام دانشجو' } ];

export function SystemSettings({ onNavigate }: SystemSettingsProps) {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedList, setSelectedList] = useState('nationalities');
  const [editingTemplate, setEditingTemplate] = useState({ subject: '', body: '' });
  const [showAddListItem, setShowAddListItem] = useState(false);
  const [newListItem, setNewListItem] = useState('');
  const [editingListItem, setEditingListItem] = useState<{ index: number; value: string } | null>(null);

  return (
    <div className="flex-1 section-padding">
      <div className="container-modern">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-white rounded-xl p-1 shadow-sm">
            <TabsTrigger value="templates" className="flex items-center space-x-2 space-x-reverse"><Bell className="w-4 h-4" /><span>قالب‌های اطلاع‌رسانی</span></TabsTrigger>
            <TabsTrigger value="lists" className="flex items-center space-x-2 space-x-reverse"><Database className="w-4 h-4" /><span>مدیریت لیست‌ها</span></TabsTrigger>
            <TabsTrigger value="general" className="flex items-center space-x-2 space-x-reverse"><Globe className="w-4 h-4" /><span>تنظیمات عمومی</span></TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="space-y-6">
            <Card className="card-modern">
              <CardHeader className="border-b"><CardTitle>قالب‌های اطلاع‌رسانی</CardTitle></CardHeader>
              <CardContent className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{/* ... Template Cards ... */}</div></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lists" className="space-y-6">
            <Card className="card-modern">
              <CardHeader className="border-b"><div className="flex justify-between items-center"><CardTitle>مدیریت لیست‌ها</CardTitle><Select value={selectedList} onValueChange={setSelectedList}><SelectTrigger className="w-64"><SelectValue /></SelectTrigger><SelectContent>{/* ... options ... */}</SelectContent></Select></div></CardHeader>
              <CardContent className="p-6"><div className="flex justify-between items-center mb-6"><h3>لیست انتخابی</h3><Button onClick={() => setShowAddListItem(true)}><Plus className="w-4 h-4 ml-2" />افزودن</Button></div><div className="border rounded-lg overflow-hidden"><table className="w-full text-right">{/* ... List Table ... */}</table></div></CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="general" className="space-y-6">
                <Card className="card-modern">
                  <CardHeader className="border-b border-border"><CardTitle className="flex items-center space-x-3 space-x-reverse"><div className="p-2 bg-purple-100 rounded-lg"><Globe className="w-5 h-5 text-purple-600" /></div><span className="text-xl font-bold text-foreground persian-heading">تنظیمات عمومی</span></CardTitle></CardHeader>
                  <CardContent className="p-6 text-center py-8"><Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg persian-heading text-foreground mb-2">تنظیمات عمومی</h3><p className="text-muted-foreground persian-body">این بخش در نسخه‌های آینده تکمیل خواهد شد</p></CardContent>
                </Card>
              </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}