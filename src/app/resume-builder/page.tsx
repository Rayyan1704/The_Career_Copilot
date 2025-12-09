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

  const [showPreview, setShowPreview] = useState(false);

  const generateResumeHTML = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${resumeData.personalInfo.name} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; padding: 40px; max-width: 850px; margin: 0 auto; }
    h1 { font-size: 32px; margin-bottom: 8px; color: #1a1a1a; }
    h2 { font-size: 20px; margin-top: 24px; margin-bottom: 12px; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 4px; }
    h3 { font-size: 16px; margin-bottom: 4px; color: #1a1a1a; }
    .contact-info { margin-bottom: 20px; font-size: 14px; color: #666; }
    .contact-info a { color: #2563eb; text-decoration: none; }
    .section { margin-bottom: 24px; }
    .experience-item, .education-item { margin-bottom: 16px; }
    .job-title { font-weight: bold; font-size: 16px; }
    .company { color: #666; font-size: 14px; }
    .duration { color: #888; font-size: 13px; font-style: italic; }
    .description { margin-top: 8px; font-size: 14px; white-space: pre-wrap; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-badge { background: #e5e7eb; padding: 6px 12px; border-radius: 4px; font-size: 13px; }
    .summary { font-size: 14px; line-height: 1.8; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${resumeData.personalInfo.name}</h1>
  <div class="contact-info">
    ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}
    ${resumeData.personalInfo.linkedin ? `| <a href="${resumeData.personalInfo.linkedin}">LinkedIn</a>` : ''}
    ${resumeData.personalInfo.website ? `| <a href="${resumeData.personalInfo.website}">Portfolio</a>` : ''}
  </div>

  ${resumeData.summary ? `
  <div class="section">
    <h2>Professional Summary</h2>
    <p class="summary">${resumeData.summary}</p>
  </div>
  ` : ''}

  ${resumeData.experience.length > 0 ? `
  <div class="section">
    <h2>Work Experience</h2>
    ${resumeData.experience.map(exp => `
      <div class="experience-item">
        <div class="job-title">${exp.title}</div>
        <div class="company">${exp.company}</div>
        <div class="duration">${exp.duration}</div>
        <div class="description">${exp.description}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${resumeData.education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${resumeData.education.map(edu => `
      <div class="education-item">
        <div class="job-title">${edu.degree}</div>
        <div class="company">${edu.school}</div>
        <div class="duration">${edu.year}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${resumeData.skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <div class="skills">
      ${resumeData.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
    </div>
  </div>
  ` : ''}
</body>
</html>
    `;
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleDownload = () => {
    const html = generateResumeHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

              {currentStep === 3 && (
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Experience {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setResumeData(prev => ({
                            ...prev,
                            experience: prev.experience.filter((_, i) => i !== index)
                          }))}
                        >
                          Remove
                        </Button>
                      </div>
                      <Input
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => {
                          const newExperience = [...resumeData.experience];
                          newExperience[index].title = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: newExperience }));
                        }}
                      />
                      <Input
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => {
                          const newExperience = [...resumeData.experience];
                          newExperience[index].company = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: newExperience }));
                        }}
                      />
                      <Input
                        placeholder="Duration (e.g., Jan 2020 - Present)"
                        value={exp.duration}
                        onChange={(e) => {
                          const newExperience = [...resumeData.experience];
                          newExperience[index].duration = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: newExperience }));
                        }}
                      />
                      <Textarea
                        placeholder="Job description and key achievements..."
                        className="min-h-[100px]"
                        value={exp.description}
                        onChange={(e) => {
                          const newExperience = [...resumeData.experience];
                          newExperience[index].description = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: newExperience }));
                        }}
                      />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full">
                    + Add Experience
                  </Button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Education {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setResumeData(prev => ({
                            ...prev,
                            education: prev.education.filter((_, i) => i !== index)
                          }))}
                        >
                          Remove
                        </Button>
                      </div>
                      <Input
                        placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...resumeData.education];
                          newEducation[index].degree = e.target.value;
                          setResumeData(prev => ({ ...prev, education: newEducation }));
                        }}
                      />
                      <Input
                        placeholder="School/University Name"
                        value={edu.school}
                        onChange={(e) => {
                          const newEducation = [...resumeData.education];
                          newEducation[index].school = e.target.value;
                          setResumeData(prev => ({ ...prev, education: newEducation }));
                        }}
                      />
                      <Input
                        placeholder="Graduation Year (e.g., 2020)"
                        value={edu.year}
                        onChange={(e) => {
                          const newEducation = [...resumeData.education];
                          newEducation[index].year = e.target.value;
                          setResumeData(prev => ({ ...prev, education: newEducation }));
                        }}
                      />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addEducation} className="w-full">
                    + Add Education
                  </Button>
                </div>
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
                <div>
                  {!showPreview ? (
                    <div className="text-center py-8">
                      <FileUser className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Resume Preview</h3>
                      <p className="text-muted-foreground mb-6">
                        Your resume is ready! Preview and download your professional resume.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={handlePreview}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button onClick={handleDownload}>
                          <Download className="mr-2 h-4 w-4" />
                          Download HTML
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Resume Preview</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                            Close Preview
                          </Button>
                          <Button size="sm" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download HTML
                          </Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-8 bg-white text-black max-h-[600px] overflow-y-auto">
                        <div className="max-w-[850px] mx-auto">
                          <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
                          <div className="text-sm text-gray-600 mb-6">
                            {resumeData.personalInfo.email} | {resumeData.personalInfo.phone} | {resumeData.personalInfo.location}
                            {resumeData.personalInfo.linkedin && ` | ${resumeData.personalInfo.linkedin}`}
                            {resumeData.personalInfo.website && ` | ${resumeData.personalInfo.website}`}
                          </div>

                          {resumeData.summary && (
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-2 text-blue-600 border-b-2 border-blue-600 pb-1">Professional Summary</h2>
                              <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                            </div>
                          )}

                          {resumeData.experience.length > 0 && (
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1">Work Experience</h2>
                              {resumeData.experience.map((exp, index) => (
                                <div key={index} className="mb-4">
                                  <div className="font-semibold">{exp.title}</div>
                                  <div className="text-sm text-gray-600">{exp.company}</div>
                                  <div className="text-xs text-gray-500 italic mb-2">{exp.duration}</div>
                                  <div className="text-sm whitespace-pre-wrap">{exp.description}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {resumeData.education.length > 0 && (
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1">Education</h2>
                              {resumeData.education.map((edu, index) => (
                                <div key={index} className="mb-3">
                                  <div className="font-semibold">{edu.degree}</div>
                                  <div className="text-sm text-gray-600">{edu.school}</div>
                                  <div className="text-xs text-gray-500">{edu.year}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {resumeData.skills.length > 0 && (
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-3 text-blue-600 border-b-2 border-blue-600 pb-1">Skills</h2>
                              <div className="flex flex-wrap gap-2">
                                {resumeData.skills.map((skill, index) => (
                                  <span key={index} className="bg-gray-200 px-3 py-1 rounded text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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