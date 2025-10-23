"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { FileUploadInput } from "@/components/file-upload-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { extractTextFromFile } from "@/lib/file-utils";
import { generateInterviewQuestions } from "@/lib/actions";
import { Loader2, MessageSquare, HelpCircle, Lightbulb } from "lucide-react";

interface Question {
  category: string;
  question: string;
  tips: string;
}

interface InterviewResult {
  questions: Question[];
}

export default function InterviewPrepPage() {
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobDescFile) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const jobDescText = await extractTextFromFile(jobDescFile);
      const response = await generateInterviewQuestions(jobDescText);
      
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to generate interview questions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technical': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Behavioral': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Situational': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Company': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Culture': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    };
    
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="px-4 py-8">
        {/* Page Header */}
        <div className={`mb-8 ${result ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          <h1 className="text-3xl font-heading font-bold mb-2 text-center">Interview Prep</h1>
          <p className="text-muted-foreground text-center">
            Get relevant interview questions based on job descriptions to practice and prepare.
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
                    <CardTitle>Upload Job Description</CardTitle>
                    <CardDescription>
                      Upload the job posting to generate relevant interview questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileUploadInput
                      onFileChange={setJobDescFile}
                      label="Upload job description"
                      accept=".pdf,.docx,.txt"
                    />
                    
                    <Button 
                      onClick={handleGenerate}
                      disabled={!jobDescFile || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Generate Questions
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Results */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-heading font-semibold mb-2">
                      Interview Questions
                    </h2>
                    <p className="text-muted-foreground">
                      Practice these questions to prepare for your interview
                    </p>
                  </div>

                  {result.questions.map((item, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          </div>
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Question:</h4>
                          <p className="text-foreground bg-muted p-3 rounded-lg">
                            {item.question}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Tips for answering:
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.tips}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Centered layout when no results */
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Upload Job Description</CardTitle>
                  <CardDescription>
                    Upload the job posting to generate relevant interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FileUploadInput
                    onFileChange={setJobDescFile}
                    label="Upload job description"
                    accept=".pdf,.docx,.txt"
                  />
                  
                  <Button 
                    onClick={handleGenerate}
                    disabled={!jobDescFile || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Generate Questions
                      </>
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