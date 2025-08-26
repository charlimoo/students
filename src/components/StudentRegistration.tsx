// start of frontend/src/components/StudentRegistration.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { 
  GraduationCap, 
  ArrowLeft,
  User,
  Mail,
  Lock,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import apiService from '../api/apiService';

interface StudentRegistrationProps {
  onBack: () => void;
  // onRegister is now a simple navigation callback
  onRegister: () => void; 
}

const nationalityOptions = [
  'Afghan', 'American', 'Australian', 'Austrian', 'Azerbaijani', 'Bangladeshi',
  'Belgian', 'Brazilian', 'British', 'Canadian', 'Chinese', 'Egyptian',
  'French', 'German', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Italian',
  'Japanese', 'Jordanian', 'Lebanese', 'Malaysian', 'Pakistani', 'Russian',
  'Saudi Arabian', 'South Korean', 'Spanish', 'Syrian', 'Turkish', 'Other'
];

export function StudentRegistration({ onBack, onRegister }: StudentRegistrationProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.nationality) newErrors.nationality = 'Please select your nationality';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        // The nationality is not part of the registration serializer on the backend,
        // but it would be collected in the first application form.
        password: formData.password,
        password2: formData.confirmPassword,
      };

      await apiService.post('/v1/auth/register/', payload);
      
      toast.success('Account Created Successfully!', {
        description: 'You will now be redirected to the login page.',
        duration: 3000,
      });

      setTimeout(() => {
        onRegister(); // Navigate to the login page as per props
      }, 1500);

    } catch (error: any) {
      if (error.response?.data) {
        // Handle specific validation errors from the backend (e.g., email already exists)
        const apiErrors = error.response.data;
        const flatErrors: Record<string, string> = {};
        let generalErrorDescription = '';

        for (const key in apiErrors) {
            flatErrors[key] = apiErrors[key][0];
            generalErrorDescription += `${apiErrors[key][0]} `;
        }
        setErrors(flatErrors);
        toast.error('Registration Failed', {
            description: generalErrorDescription || 'Please check the form for errors.',
        });
      } else {
        toast.error('Registration Failed', {
          description: 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-500/10">
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"><GraduationCap className="w-8 h-8 text-primary-foreground" /></div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Create Your Student Account</h1>
            <p className="text-muted-foreground text-center max-w-sm mx-auto">Join thousands of students managing their applications seamlessly</p>
          </div>
          <Card className="card-modern shadow-xl border-white/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Student Registration</CardTitle>
                <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /><span>Back to Login</span></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center space-x-2"><User className="w-4 h-4 text-muted-foreground" /><span>Full Name</span></Label>
                <Input id="fullName" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Enter your full name" className={errors.fullName ? 'border-destructive' : ''} />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2"><Globe className="w-4 h-4 text-muted-foreground" /><span>Nationality</span></Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}><SelectTrigger className={errors.nationality ? 'border-destructive' : ''}><SelectValue placeholder="Select your nationality" /></SelectTrigger><SelectContent className="max-h-60">{nationalityOptions.map((n) => (<SelectItem key={n} value={n}>{n}</SelectItem>))}</SelectContent></Select>
                {errors.nationality && <p className="text-sm text-destructive">{errors.nationality}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2"><Mail className="w-4 h-4 text-muted-foreground" /><span>Email Address</span></Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter your email address" className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2"><Lock className="w-4 h-4 text-muted-foreground" /><span>Password</span></Label>
                <div className="relative"><Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Create a secure password" className={`pr-10 ${errors.password ? 'border-destructive' : ''}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center space-x-2"><Lock className="w-4 h-4 text-muted-foreground" /><span>Confirm Password</span></Label>
                <div className="relative"><Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm your password" className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)} className="mt-0.5" />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">I agree to the <button className="text-primary hover:underline">Terms of Service</button> and <button className="text-primary hover:underline">Privacy Policy</button></Label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full button-primary h-12 text-base" size="lg">
                {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
              <div className="text-center pt-2"><button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">Already have an account? Sign in</button></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
// end of frontend/src/components/StudentRegistration.tsx