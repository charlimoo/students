import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Activity,
  PieChart as PieChartIcon,
  BarChart2,
  Filter,
  RefreshCw
} from 'lucide-react';

interface ReportsProps {
  onNavigate: (page: string) => void;
}

const mockDataByRange = {
  'last-month': { applicationTypes: [ { name: 'تمدید ویزا', count: 45 }, { name: 'پذیرش جدید', count: 32 } ], nationalities: [ { name: 'افغانستانی', value: 38, color: '#3b82f6' }, { name: 'عراقی', value: 25, color: '#06b6d4' } ], kpis: { totalActive: 132, avgProcessingTime: '12.5', approvalRate: 78, newApplications: 25 } },
  'last-3-months': { applicationTypes: [ { name: 'تمدید ویزا', count: 135 }, { name: 'پذیرش جدید', count: 98 } ], nationalities: [ { name: 'افغانستانی', value: 42, color: '#3b82f6' }, { name: 'عراقی', value: 23, color: '#06b6d4' } ], kpis: { totalActive: 400, avgProcessingTime: '11.8', approvalRate: 82, newApplications: 95 } },
  'custom': { applicationTypes: [ { name: 'تمدید ویزا', count: 89 }, { name: 'پذیرش جدید', count: 67 } ], nationalities: [ { name: 'افغانستانی', value: 40, color: '#3b82f6' }, { name: 'عراقی', value: 24, color: '#06b6d4' } ], kpis: { totalActive: 269, avgProcessingTime: '13.2', approvalRate: 75, newApplications: 67 } }
};

export function Reports({ onNavigate }: ReportsProps) {
  const [dateRange, setDateRange] = useState('last-month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentData = useMemo(() => mockDataByRange[dateRange as keyof typeof mockDataByRange], [dateRange]);
  const handleDateRangeChange = async (value: string) => { setIsRefreshing(true); setDateRange(value); await new Promise(resolve => setTimeout(resolve, 800)); setIsRefreshing(false); };
  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);
  const getDateRangeLabel = () => { switch (dateRange) { case 'last-month': return 'ماه گذشته'; case 'last-3-months': return 'سه ماه اخیر'; default: return 'بازه سفارشی'; } };

  const CustomTooltip = ({ active, payload, label }: any) => { if (active && payload && payload.length) { return (<div className="bg-white p-3 border rounded-lg shadow-lg"><p>{label}</p><p>تعداد: {formatNumber(payload[0].value)}</p></div>); } return null; };
  const CustomPieTooltip = ({ active, payload }: any) => { if (active && payload && payload.length) { return (<div className="bg-white p-3 border rounded-lg shadow-lg"><p>{payload[0].name}</p><p>درصد: {payload[0].value}%</p></div>); } return null; };

  return (
    <div className="flex-1 section-padding bg-muted/30">
        <div className="bg-white border-b border-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse"><Filter className="w-5 h-5 text-primary" /><label className="text-sm font-medium">بازه زمانی:</label></div>
                <Select value={dateRange} onValueChange={handleDateRangeChange}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="last-month">ماه گذشته</SelectItem><SelectItem value="last-3-months">سه ماه اخیر</SelectItem><SelectItem value="custom">بازه سفارشی</SelectItem></SelectContent></Select>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                {isRefreshing ? (<><RefreshCw className="w-4 h-4 animate-spin" /><span>در حال بروزرسانی...</span></>) : (<><Calendar className="w-4 h-4" /><span>آخرین بروزرسانی: {getDateRangeLabel()}</span></>)}
              </div>
            </div>
          </div>
        </div>
        <div className="container-modern space-y-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">کل پرونده‌های فعال</p><p className="text-2xl font-bold">{formatNumber(currentData.kpis.totalActive)}</p></div><div className="p-3 bg-blue-100 rounded-lg"><FileText className="w-6 h-6 text-blue-600" /></div></div></CardContent></Card>
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">میانگین زمان پردازش</p><p className="text-2xl font-bold">{currentData.kpis.avgProcessingTime}</p></div><div className="p-3 bg-orange-100 rounded-lg"><Clock className="w-6 h-6 text-orange-600" /></div></div></CardContent></Card>
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">نرخ تایید</p><p className="text-2xl font-bold">%{formatNumber(currentData.kpis.approvalRate)}</p></div><div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div></div></CardContent></Card>
                <Card className="card-modern"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">درخواست‌های جدید</p><p className="text-2xl font-bold">{formatNumber(currentData.kpis.newApplications)}</p></div><div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div></div></CardContent></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="card-modern"><CardHeader className="border-b"><CardTitle>تعداد درخواست‌ها بر اساس نوع</CardTitle></CardHeader><CardContent className="p-6"><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={currentData.applicationTypes}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip content={<CustomTooltip />} /><Bar dataKey="count" fill="#3b82f6" /></BarChart></ResponsiveContainer></div></CardContent></Card>
                <Card className="card-modern"><CardHeader className="border-b"><CardTitle>تفکیک درخواست‌ها بر اساس ملیت</CardTitle></CardHeader><CardContent className="p-6"><div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={currentData.nationalities} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{currentData.nationalities.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip content={<CustomPieTooltip />} /><Legend /></PieChart></ResponsiveContainer></div></CardContent></Card>
            </div>
        </div>
    </div>
  );
}