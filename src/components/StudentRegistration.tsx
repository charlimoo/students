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
  onRegister: () => void; 
}

// Define translations for the registration page
const registrationTranslations = {
  en: {
    pageTitle: 'Create Your Student Account',
    pageSubtitle: 'Join thousands of students managing their applications seamlessly',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    nationalityLabel: 'Nationality',
    nationalityPlaceholder: 'Select your nationality',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Create a secure password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    termsLabel: 'I agree to the',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    createAccountButton: 'Create Account',
    creatingAccountButton: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account? Sign in',
    fullNameError: 'Full name is required',
    nationalityError: 'Please select your nationality',
    emailError: 'Email address is required',
    emailInvalidError: 'Please enter a valid email address',
    passwordError: 'Password is required',
    passwordLengthError: 'Password must be at least 8 characters long',
    confirmPasswordMismatchError: 'Passwords do not match',
    agreeToTermsError: 'You must agree to the terms',
    registrationSuccess: 'Account Created Successfully!',
    registrationSuccessDescription: 'You will now be redirected to the login page.',
    registrationFailedTitle: 'Registration Failed',
    registrationFailedDescription: 'Please check the form for errors.',
    unexpectedErrorDescription: 'An unexpected error occurred. Please try again later.',
  },
  fa: {
    pageTitle: 'ساخت حساب کاربری دانشجو',
    pageSubtitle: 'به هزاران دانشجو بپیوندید که درخواست‌های خود را به طور یکپارچه مدیریت می‌کنند',
    fullNameLabel: 'نام کامل',
    fullNamePlaceholder: 'نام کامل خود را وارد کنید',
    nationalityLabel: 'ملیت',
    nationalityPlaceholder: 'ملیت خود را انتخاب کنید',
    emailLabel: 'آدرس ایمیل',
    emailPlaceholder: 'آدرس ایمیل خود را وارد کنید',
    passwordLabel: 'رمز عبور',
    passwordPlaceholder: 'یک رمز عبور امن ایجاد کنید',
    confirmPasswordLabel: 'تأیید رمز عبور',
    confirmPasswordPlaceholder: 'رمز عبور خود را تأیید کنید',
    termsLabel: 'من موافقم با',
    termsOfService: 'شرایط خدمات',
    privacyPolicy: 'سیاست حفظ حریم خصوصی',
    createAccountButton: 'ساخت حساب کاربری',
    creatingAccountButton: 'در حال ساخت حساب...',
    alreadyHaveAccount: 'قبلا حساب کاربری دارید؟ وارد شوید',
    fullNameError: 'نام کامل الزامی است',
    nationalityError: 'لطفا ملیت خود را انتخاب کنید',
    emailError: 'آدرس ایمیل الزامی است',
    emailInvalidError: 'لطفا یک آدرس ایمیل معتبر وارد کنید',
    passwordError: 'رمز عبور الزامی است',
    passwordLengthError: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
    confirmPasswordMismatchError: 'رمزهای عبور مطابقت ندارند',
    agreeToTermsError: 'شما باید با شرایط موافقت کنید',
    registrationSuccess: 'حساب با موفقیت ایجاد شد!',
    registrationSuccessDescription: 'شما اکنون به صفحه ورود هدایت خواهید شد.',
    registrationFailedTitle: 'ثبت نام ناموفق',
    registrationFailedDescription: 'لطفا فرم را برای خطاها بررسی کنید.',
    unexpectedErrorDescription: 'خطای غیرمنتظره‌ای رخ داد. لطفا بعدا دوباره تلاش کنید.',
  }
};

const nationalityOptions = [
  'Afghan', 'American', 'Australian', 'Austrian', 'Azerbaijani', 'Bangladeshi',
  'Belgian', 'Brazilian', 'British', 'Canadian', 'Chinese', 'Egyptian',
  'French', 'German', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Italian',
  'Japanese', 'Jordanian', 'Lebanese', 'Malaysian', 'Pakistani', 'Russian',
  'Saudi Arabian', 'South Korean', 'Spanish', 'Syrian', 'Turkish', 'Other',
  // Persian translations for nationality (optional, for better UX if language is Persian)
  'افغان', 'آمریکایی', 'استرالیایی', 'اتریشی', 'آذربایجانی', 'بنگلادشی',
  'بلژیکی', 'برزیلی', 'بریتانیایی', 'کانادایی', 'چینی', 'مصری',
  'فرانسوی', 'آلمانی', 'هندی', 'اندونزیایی', 'ایرانی', 'عراقی', 'ایتالیایی',
  'ژاپنی', 'اردنی', 'لبنانی', 'مالزیایی', 'پاکستانی', 'روسی',
  'عربستانی', 'کره جنوبی', 'اسپانیایی', 'سوری', 'ترکی', 'سایر'
];

