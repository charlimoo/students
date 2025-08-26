import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Building2, GraduationCap, Plus, ChevronDown, ChevronRight, Edit, Trash2, Users, MapPin, X, Save, AlertTriangle, Building } from 'lucide-react';

interface OrganizationalChartProps {
  onNavigate: (page: string) => void;
}

const mockOrganizationalData = {
  id: 'root', name: 'سازمان امور دانشجویان', type: 'organization', manager: 'دکتر احمد محمدزاده', description: 'سازمان مرکزی امور دانشجویان بین‌الملل', children: [
    { id: 'tehran', name: 'امور کنسولی استان تهران', type: 'province', manager: 'مهندس علی احمدی', description: 'مدیریت امور کنسولی استان تهران', staffCount: 25, children: [
      { id: 'ut', name: 'دانشگاه تهران', type: 'university', manager: 'دکتر فاطمه رضایی', description: 'دانشگاه تهران - واحد امور بین‌الملل', staffCount: 8, studentCount: 1200, children: [] },
      { id: 'sharif', name: 'دانشگاه صنعتی شریف', type: 'university', manager: 'دکتر محمد کریمی', description: 'دانشگاه صنعتی شریف - دفتر دانشجویان بین‌الملل', staffCount: 6, studentCount: 800, children: [] }
    ]},
    { id: 'isfahan', name: 'امور کنسولی استان اصفهان', type: 'province', manager: 'دکتر حسین نوری', description: 'مدیریت امور کنسولی استان اصفهان', staffCount: 18, children: [
      { id: 'ui', name: 'دانشگاه اصفهان', type: 'university', manager: 'دکتر مریم حسینی', description: 'دانشگاه اصفهان - مرکز خدمات دانشجویان بین‌الملل', staffCount: 7, studentCount: 950, children: [] }
    ]}
  ]
};

// --- FIX STARTS HERE ---
// Define the props for the TreeNode component using a type alias.
type TreeNodeProps = {
  node: any;
  level: number;
  onSelect: (node: any) => void;
  selectedNode?: any;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
};

