import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User } from 'lucide-react';
import { FormStepProps } from '../types/form-types';
import { NATIONALITY_OPTIONS } from '../constants/form-constants';

// --- FIX: Provide a default empty object for validationErrors to prevent 'undefined' errors ---
export function PersonalInfoStep({ formData, onInputChange, validationErrors = {} }: FormStepProps) {
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-primary" />
          <span>Personal Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" value={formData.fullName} onChange={(e) => onInputChange('fullName', e.target.value)} placeholder="Enter your full name" required />
            {validationErrors.fullName && <p className="text-sm text-destructive mt-1">{validationErrors.fullName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherName">Father's Name *</Label>
            <Input id="fatherName" value={formData.fatherName} onChange={(e) => onInputChange('fatherName', e.target.value)} placeholder="Enter father's name" required />
            {validationErrors.fatherName && <p className="text-sm text-destructive mt-1">{validationErrors.fatherName}</p>}
          </div>
        </div>

        {formData.nationality === 'afghan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grandfatherName">Grandfather's Name</Label>
              <Input id="grandfatherName" value={formData.grandfatherName || ''} onChange={(e) => onInputChange('grandfatherName', e.target.value)} placeholder="Enter grandfather's name" />
              {validationErrors.grandfatherName && <p className="text-sm text-destructive mt-1">{validationErrors.grandfatherName}</p>}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date of Birth *</Label>
            <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => onInputChange('birthDate', e.target.value)} required />
            {validationErrors.birthDate && <p className="text-sm text-destructive mt-1">{validationErrors.birthDate}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Country of Residence *</Label>
            <Select value={formData.nationality} onValueChange={(value) => onInputChange('nationality', value)}>
              <SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger>
              <SelectContent>
                {NATIONALITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.nationality && <p className="text-sm text-destructive mt-1">{validationErrors.nationality}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => onInputChange('email', e.target.value)} placeholder="Enter your email address" className={formData.email && !isValidEmail(formData.email) ? 'border-destructive' : ''} required />
            {formData.email && !isValidEmail(formData.email) && <p className="text-xs text-destructive">Please enter a valid email address.</p>}
            {validationErrors.email && <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}