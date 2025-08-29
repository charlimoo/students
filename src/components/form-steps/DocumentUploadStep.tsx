import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Trash2, Upload, File, Download, AlertCircle } from 'lucide-react';
import { FormStepProps, DocumentUpload } from '../types/form-types';
import { DOCUMENT_TYPE_OPTIONS } from '../constants/form-constants';

interface DocumentUploadStepProps extends Omit<FormStepProps, 'onFileUpload'> {
  existingDocuments: { document_type: string; file: string; }[];
}

// --- FIX: Provide a default empty object for validationErrors to prevent 'undefined' errors ---
export function DocumentUploadStep({ formData, onInputChange, existingDocuments, validationErrors = {} }: DocumentUploadStepProps) {
  const [documentUploads, setDocumentUploads] = React.useState<DocumentUpload[]>(
    formData.documentUploads && formData.documentUploads.length > 0 
      ? formData.documentUploads 
      : [{ id: Date.now().toString(), documentType: '', file: null }]
  );

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
        
        {validationErrors.documentUploads && (
          <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {validationErrors.documentUploads}
          </div>
        )}

        {existingDocuments && existingDocuments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Previously Submitted Documents</h4>
            <div className="space-y-2 p-4 bg-muted/30 rounded-lg border">
              {existingDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <span>{doc.document_type}</span>
                  </div>
                  <a href={doc.file} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-semibold text-foreground">Add New or Replacement Documents</h4>
          <p className="text-sm text-muted-foreground">
            Only upload files here if you need to add new documents or replace existing ones.
          </p>
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
        </div>
      </CardContent>
    </Card>
  );
}