// Use the defined type alias for the component's props.
const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onSelect, selectedNode, expandedNodes, onToggleExpand }) => {
// --- FIX ENDS HERE ---
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode?.id === node.id;
  const getNodeIcon = (type: string) => { switch (type) { case 'organization': return <Building className="w-4 h-4 text-blue-600" />; case 'province': return <MapPin className="w-4 h-4 text-green-600" />; case 'university': return <GraduationCap className="w-4 h-4 text-purple-600" />; default: return <Building className="w-4 h-4 text-gray-600" />; } };
  return (
    <div className="text-right">
      <div className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/50 text-foreground'}`} style={{ paddingRight: `${level * 24 + 8}px` }} onClick={() => onSelect(node)}>
        {hasChildren ? (<button onClick={(e) => { e.stopPropagation(); onToggleExpand(node.id); }} className="p-1 hover:bg-muted rounded transition-colors">{isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>) : <div className="w-6" />}
        <div className="flex items-center space-x-2 space-x-reverse">{getNodeIcon(node.type)}<span className="text-sm persian-body font-medium">{node.name}</span></div>
        {node.type !== 'organization' && (<div className="mr-auto"><Badge variant="outline" className="text-xs">{node.type === 'province' ? `${node.staffCount} کارمند` : `${node.studentCount || 0} دانشجو`}</Badge></div>)}
      </div>
      {hasChildren && isExpanded && (<div>{node.children.map((child: any) => <TreeNode key={child.id} node={child} level={level + 1} onSelect={onSelect} selectedNode={selectedNode} expandedNodes={expandedNodes} onToggleExpand={onToggleExpand} />)}</div>)}
    </div>
  );
}

export function OrganizationalChart({ onNavigate }: OrganizationalChartProps) {
  const [selectedNode, setSelectedNode] = useState<any>(mockOrganizationalData);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'tehran']));
  const [showAddProvinceModal, setShowAddProvinceModal] = useState(false);
  const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newProvince, setNewProvince] = useState({ name: '', manager: '', description: '' });
  const [newUniversity, setNewUniversity] = useState({ name: '', manager: '', description: '', province: '' });
  const [editingNode, setEditingNode] = useState<any>(null);

  const handleToggleExpand = (nodeId: string) => { const newExpanded = new Set(expandedNodes); newExpanded.has(nodeId) ? newExpanded.delete(nodeId) : newExpanded.add(nodeId); setExpandedNodes(newExpanded); };
  const getAvailableProvinces = () => mockOrganizationalData.children.filter(child => child.type === 'province');
  
  return (
    <div className="flex-1 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Details View */}
            <div className="lg:col-span-2">
                {selectedNode ? (
                    <Card className="card-modern">
                        <CardHeader className="border-b border-border">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-3 space-x-reverse">
                                    <span className="text-xl font-bold text-foreground persian-heading">جزئیات: {selectedNode.name}</span>
                                </CardTitle>
                                {selectedNode.type !== 'organization' && (
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Button variant="outline" size="sm"><Edit className="w-4 h-4 ml-1" />ویرایش</Button>
                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="w-4 h-4 ml-1" />حذف</Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 text-right space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div><Label className="text-sm font-semibold text-muted-foreground persian-caption">نام واحد</Label><p className="mt-1 text-foreground persian-body font-medium">{selectedNode.name}</p></div>
                                    <div><Label className="text-sm font-semibold text-muted-foreground persian-caption">مدیر واحد</Label><p className="mt-1 text-foreground persian-body">{selectedNode.manager}</p></div>
                                    {selectedNode.type !== 'organization' && (<div><Label className="text-sm font-semibold text-muted-foreground persian-caption">تعداد کارکنان</Label><p className="mt-1 text-foreground">{selectedNode.staffCount} نفر</p></div>)}
                                </div>
                                <div className="space-y-4">
                                    {selectedNode.type === 'university' && (<div><Label className="text-sm font-semibold text-muted-foreground persian-caption">تعداد دانشجویان</Label><p className="mt-1 text-foreground">{selectedNode.studentCount} نفر</p></div>)}
                                    <div><Label className="text-sm font-semibold text-muted-foreground persian-caption">نوع واحد</Label><Badge className="mt-1">{selectedNode.type === 'organization' ? 'سازمان مرکزی' : selectedNode.type === 'province' ? 'واحد استانی' : 'دانشگاه'}</Badge></div>
                                </div>
                            </div>
                            {selectedNode.description && (<div><Label className="text-sm font-semibold text-muted-foreground persian-caption">توضیحات</Label><p className="mt-2 text-muted-foreground persian-body leading-relaxed bg-muted/30 p-4 rounded-lg">{selectedNode.description}</p></div>)}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="card-modern flex items-center justify-center h-full">
                        <CardContent className="text-center py-12"><Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg persian-heading">انتخاب واحد سازمانی</h3><p className="text-muted-foreground persian-body">برای مشاهده جزئیات، یک واحد را از درخت انتخاب کنید.</p></CardContent>
                    </Card>
                )}
            </div>
            
            {/* Tree View */}
            <Card className="card-modern lg:col-span-1 flex flex-col">
                <CardHeader className="border-b">
                     <CardTitle className="flex items-center space-x-3 space-x-reverse"><div className="p-2 bg-green-100 rounded-lg"><Building2 className="w-5 h-5 text-green-600" /></div><span className="text-lg font-bold">نمای درختی سازمان</span></CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 overflow-y-auto">
                    <TreeNode node={mockOrganizationalData} level={0} onSelect={setSelectedNode} selectedNode={selectedNode} expandedNodes={expandedNodes} onToggleExpand={handleToggleExpand} />
                </CardContent>
                 <div className="p-4 border-t space-y-2">
                    <Dialog open={showAddProvinceModal} onOpenChange={setShowAddProvinceModal}><DialogTrigger asChild><Button className="w-full persian-text"><Plus className="w-4 h-4 ml-2" />افزودن واحد استانی</Button></DialogTrigger><DialogContent dir="rtl">{/* ... Modal content ... */}</DialogContent></Dialog>
                    <Dialog open={showAddUniversityModal} onOpenChange={setShowAddUniversityModal}><DialogTrigger asChild><Button variant="outline" className="w-full persian-text border-dashed"><Plus className="w-4 h-4 ml-2" />افزودن دانشگاه</Button></DialogTrigger><DialogContent dir="rtl">{/* ... Modal content ... */}</DialogContent></Dialog>
                </div>
            </Card>
        </div>
    </div>
  );
}