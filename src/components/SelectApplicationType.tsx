import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  ArrowRight,
  GraduationCap, 
  Globe, 
  Plane, 
  BookOpen, 
  HelpCircle,
  FileText,
  Award,
  Shield,
  Phone,
  CircleCheckBig
} from 'lucide-react';
import { toast } from 'sonner';

interface SelectApplicationTypeProps {
  onBack: () => void;
  onSelectType: (type: string) => void;
  onNavigate?: (page: string) => void;
}

const applicationCategories = [
  { id: "admissions", title: "Admissions & Scholarships", icon: GraduationCap, description: "Apply for new admissions and scholarship opportunities", applications: [
      { id: "new-admission-application", title: "New Admission Application", description: "Apply for undergraduate, graduate, or doctoral programs", icon: FileText, enabled: true },
      { id: "faculty-scholarship", title: "Faculty Scholarship Registration", description: "Register for faculty-sponsored scholarship programs", icon: Award, enabled: false }
  ]},
  { id: "consular", title: "Consular Affairs (Visa & Residency)", icon: Globe, description: "Manage your visa and residency documentation", applications: [
      { id: "visa-extension", title: "Visa Extension", description: "Extend your current student visa", icon: Shield, enabled: false }
  ]},
  { id: "travel", title: "Travel & Exit Permits", icon: Plane, description: "Request permits for travel and university transfers", applications: [
      { id: "internal-exit", title: "Internal Exit Permit", description: "Get permission for domestic university transfer", icon: Plane, enabled: false }
  ]},
  { id: "academic", title: "Academic Affairs", icon: BookOpen, description: "Handle academic documents and special requests", applications: [
      { id: "document-authentication", title: "Authentication of Academic Documents", description: "Authenticate and verify your academic credentials", icon: CircleCheckBig, enabled: false }
  ]},
  { id: "support", title: "General Support", icon: Phone, description: "Get help and submit complaints or support requests", applications: [
      { id: "file-complaint", title: "File a Complaint", description: "Report issues or submit formal complaints", icon: HelpCircle, enabled: false }
  ]}
];

// FIX: FAQ items restored
const faqItems = [
  { question: "What documents do I need for a new admission application?", answer: "You'll need your passport, academic transcripts, language proficiency certificates, statement of purpose, and recommendation letters. Additional documents may be required based on your program." },
  { question: "How long does visa extension processing take?", answer: "Standard visa extension processing takes 2-4 weeks. We recommend applying at least 6 weeks before your current visa expires to avoid any complications." },
  { question: "Can I track my application status online?", answer: "Yes! Once you submit an application, you'll receive a tracking number. You can monitor your application progress in the 'My Applications' section of your dashboard." },
  { question: "What if I need help choosing the right application type?", answer: "Contact our support team through the Support Center, or schedule a consultation with our academic advisors who can guide you based on your specific situation." }
];

export function SelectApplicationType({ onBack, onSelectType }: SelectApplicationTypeProps) {
  const handleApplicationClick = (applicationId: string, isEnabled: boolean) => {
    if (isEnabled) {
      onSelectType(applicationId);
    } else {
      toast.info('Feature Not Implemented', {
        description: 'This application form is for demonstration purposes and is not yet available.',
        duration: 4000
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
        <div className="container-modern section-padding">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">Select Your Application Type</h1>
                <p className="text-muted-foreground text-base">Choose a category, then select a specific application type to begin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Accordion type="single" collapsible className="space-y-4" defaultValue="admissions">
                        {applicationCategories.map((category) => {
                            const CategoryIcon = category.icon;
                            return (
                                <AccordionItem key={category.id} value={category.id} className="border border-border rounded-xl bg-card shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
                                    <AccordionTrigger className="px-5 py-4 hover:no-underline group">
                                        <div className="flex items-center space-x-4 text-left w-full">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                                                <CategoryIcon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-primary-600 transition-colors">{category.title}</h3>
                                                <p className="text-base text-muted-foreground leading-relaxed">{category.description}</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-5 pb-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                            {category.applications.map((app) => {
                                                const AppIcon = app.icon;
                                                return (
                                                    <div
                                                        key={app.id}
                                                        onClick={() => handleApplicationClick(app.id, app.enabled)}
                                                        // FIX: Restored the hover animations
                                                        className={`group p-4 border-2 rounded-xl transition-all duration-300 flex flex-col justify-between min-h-[140px] transform hover:scale-[1.02] ${app.enabled ? 'cursor-pointer hover:border-primary-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:from-primary-50/30 hover:to-primary-50/10' : 'cursor-not-allowed bg-muted/50 opacity-70'}`}
                                                    >
                                                        <div>
                                                          <div className="flex items-start space-x-3 mb-3">
                                                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-200 shadow-sm ${app.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                                                                  <AppIcon className={`w-5 h-5 ${app.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                                                              </div>
                                                              <div className="flex-1 min-w-0">
                                                                  <div className="flex items-center justify-between">
                                                                      <h4 className={`font-semibold transition-colors leading-tight text-base ${app.enabled ? 'text-foreground group-hover:text-primary-700' : 'text-muted-foreground'}`}>{app.title}</h4>
                                                                      {app.enabled && <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-600 transition-all duration-200 flex-shrink-0 ml-2 group-hover:translate-x-1" />}
                                                                  </div>
                                                                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{app.description}</p>
                                                              </div>
                                                          </div>
                                                        </div>
                                                        {app.enabled && (
                                                            <div className="mt-auto pt-2 flex justify-center">
                                                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary group-hover:shadow-sm transition-all duration-200">
                                                                    Start Application
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
                
                {/* FIX: Restored the FAQ section */}
                <div className="lg:col-span-1">
                  <Card className="bg-card border border-border shadow-sm sticky top-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <span>Frequently Asked Questions</span>
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground">
                        Common questions about applications and processes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Accordion type="single" collapsible>
                        {faqItems.map((faq, index) => (
                          <AccordionItem key={index} value={`faq-${index}`} className="border-b border-border last:border-b-0">
                            <AccordionTrigger className="py-3 hover:no-underline text-left">
                              <span className="text-base font-medium text-foreground pr-2">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-3">
                              <p className="text-base text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
            </div>
        </div>
    </div>
  );
}