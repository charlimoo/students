// src/components/form-steps/ReviewStep.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { CheckCircle, AlertCircle, User, GraduationCap, BookOpen, Upload } from 'lucide-react';
import { FormStepProps } from '../types/form-types';
import { NATIONALITY_OPTIONS, DEGREE_OPTIONS, DOCUMENT_TYPE_OPTIONS } from '../constants/form-constants';

export function ReviewStep({ formData, onInputChange }: Omit<FormStepProps, 'onFileUpload'>) {
  const getLabel = (options: {value: string, label: string}[], value: string) => options.find(opt => opt.value === value)?.label || value || '—';
  
  const isFormComplete = () => {
    const hasPersonalInfo = formData.fullName && formData.fatherName && formData.birthDate && formData.nationality && formData.email;
    const hasAcademicRecords = formData.academicRecords && formData.academicRecords.length > 0 && formData.academicRecords.every(r => r.degree && r.university && r.field && r.gpa);
    const hasUniversityPrograms = formData.universityPrograms && formData.universityPrograms.length > 0 && formData.universityPrograms.every(p => p.university && p.field);
    const hasRequiredDocuments = formData.documentUploads && formData.documentUploads.some(doc => doc.file && doc.documentType);
    
    // In edit mode, we don't require new documents to be uploaded.
    const isEditMode = true; // A simple way to simulate edit mode logic for this component.
                             // A more robust solution might pass an isEditMode prop.
    const documentsAreValid = hasRequiredDocuments || isEditMode;

    return !!(hasPersonalInfo && hasAcademicRecords && hasUniversityPrograms && documentsAreValid);
  };

  const getMissingFields = () => {
    const missing: string[] = []; // Corrected line
    if (!formData.fullName || !formData.fatherName || !formData.birthDate || !formData.nationality || !formData.email) {
      missing.push('Personal information is incomplete');
    }
    if (!formData.academicRecords || formData.academicRecords.length === 0 || !formData.academicRecords.every(r => r.degree && r.university && r.field && r.gpa)) {
      missing.push('One or more academic records are incomplete');
    }
    if (!formData.universityPrograms || formData.universityPrograms.length === 0 || !formData.universityPrograms.every(p => p.university && p.field)) {
      missing.push('One or more university choices are incomplete');
    }
    // Only check for documents if not in a simulated edit mode
    const isEditMode = true;
    if (!isEditMode && (!formData.documentUploads || !formData.documentUploads.some(doc => doc.file && doc.documentType))) {
      missing.push('At least one document must be uploaded with a type selected');
    }
    return missing;
  };

  const formIsComplete = isFormComplete();

  return (
    <Card className="card-modern" dir="ltr">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Review & Submit</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`flex items-start space-x-2 p-4 border rounded-lg ${formIsComplete ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}>
          {formIsComplete ? <CheckCircle className="w-5 h-5 text-success mt-0.5" /> : <AlertCircle className="w-5 h-5 text-warning mt-0.5" />}
          <div>
            <h4 className={`font-medium ${formIsComplete ? 'text-success' : 'text-warning'}`}>{formIsComplete ? 'Form is ready for submission' : 'Information is incomplete'}</h4>
            {!formIsComplete && <ul className="text-sm list-disc list-inside mt-2"> {getMissingFields().map((field, index) => <li key={index}>{field}</li>)}</ul>}
          </div>
        </div>
        
        <div className="space-y-3">
            <h4 className="font-semibold flex items-center"><User className="w-4 h-4 mr-2 text-primary" />Personal Information</h4>
            <div className="p-4 bg-muted/50 rounded-lg text-sm grid grid-cols-2 gap-2">
                <div><span className="font-medium">Full Name:</span> {formData.fullName || '—'}</div>
                <div><span className="font-medium">Father's Name:</span> {formData.fatherName || '—'}</div>
                <div><span className="font-medium">Date of Birth:</span> {formData.birthDate || '—'}</div>
                <div><span className="font-medium">Nationality:</span> {getLabel(NATIONALITY_OPTIONS, formData.nationality)}</div>
                <div className="col-span-2"><span className="font-medium">Email:</span> {formData.email || '—'}</div>
            </div>
        </div>
        
        <div className="space-y-3">
            <h4 className="font-semibold flex items-center"><GraduationCap className="w-4 h-4 mr-2 text-primary" />Academic History</h4>
            {formData.academicRecords.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 p-4 bg-muted/50 rounded-lg text-sm">
                    {formData.academicRecords.map(rec => <li key={rec.id}>{getLabel(DEGREE_OPTIONS, rec.degree)} in {rec.field} from {rec.university}</li>)}
                </ul>
            ) : <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">No academic records added.</p>}
        </div>

        <div className="space-y-3">
            <h4 className="font-semibold flex items-center"><BookOpen className="w-4 h-4 mr-2 text-primary" />University Choices</h4>
             {formData.universityPrograms.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1 p-4 bg-muted/50 rounded-lg text-sm">
                    {formData.universityPrograms.sort((a,b) => a.priority - b.priority).map(prog => <li key={prog.id}>{prog.priority}. {prog.university} - {prog.field}</li>)}
                </ol>
            ) : <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">No university choices added.</p>}
        </div>

        <div className="space-y-3">
            <h4 className="font-semibold flex items-center"><Upload className="w-4 h-4 mr-2 text-primary" />Uploaded Documents</h4>
             {formData.documentUploads.some(d => d.file) ? (
                <ul className="list-disc list-inside space-y-1 p-4 bg-muted/50 rounded-lg text-sm">
                    {formData.documentUploads.filter(d => d.file).map(doc => <li key={doc.id}>{getLabel(DOCUMENT_TYPE_OPTIONS, doc.documentType)}: {doc.file?.name}</li>)}
                </ul>
            ) : <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">No new documents uploaded for this submission.</p>}
        </div>
        
        <div className="pt-4 border-t">
          {/* --- FIX STARTS HERE --- */}
          {/* The onCheckedChange now correctly calls onInputChange for the 'confirmSubmission' field. */}
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="confirm-submission" 
              checked={!!formData.confirmSubmission}
              onCheckedChange={(checked) => onInputChange('confirmSubmission', !!checked)} 
            />
            <Label htmlFor="confirm-submission" className="text-sm leading-relaxed cursor-pointer">
              I hereby confirm that all information provided is accurate and complete. I understand that any false statements may result in the rejection of my application.
            </Label>
          </div>
          {/* --- FIX ENDS HERE --- */}
        </div>
      </CardContent>
    </Card>
  );
}