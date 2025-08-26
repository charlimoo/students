import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { 
  ArrowLeft, 
  Upload, 
  Edit, 
  FileText,
  User,
  GraduationCap,
  CheckCircle,
  Calendar,
  Flag,
  IdCard,
  Save,
  Send
} from 'lucide-react';

interface NewApplicationFormProps {
  onBack: () => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
}

export function NewApplicationForm({ onBack, onSubmit, onSaveDraft }: NewApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    lastDegree: '',
    fieldOfStudy: '',
    previousUniversity: '',
    passportScan: null,
    personalPhoto: null,
    transcript: null,
    confirmSubmission: false
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.confirmSubmission) {
      setShowSuccessDialog(true);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    onSubmit();
  };

  const calculateProgress = () => {
    let progress = 0;
    // Step 1: Personal Info (25% if all fields filled)
    if (formData.fullName && formData.fatherName && formData.gender && 
        formData.dateOfBirth && formData.nationality && formData.passportNumber) {
      progress += 25;
    }
    // Step 2: Academic History (25% if all fields filled)
    if (formData.lastDegree && formData.fieldOfStudy && formData.previousUniversity) {
      progress += 25;
    }
    // Step 3: Documents (25% if all files uploaded)
    if (formData.passportScan && formData.personalPhoto && formData.transcript) {
      progress += 25;
    }
    // Step 4: Review (25% if confirmed)
    if (formData.confirmSubmission) {
      progress += 25;
    }
    return progress;
  };

  const getStepStatus = (step: number) => {
    switch(step) {
      case 1:
        return formData.fullName && formData.fatherName && formData.gender && 
               formData.dateOfBirth && formData.nationality && formData.passportNumber;
      case 2:
        return formData.lastDegree && formData.fieldOfStudy && formData.previousUniversity;
      case 3:
        return formData.passportScan && formData.personalPhoto && formData.transcript;
      case 4:
        return formData.confirmSubmission;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl text-foreground">Submit New Application for Student</h1>
              <p className="text-muted-foreground">
                Complete all sections below to submit a new student application
              </p>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-foreground">Application Progress</span>
              <span className="text-sm text-muted-foreground">{calculateProgress()}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-3 mb-4" />
            
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { number: 1, title: 'Personal Info', icon: User },
                { number: 2, title: 'Academic History', icon: GraduationCap },
                { number: 3, title: 'Upload Documents', icon: Upload },
                { number: 4, title: 'Review & Submit', icon: CheckCircle }
              ].map((step) => {
                const StepIcon = step.icon;
                const isCompleted = getStepStatus(step.number);
                return (
                  <div key={step.number} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted 
                        ? 'bg-success border-success text-success-foreground' 
                        : 'border-border text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                        Step {step.number}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span>1. Personal Information</span>
                {getStepStatus(1) && <CheckCircle className="w-5 h-5 text-success ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter student's full name"
                    className="input-modern"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Father's Name *</span>
                  </Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Enter father's full name"
                    className="input-modern"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Gender *</span>
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Date of Birth *</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="input-modern"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality" className="flex items-center space-x-2">
                    <Flag className="w-4 h-4 text-muted-foreground" />
                    <span>Nationality *</span>
                  </Label>
                  <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="afghan">Afghan</SelectItem>
                      <SelectItem value="pakistani">Pakistani</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="syrian">Syrian</SelectItem>
                      <SelectItem value="iraqi">Iraqi</SelectItem>
                      <SelectItem value="jordanian">Jordanian</SelectItem>
                      <SelectItem value="lebanese">Lebanese</SelectItem>
                      <SelectItem value="egyptian">Egyptian</SelectItem>
                      <SelectItem value="turkish">Turkish</SelectItem>
                      <SelectItem value="moroccan">Moroccan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passportNumber" className="flex items-center space-x-2">
                    <IdCard className="w-4 h-4 text-muted-foreground" />
                    <span>Passport Number *</span>
                  </Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                    placeholder="Enter passport number"
                    className="input-modern"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Academic History */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <span>2. Academic History</span>
                {getStepStatus(2) && <CheckCircle className="w-5 h-5 text-success ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lastDegree" className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>Last Degree Obtained *</span>
                  </Label>
                  <Select value={formData.lastDegree} onValueChange={(value) => handleInputChange('lastDegree', value)}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select degree level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School Diploma</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD/Doctorate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>Field of Study *</span>
                  </Label>
                  <Select value={formData.fieldOfStudy} onValueChange={(value) => handleInputChange('fieldOfStudy', value)}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Select field of study" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business Administration</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="economics">Economics</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="law">Law</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="previousUniversity" className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>Previous University *</span>
                  </Label>
                  <Input
                    id="previousUniversity"
                    value={formData.previousUniversity}
                    onChange={(e) => handleInputChange('previousUniversity', e.target.value)}
                    placeholder="Enter full university name"
                    className="input-modern"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Upload Documents */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <span>3. Upload Documents</span>
                {getStepStatus(3) && <CheckCircle className="w-5 h-5 text-success ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Upload the required documents for the student. All files should be in PDF, JPG, or PNG format and not exceed 5MB each.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <IdCard className="w-4 h-4 text-muted-foreground" />
                    <span>Passport Scan *</span>
                  </Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer ${
                      formData.passportScan 
                        ? 'border-success bg-success/5 hover:border-success' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      // Simulate file upload
                      handleFileUpload('passportScan', new File([''], 'passport.pdf'));
                    }}
                  >
                    {formData.passportScan ? (
                      <>
                        <CheckCircle className="w-8 h-8 mx-auto text-success mb-2" />
                        <p className="text-sm text-success font-medium">Passport scan uploaded</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload passport scan</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG • Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Personal Photo *</span>
                  </Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer ${
                      formData.personalPhoto 
                        ? 'border-success bg-success/5 hover:border-success' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      // Simulate file upload
                      handleFileUpload('personalPhoto', new File([''], 'photo.jpg'));
                    }}
                  >
                    {formData.personalPhoto ? (
                      <>
                        <CheckCircle className="w-8 h-8 mx-auto text-success mb-2" />
                        <p className="text-sm text-success font-medium">Personal photo uploaded</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload personal photo</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG • Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>Last Academic Transcript *</span>
                  </Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer ${
                      formData.transcript 
                        ? 'border-success bg-success/5 hover:border-success' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      // Simulate file upload
                      handleFileUpload('transcript', new File([''], 'transcript.pdf'));
                    }}
                  >
                    {formData.transcript ? (
                      <>
                        <CheckCircle className="w-8 h-8 mx-auto text-success mb-2" />
                        <p className="text-sm text-success font-medium">Academic transcript uploaded</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload transcript</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG • Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Review & Submit */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <span>4. Review & Submit</span>
                {getStepStatus(4) && <CheckCircle className="w-5 h-5 text-success ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Personal Information</h4>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Name:</span> {formData.fullName || 'Not provided'}</div>
                  <div><span className="font-medium">Father's Name:</span> {formData.fatherName || 'Not provided'}</div>
                  <div><span className="font-medium">Gender:</span> {formData.gender || 'Not provided'}</div>
                  <div><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth || 'Not provided'}</div>
                  <div><span className="font-medium">Nationality:</span> {formData.nationality || 'Not provided'}</div>
                  <div><span className="font-medium">Passport:</span> {formData.passportNumber || 'Not provided'}</div>
                </div>
              </div>

              {/* Academic History Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Academic History</h4>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Last Degree:</span> {formData.lastDegree || 'Not provided'}</div>
                  <div><span className="font-medium">Field of Study:</span> {formData.fieldOfStudy || 'Not provided'}</div>
                  <div className="col-span-2"><span className="font-medium">University:</span> {formData.previousUniversity || 'Not provided'}</div>
                </div>
              </div>

              {/* Documents Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Documents</h4>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  <div>Passport Scan: {formData.passportScan ? '✓ Uploaded' : '✗ Not uploaded'}</div>
                  <div>Personal Photo: {formData.personalPhoto ? '✓ Uploaded' : '✗ Not uploaded'}</div>
                  <div>Academic Transcript: {formData.transcript ? '✓ Uploaded' : '✗ Not uploaded'}</div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmSubmission"
                  checked={formData.confirmSubmission}
                  onCheckedChange={(checked) => handleInputChange('confirmSubmission', checked)}
                />
                <Label htmlFor="confirmSubmission">
                  I confirm that all information provided is accurate and complete.
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    type="submit" 
                    disabled={!formData.confirmSubmission}
                    className="button-primary flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="button-secondary flex items-center space-x-2"
                    onClick={onSaveDraft}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save as Draft</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  By submitting this application, you confirm that all information provided is accurate and you have the authority to submit on behalf of the student.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <AlertDialogTitle className="text-center">
                Application Submitted Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                The student application has been submitted and will now appear in your applicants table. 
                The student will be notified about the application status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                onClick={handleSuccessConfirm}
                className="w-full button-primary"
              >
                Return to Dashboard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}