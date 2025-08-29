import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { AdmissionFormData } from './types/form-types';
import { INITIAL_FORM_DATA, PROGRESS_STEPS } from './constants/form-constants';
import { PersonalInfoStep } from './form-steps/PersonalInfoStep';
import { AcademicHistoryStep } from './form-steps/AcademicHistoryStep';
import { UniversityProgramStep } from './form-steps/UniversityProgramStep';
import { DocumentUploadStep } from './form-steps/DocumentUploadStep';
import { ReviewStep } from './form-steps/ReviewStep';
import apiService from '../api/apiService';
import { RefreshCw } from 'lucide-react';

interface NewAdmissionApplicationProps {
  onBackToDashboard: () => void;
  onNavigate: (page: string, applicationId?: string) => void;
  applicationId: string | null;
}

interface ExistingDocument {
  document_type: string;
  file: string;
}

export function NewAdmissionApplication({ onBackToDashboard, onNavigate, applicationId }: NewAdmissionApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [existingDocuments, setExistingDocuments] = useState<ExistingDocument[]>([]);
  
  const isEditMode = !!applicationId;

  const steps = isEditMode
    ? PROGRESS_STEPS.filter(step => step.id !== 3) // Exclude University step
    : PROGRESS_STEPS;
  const totalSteps = steps.length;

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (isEditMode && applicationId) {
        try {
          const response = await apiService.get(`/v1/applications/${applicationId}/`);
          const data = response.data;
          setFormData({
            application_type: data.application_type,
            fullName: data.full_name || '',
            fatherName: data.father_name || '',
            grandfatherName: data.grandfather_name || '',
            birthDate: data.date_of_birth || '',
            nationality: data.country_of_residence || '',
            email: data.email || '',
            academicRecords: data.academic_histories.map((h: any) => ({
                id: h.id.toString(), degree: h.degree_level, country: h.country,
                university: h.university_name, field: h.field_of_study, gpa: h.gpa,
                documentFile: null,
            })),
            universityPrograms: data.university_choices.map((c: any) => ({
                id: c.id.toString(), priority: c.priority, university: c.university.name,
                universityId: c.university.id, field: c.program.name, fieldId: c.program.id,
            })),
            documentUploads: [],
          });
          setExistingDocuments(data.documents || []);
        } catch (error) {
          toast.error("Failed to load application data for editing.");
          onBackToDashboard();
        }
      }
      setIsLoadingData(false);
    };
    fetchApplicationData();
  }, [applicationId, isEditMode, onBackToDashboard]);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors(prev => ({...prev, [key]: ''}));
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setValidationErrors({});
        const payload = new FormData();
        payload.append('full_name', formData.fullName);
        payload.append('father_name', formData.fatherName);
        payload.append('date_of_birth', formData.birthDate);
        payload.append('country_of_residence', formData.nationality); 
        payload.append('email', formData.email);
        if (formData.grandfatherName) {
            payload.append('grandfather_name', formData.grandfatherName);
        }
        formData.academicRecords.forEach((record, index) => {
            if (isEditMode && record.id && !isNaN(Number(record.id))) {
              payload.append(`academic_histories[${index}]id`, record.id);
            }
            payload.append(`academic_histories[${index}]degree_level`, record.degree);
            payload.append(`academic_histories[${index}]country`, record.country);
            payload.append(`academic_histories[${index}]university_name`, record.university);
            payload.append(`academic_histories[${index}]field_of_study`, record.field);
            payload.append(`academic_histories[${index}]gpa`, record.gpa);
        });
        formData.universityPrograms.forEach((choice, index) => {
            if (isEditMode && choice.id && !isNaN(Number(choice.id))) {
              payload.append(`university_choices[${index}]id`, choice.id);
            }
            if (choice.universityId) payload.append(`university_choices[${index}]university_id`, String(choice.universityId));
            if (choice.fieldId) payload.append(`university_choices[${index}]program_id`, String(choice.fieldId));
            payload.append(`university_choices[${index}]priority`, String(choice.priority));
        });
        formData.documentUploads.forEach((doc, index) => {
            if (doc.file && doc.documentType) {
                payload.append(`documents[${index}]document_type`, doc.documentType);
                payload.append(`documents[${index}]file`, doc.file);
            }
        });
        try {
            let response;
            if (isEditMode) {
                response = await apiService.patch(`/v1/applications/${applicationId}/`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success("Application Resubmitted Successfully!");
            } else {
                payload.append('application_type', 'NEW_ADMISSION');
                response = await apiService.post('/v1/applications/', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success("Application Submitted Successfully!");
            }
            const trackingCode = response.data.tracking_code;
            setTimeout(() => onNavigate('application-status', trackingCode), 1500);
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                const apiErrors = error.response.data;
                const newValidationErrors: Record<string, string> = {};
                const errorMessages: { field: string; message: string }[] = [];

                // --- FIX: Add a recursive helper function to parse nested API errors ---
                const parseApiError = (err: any): string => {
                    if (typeof err === 'string') return err;
                    if (Array.isArray(err)) return err.map(parseApiError).join(', ');
                    if (typeof err === 'object' && err !== null) {
                        return Object.entries(err)
                            .map(([key, value]) => {
                                const prettyKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                return `${isNaN(Number(key)) ? `${prettyKey}: ` : ''}${parseApiError(value)}`;
                            }).join('; ');
                    }
                    return 'Invalid error format';
                };

                const fieldMapping: Record<string, string> = {
                    full_name: 'fullName', father_name: 'fatherName', grandfather_name: 'grandfatherName',
                    date_of_birth: 'birthDate', country_of_residence: 'nationality', email: 'email',
                    academic_histories: 'academicRecords', university_choices: 'universityPrograms', documents: 'documentUploads',
                };

                let hasNavigated = false;
                Object.keys(apiErrors).forEach(key => {
                    const frontendKey = fieldMapping[key] || key;
                    // --- FIX: Use the new parser to get a clean error message ---
                    const errorMsg = parseApiError(apiErrors[key]);
                    newValidationErrors[frontendKey] = errorMsg;
                    
                    const prettyKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    errorMessages.push({ field: prettyKey, message: errorMsg });

                    if (!hasNavigated) {
                        const stepIdToFind = 
                            ['fullName', 'fatherName', 'grandfatherName', 'birthDate', 'nationality', 'email'].includes(frontendKey) ? 1 :
                            frontendKey === 'academicRecords' ? 2 :
                            frontendKey === 'universityPrograms' ? 3 :
                            frontendKey === 'documentUploads' ? 4 : -1;
                        
                        const stepIndex = steps.findIndex(s => s.id === stepIdToFind);
                        if (stepIndex !== -1) {
                            setCurrentStep(stepIndex + 1);
                            hasNavigated = true;
                        }
                    }
                });
                
                setValidationErrors(newValidationErrors);
                toast.error("Submission Failed: Please Review Your Application", { 
                    description: (
                      <div className="text-xs">
                        <p className="mb-2">Errors were found in your application. We've taken you to the first step with an issue.</p>
                        <ul className="list-disc list-inside space-y-1">
                          {errorMessages.map((e, i) => <li key={i}><strong>{e.field}:</strong> {e.message}</li>)}
                        </ul>
                      </div>
                    ),
                    duration: 10000,
                });
            } else {
                toast.error("An unexpected error occurred", {
                    description: "Please try again later or contact support."
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

  const renderStepContent = () => {
    const stepProps = { formData, onInputChange: handleInputChange, validationErrors };
    
    let stepComponent;
    const stepId = steps[currentStep - 1].id;

    switch (stepId) {
      case 1: stepComponent = <PersonalInfoStep {...stepProps} />; break;
      case 2: stepComponent = <AcademicHistoryStep {...stepProps} />; break;
      case 3: stepComponent = <UniversityProgramStep {...stepProps} />; break;
      case 4: stepComponent = <DocumentUploadStep {...stepProps} existingDocuments={existingDocuments} />; break;
      case 5: stepComponent = <ReviewStep {...stepProps} />; break;
      default: stepComponent = null;
    }
    return stepComponent;
  };
  
  const currentProgress = (currentStep / totalSteps) * 100;

  if (isLoadingData) {
      return <div className="flex h-screen w-full items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-left mb-6">
                <h1 className="text-3xl font-bold text-foreground">{isEditMode ? 'Edit & Resubmit Application' : 'New Admission Application'}</h1>
                <p className="text-muted-foreground mt-1">{isEditMode ? 'Please review and correct the information below.' : 'Please complete all sections of the form accurately.'}</p>
            </div>
            
            <div className="mb-8 p-4 bg-card border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Step {currentStep} of {totalSteps}: {steps[currentStep-1].label}</span>
                    <span className="text-sm text-muted-foreground">{Math.round(currentProgress)}% Complete</span>
                </div>
                <Progress value={currentProgress} className="h-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {renderStepContent()}
                <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t mt-8">
                    <div><Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1}>Previous Step</Button></div>
                    <div className="flex gap-4">
                        {currentStep < totalSteps ? (
                            <Button type="button" onClick={() => setCurrentStep(prev => prev + 1)}>Next Step</Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting || !formData.confirmSubmission}>{isSubmitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}{isSubmitting ? 'Submitting...' : (isEditMode ? 'Resubmit Application' : 'Submit Application')}</Button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}