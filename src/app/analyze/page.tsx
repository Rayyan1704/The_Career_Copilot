"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { FileUploadInput } from "@/components/file-upload-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { extractTextFromFile } from "@/lib/file-utils";
import { analyzeResume } from "@/lib/actions";
import { Loader2, User, Mail, Phone, MapPin, Target, Lightbulb } from "lucide-react";

interface AnalysisResult {
  atsScore: number;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  summary: string;
  skills: string[];
  recommendations: string[];
}

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const resumeText = await extractTextFromFile(file);
      const response = await analyzeResume(resumeText);
      
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to analyze resume');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="px-4 py-8">
        {/* Page Header */}
        <div className={`mb-8 ${result ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          <h1 className="text-3xl font-heading font-bold mb-2 text-center">AI Resume Analyzer</h1>
          <p className="text-muted-foreground text-center">
            Upload your resume to get detailed feedback, ATS scoring, and improvement suggestions.
          </p>
        </div>

        {/* Dynamic Layout Container */}
        <div className={`${result ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          {result ? (
            /* Two-column layout when results are shown */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Upload section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-32">
                  <CardHeader>
                    <CardTitle>Upload Resume</CardTitle>
                    <CardDescription>
                      Upload your resume in PDF, DOCX, or TXT format for analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileUploadInput
                      onFileChange={setFile}
                      label="Upload your resume"
                      accept=".pdf,.docx,.txt"
                    />
                    
                    <Button 
                      onClick={handleAnalyze}
                      disabled={!file || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Resume...
                        </>
                      ) : (
                        'Analyze Resume'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Results */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* ATS Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        ATS Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={result.atsScore} className="h-3" />
                        </div>
                        <div className="text-2xl font-bold">
                          {result.atsScore}%
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {result.atsScore >= 80 ? 'Excellent ATS compatibility' :
                         result.atsScore >= 60 ? 'Good ATS compatibility with room for improvement' :
                         'Needs significant improvement for ATS compatibility'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.contactInfo.name && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{result.contactInfo.name}</span>
                          </div>
                        )}
                        {result.contactInfo.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{result.contactInfo.email}</span>
                          </div>
                        )}
                        {result.contactInfo.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{result.contactInfo.phone}</span>
                          </div>
                        )}
                        {result.contactInfo.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{result.contactInfo.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{result.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Extracted Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Improvement Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-sm">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Centered layout when no results */
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Upload Resume</CardTitle>
                  <CardDescription>
                    Upload your resume in PDF, DOCX, or TXT format for analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FileUploadInput
                    onFileChange={setFile}
                    label="Upload your resume"
                    accept=".pdf,.docx,.txt"
                  />
                  
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!file || isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      'Analyze Resume'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {error && (
                <Card className="mb-8 border-destructive">
                  <CardContent className="pt-6">
                    <p className="text-destructive">{error}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}