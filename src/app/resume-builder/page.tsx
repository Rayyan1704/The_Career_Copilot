"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileUser, Download, Eye, Edit3, Briefcase, GraduationCap, Award } from "lucide-react";

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
}

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for tech and creative roles',
    icon: Edit3,
    preview: 'A sleek, minimalist design with clear sections and modern typography'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional layout ideal for senior positions and management roles',
    icon: Briefcase,
    preview: 'Traditional, authoritative design with emphasis on leadership experience'
  },
  {
    id: 'academic',
    name: 'Academic & Research',
    description: 'Detailed format perfect for academic, research, and scientific positions',
    icon: GraduationCap,
    preview: 'Comprehensive layout with sections for publications, research, and achievements'
  }
];

export default function ResumeBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: []
  });

  const steps = [
    'Choose Template',
    'Personal Info',
    'Professional Summary',
    'Work Experience',
    'Education',
    'Skills',
    'Preview & Download'
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep(1);
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const generateResume = () => {
    // This would generate the actual resume document
    alert('Resume generation feature coming soon! This will create a downloadable PDF based on your selected template.');
  };

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold mb-2">Resume Builder</h1>
              <p className="text-muted-foreground">
                Choose from our professional, ATS-friendly templates to build your perfect resume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => {
                const Icon = template.icon;
                
                return (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTemplateSelect(template.id)}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <CardDescription>
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg mb-4 min-h-[120px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground text-center">
                          {template.preview}
                        </p>
                      </div>
                      <Button className="w-full">
                        Select Template
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    ATS-Optimized Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">✓ ATS-Friendly Format</h4>
                      <p className="text-muted-foreground">Clean structure that passes through Applicant Tracking Systems</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">✓ Professional Design</h4>
                      <p className="text-muted-foreground">Modern layouts that impress hiring managers</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">✓ Keyword Optimized</h4>
                      <p className="text-muted-foreground">Built-in guidance for industry-specific keywords</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube Resume Tutorials
                  </CardTitle>
                  <CardDescription>
                    Learn from the best resume building experts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">How to Write a Resume in 2025 (NEW)</h4>
                        <p className="text-xs text-muted-foreground">by CareerVidz • 450K views • 2 weeks ago</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                          Watch
                        </a>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">ATS Resume Secrets for 2025</h4>
                        <p className="text-xs text-muted-foreground">by Austin Belcak • 320K views • 1 month ago</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                          Watch
                        </a>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">AI-Proof Resume Strategy 2025</h4>
                        <p className="text-xs text-muted-foreground">by Jeff Su • 280K views • 3 weeks ago</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                          Watch
                        </a>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">Resume Format That Gets Interviews (2025)</h4>
                        <p className="text-xs text-muted-foreground">by Deniz Sasal • 195K views • 1 week ago</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                          Watch
                        </a>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">ChatGPT Resume Writing Guide 2025</h4>
                        <p className="text-xs text-muted-foreground">by Ali Abdaal • 410K views • 2 weeks ago</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                          Watch
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Resume Builder</h1>
            <p className="text-muted-foreground">
              Step {currentStep} of {steps.length - 1}: {steps[currentStep]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={index} className={`text-xs ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, name: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Location (City, State)"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="LinkedIn Profile"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="Website/Portfolio (Optional)"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, website: e.target.value }
                    }))}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <Textarea
                  placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
                  className="min-h-[120px]"
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                />
              )}

              {currentStep === 5 && (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resumeData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              )}

              {currentStep === 6 && (
                <div className="text-center py-8">
                  <FileUser className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Resume Preview</h3>
                  <p className="text-muted-foreground mb-6">
                    Your resume is ready! Preview and download your professional resume.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button onClick={generateResume}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}