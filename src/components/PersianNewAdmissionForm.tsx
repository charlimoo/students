// start of components/PersianNewAdmissionForm.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AdmissionFormData, FormStepProps } from './types/form-types';
import { INITIAL_FORM_DATA } from './constants/form-constants';
import { PersonalInfoStep } from './form-steps/PersonalInfoStep';
import { AcademicHistoryStep } from './form-steps/AcademicHistoryStep';
import { UniversityProgramStep } from './form-steps/UniversityProgramStep';
import { DocumentUploadStep } from './form-steps/DocumentUploadStep';
import { ReviewStep } from './form-steps/ReviewStep';

interface PersianNewAdmissionFormProps {
  onBack: () => void;
  onSubmit: () => void;
  onSaveDraft?: () => void;
}

export function PersianNewAdmissionForm({ onBack, onSubmit, onSaveDraft }: PersianNewAdmissionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_FORM_DATA);

  const handleInputChange = (key: string, value: string | File | null | any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = (key: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [key]: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleSaveDraft = () => {
    toast.success('درخواست در پیش‌نویس ذخیره شد');
    setTimeout(() => {
      if (onSaveDraft) {
        onSaveDraft();
      }
    }, 1500);
  };

  const currentProgress = (currentStep / 5) * 100;

  const renderStepContent = () => {
    const stepProps = {
      formData,
      onInputChange: handleInputChange,
      onFileUpload: handleFileUpload
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <AcademicHistoryStep {...stepProps} />;
      case 3:
        return <UniversityProgramStep {...stepProps} />;
      case 4:
        return <DocumentUploadStep {...stepProps} />;
      case 5:
        return <ReviewStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background persian-text" dir="rtl">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 space-x-reverse text-primary hover:underline mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="persian-text">بازگشت به انتخاب نوع درخواست</span>
          </button>
          
          <div className="space-y-4 text-right">
            <h1 className="text-3xl text-foreground persian-heading">فرم درخواست پذیرش جدید</h1>
            <p className="text-muted-foreground persian-text">لطفاً تمام بخش‌های فرم را به دقت تکمیل کنید</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Application Progress */}
        <div className="mb-8">
          <div className="text-right mb-3">
            <h2 className="text-sm font-medium text-foreground persian-text">پیشرفت درخواست</h2>
            <p className="text-xs text-muted-foreground persian-text">{Math.round(currentProgress)}% تکمیل شده</p>
          </div>
          <Progress value={currentProgress} rtl={true} className="h-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
            <div className="flex gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="persian-text"
                >
                  مرحله قبل
                </Button>
              )}
            </div>
            
            <div className="flex gap-4">
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="button-primary persian-text"
                >
                  مرحله بعد
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="persian-text"
                  >
                    ذخیره پیش‌نویس
                  </Button>
                  <Button
                    type="submit"
                    className="button-primary persian-text"
                  >
                    ثبت نهایی درخواست
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}