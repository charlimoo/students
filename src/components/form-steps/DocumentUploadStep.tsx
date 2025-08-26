import React, { useEffect } from 'react'; // Add useEffect
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Trash2, Upload } from 'lucide-react';
import { FormStepProps, DocumentUpload } from '../types/form-types';
import { DOCUMENT_TYPE_OPTIONS } from '../constants/form-constants';

export function DocumentUploadStep({ formData, onInputChange }: Omit<FormStepProps, 'onFileUpload'>) {
  const [documentUploads, setDocumentUploads] = React.useState<DocumentUpload[]>(
    formData.documentUploads && formData.documentUploads.length > 0 
      ? formData.documentUploads 
      : [{ id: Date.now().toString(), documentType: '', file: null }]
  );

    // --- FIX STARTS HERE ---
  // This effect syncs the internal state with the props when they change.
  // In edit mode, we don't receive existing files, so we reset to a clean state.
  useEffect(() => {
    // When editing, the user should re-upload files if they want to change them.
    // The API doesn't send back the files, only their URLs.
    // So we reset the upload component to a clean slate.
    const initialDocs = [{ id: Date.now().toString(), documentType: '', file: null }];
    setDocumentUploads(initialDocs);
    onInputChange('documentUploads', initialDocs);
  }, []); // Run only once on mount
  // --- FIX ENDS HERE ---
  
  const handleDocumentChange = (id: string, key: 'documentType' | 'file', value: any) => {
    const updated = documentUploads.map(doc => doc.id === id ? { ...doc, [key]: value } : doc);
    setDocumentUploads(updated);
    onInputChange('documentUploads', updated);
  };
  
  const handleAddDocument = () => {
    const newDoc: DocumentUpload = { id: Date.now().toString(), documentType: '', file: null };
    const updated = [...documentUploads, newDoc];
    setDocumentUploads(updated);
    onInputChange('documentUploads', updated);
  };
  
  const handleRemoveDocument = (id: string) => {
    if (documentUploads.length > 1) {
      const updated = documentUploads.filter(doc => doc.id !== id);
      setDocumentUploads(updated);
      onInputChange('documentUploads', updated);
    }
  };

  const handleFileButtonClick = (docId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0] || null;
        handleDocumentChange(docId, 'file', file);
    };
    input.click();
  };

  return (
    <Card className="card-modern" dir="ltr">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-primary" />
            <span>Required Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Document Type *</TableHead>
                        <TableHead>Upload File *</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documentUploads.map(doc => (
                        <TableRow key={doc.id}>
                            <TableCell>
                                <Select value={doc.documentType} onValueChange={v => handleDocumentChange(doc.id, 'documentType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                                    <SelectContent>{DOCUMENT_TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button type="button" variant="outline" onClick={() => handleFileButtonClick(doc.id)}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {doc.file ? doc.file.name : 'Upload File'}
                                </Button>
                            </TableCell>
                            <TableCell>
                                {documentUploads.length > 1 && 
                                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.id)} className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={handleAddDocument}>
                <Plus className="w-4 h-4 mr-2" />
                Add Another Document
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}