import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { 
  Info,
  ArrowLeft,
  Shield,
  Users,
  Mail
} from 'lucide-react';

interface StaffRegistrationInfoProps {
  onBack: () => void;
}

export function StaffRegistrationInfo({ onBack }: StaffRegistrationInfoProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-500/10 font-family-persian" dir="rtl">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg">
          {/* Information Card */}
          <Card className="card-modern shadow-xl border-white/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-12">
              {/* Large Info Icon */}
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Info className="w-10 h-10 text-primary" />
              </div>

              {/* Title */}
              <h1 className="persian-heading text-2xl text-foreground mb-6">
                راهنمای ایجاد حساب کاربری همکاران
              </h1>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Main Message */}
              <div className="text-center space-y-6">
                <p className="persian-body text-muted-foreground leading-relaxed text-base">
                  حساب‌های کاربری همکاران سازمان و دانشگاه، برای حفظ امنیت، توسط مدیر سیستم ایجاد می‌شود. 
                  لطفاً برای دریافت حساب کاربری با مدیر سیستم در سازمان خود تماس بگیرید. 
                  پس از ایجاد حساب، اطلاعات ورود از طریق ایمیل برای شما ارسال خواهد شد.
                </p>
              </div>

              {/* Visual Elements */}
              <div className="grid grid-cols-3 gap-6 py-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <p className="persian-caption text-muted-foreground text-xs">
                    امنیت بالا
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="persian-caption text-muted-foreground text-xs">
                    کنترل مدیر
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <p className="persian-caption text-muted-foreground text-xs">
                    اطلاع‌رسانی ایمیل
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border my-6"></div>

              {/* Additional Information */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="persian-caption text-foreground">
                      نکته مهم:
                    </p>
                    <p className="persian-body text-muted-foreground text-sm leading-relaxed">
                      حساب‌های کاربری همکاران دارای سطوح دسترسی متفاوتی هستند که توسط مدیر سیستم تعریف می‌شود. 
                      این روش برای تضمین امنیت و کنترل بهتر دسترسی‌ها اعمال شده است.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  onClick={onBack}
                  className="w-full button-primary h-12 persian-text"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 ml-2" />
                  بازگشت به صفحه ورود
                </Button>
              </div>

              {/* Contact Information */}
              <div className="text-center pt-4">
                <p className="persian-body text-muted-foreground text-sm">
                  نیاز به کمک دارید؟ با واحد پشتیبانی تماس بگیرید
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-secondary-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}