export function StudentRegistration({ onBack, onRegister }: StudentRegistrationProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fa'>('en'); // Default to English
  const isRTL = language === 'fa';
  
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Select the appropriate translation set
  const t = registrationTranslations[language] || registrationTranslations['en'];

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = t.fullNameError;
    if (!formData.nationality) newErrors.nationality = t.nationalityError;
    if (!formData.email.trim()) newErrors.email = t.emailError;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.emailInvalidError;
    if (!formData.password) newErrors.password = t.passwordError;
    else if (formData.password.length < 8) newErrors.password = t.passwordLengthError;
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t.confirmPasswordMismatchError;
    if (!formData.agreeToTerms) newErrors.agreeToTerms = t.agreeToTermsError;

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
      
      toast.success(t.registrationSuccess, {
        description: t.registrationSuccessDescription,
        duration: 3000,
      });

      setTimeout(() => {
        onRegister(); 
      }, 1500);

    } catch (error: any) {
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const flatErrors: Record<string, string> = {};
        let generalErrorDescription = '';

        for (const key in apiErrors) {
            // Map backend error keys to form field names if necessary
            const formKey = key === 'password' ? 'password' : key === 'email' ? 'email' : key;
            flatErrors[formKey] = apiErrors[key][0];
            generalErrorDescription += `${apiErrors[key][0]} `;
        }
        setErrors(flatErrors);
        toast.error(t.registrationFailedTitle, {
            description: generalErrorDescription || t.registrationFailedDescription,
        });
      } else {
        toast.error(t.registrationFailedTitle, {
          description: t.unexpectedErrorDescription,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-secondary-500/10 ${isRTL ? 'font-family-persian' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <Select value={language} onValueChange={(value: 'en' | 'fa') => setLanguage(value)}>
          <SelectTrigger className={`w-32 bg-white/90 backdrop-blur-sm border-white/20 shadow-sm ${isRTL ? 'persian-text' : ''}`}>
            <div className="flex items-center space-x-2 space-x-reverse gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent align={isRTL ? 'start' : 'end'} dir={isRTL ? 'rtl' : 'ltr'}>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fa" className="persian-text">فارسی</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"><GraduationCap className="w-8 h-8 text-primary-foreground" /></div>
            <h1 className={`text-3xl font-bold text-foreground mb-3 ${isRTL ? 'persian-heading' : ''}`}>{t.pageTitle}</h1>
            <p className={`text-muted-foreground text-center max-w-sm mx-auto ${isRTL ? 'persian-body' : ''}`}>{t.pageSubtitle}</p>
          </div>
          <Card className="card-modern shadow-xl border-white/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xl ${isRTL ? 'persian-heading' : ''}`}>{t.createAccountButton}</CardTitle>

              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} ${isRTL ? 'persian-caption' : ''}`}><User className="w-4 h-4 text-muted-foreground" /><span>{t.fullNameLabel}</span></Label>
                <Input id="fullName" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder={t.fullNamePlaceholder} className={`input-modern ${errors.fullName ? 'border-destructive' : ''} ${isRTL ? 'persian-body text-right' : 'persian-body'}`} />
                {errors.fullName && <p className={`text-sm text-destructive ${isRTL ? 'text-right' : ''}`}>{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} ${isRTL ? 'persian-caption' : ''}`}><Globe className="w-4 h-4 text-muted-foreground" /><span>{t.nationalityLabel}</span></Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger className={`${errors.nationality ? 'border-destructive' : ''} ${isRTL ? 'persian-text' : ''}`}>
                    <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} gap-2`}>
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder={t.nationalityPlaceholder} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className={`max-h-60 ${isRTL ? 'persian-body' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {nationalityOptions.map((n) => (<SelectItem key={n} value={n} className={`${isRTL && n.length > 3 ? 'persian-text' : ''}`}>{n}</SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.nationality && <p className={`text-sm text-destructive ${isRTL ? 'text-right' : ''}`}>{errors.nationality}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} ${isRTL ? 'persian-caption' : ''}`}><Mail className="w-4 h-4 text-muted-foreground" /><span>{t.emailLabel}</span></Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder={t.emailPlaceholder} className={`input-modern ${errors.email ? 'border-destructive' : ''} ${isRTL ? 'persian-body text-right' : 'persian-body'}`} dir="ltr" />
                {errors.email && <p className={`text-sm text-destructive ${isRTL ? 'text-right' : ''}`}>{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} ${isRTL ? 'persian-caption' : ''}`}><Lock className="w-4 h-4 text-muted-foreground" /><span>{t.passwordLabel}</span></Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder={t.passwordPlaceholder} className={`pr-10 input-modern ${errors.password ? 'border-destructive' : ''} ${isRTL ? 'persian-body text-right' : 'persian-body'}`} />

                </div>
                {errors.password && <p className={`text-sm text-destructive ${isRTL ? 'text-right' : ''}`}>{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} ${isRTL ? 'persian-caption' : ''}`}><Lock className="w-4 h-4 text-muted-foreground" /><span>{t.confirmPasswordLabel}</span></Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder={t.confirmPasswordPlaceholder} className={`pr-10 input-modern ${errors.confirmPassword ? 'border-destructive' : ''} ${isRTL ? 'persian-body text-right' : 'persian-body'}`} />

                </div>
                {errors.confirmPassword && <p className={`text-sm text-destructive ${isRTL ? 'text-right' : ''}`}>{errors.confirmPassword}</p>}
              </div>
              <div className="space-y-2">
                <div className={`flex items-start space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)} className="mt-0.5" />
                  <Label htmlFor="terms" className={`text-sm text-muted-foreground leading-relaxed cursor-pointer ${isRTL ? 'text-right' : ''} ${isRTL ? 'persian-body' : ''}`}>
                    {t.termsLabel} <button className="text-primary hover:underline">{t.termsOfService}</button> و <button className="text-primary hover:underline">{t.privacyPolicy}</button>
                  </Label>
                </div>
                {errors.agreeToTerms && <p className={`text-sm text-destructive ${isRTL ? 'text-right' : ''}`}>{errors.agreeToTerms}</p>}
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting} className={`w-full button-primary h-12 text-base ${isRTL ? 'persian-text' : ''}`} size="lg">
                {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                {isSubmitting ? t.creatingAccountButton : t.createAccountButton}
              </Button>
              <div className="text-center pt-2">
                <button onClick={onBack} className={`text-sm text-muted-foreground hover:text-foreground ${isRTL ? 'persian-body' : ''}`}>
                  {t.alreadyHaveAccount}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
// end of frontend/src/components/StudentRegistration.tsx