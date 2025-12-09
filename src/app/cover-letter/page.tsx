"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { FileUploadInput } from "@/components/file-upload-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractTextFromFile } from "@/lib/file-utils";
import { generateCoverLetter } from "@/lib/actions";
import { Loader2, Copy, Download, FileEdit } from "lucide-react";

export default function CoverLetterPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    console.log('[cover-letter] handleGenerate invoked', { resumeFile, jobDescFile, applicantName });

    if (!resumeFile || !jobDescFile || !applicantName.trim()) {
      console.log('[cover-letter] validation failed - missing inputs');
      setError('Please upload both resume and job description, and enter your name');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCoverLetter(null);

    try {
      console.log('[cover-letter] extracting text from files...');
      const [resumeText, jobDescText] = await Promise.all([
        extractTextFromFile(resumeFile),
        extractTextFromFile(jobDescFile)
      ]);
      console.log('[cover-letter] extracted texts', { 
        resumeTextLength: resumeText.length, 
        jobDescTextLength: jobDescText.length 
      });

      if (!resumeText || !jobDescText) {
        throw new Error('Failed to extract text from uploaded files');
      }
      
      console.log('[cover-letter] calling generateCoverLetter...');
      const response = await generateCoverLetter(resumeText, jobDescText, applicantName.trim());
      console.log('[cover-letter] response received', { success: response.success });
      
      if (response.success && response.data) {
        console.log('[cover-letter] cover letter generated successfully');
        setCoverLetter(response.data.coverLetter);
        setError(null);
      } else {
        console.error('[cover-letter] generation failed', response.error);
        setError(response.error || 'Failed to generate cover letter');
        setCoverLetter(null);
      }
    } catch (err) {
      console.error('[cover-letter] generation error', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating the cover letter');
      setCoverLetter(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (coverLetter) {
      await navigator.clipboard.writeText(coverLetter);
    }
  };

  const handleDownload = () => {
    if (coverLetter) {
      const blob = new Blob([coverLetter], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover-letter-${applicantName.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="px-4 py-8">
        {/* Page Header */}
        <div className={`mb-8 ${coverLetter ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          <h1 className="text-3xl font-heading font-bold mb-2 text-center">Cover Letter Generator</h1>
          <p className="text-muted-foreground text-center">
            Generate personalized cover letters tailored to specific job opportunities.
          </p>
        </div>

        {/* Dynamic Layout Container */}
        <div className={`${coverLetter ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          {coverLetter ? (
            /* Two-column layout when results are shown */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Upload section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-32">
                  <CardHeader>
                    <CardTitle>Cover Letter Generator</CardTitle>
                    <CardDescription>
                      Upload your resume and job description, then enter your name to generate a personalized cover letter
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Your Resume</h4>
                      <FileUploadInput
                        onFileChange={setResumeFile}
                        label="Upload your resume"
                        accept=".pdf,.docx,.txt"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Job Description</h4>
                      <FileUploadInput
                        onFileChange={setJobDescFile}
                        label="Upload job description"
                        accept=".pdf,.docx,.txt"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Your Full Name</h4>
                      <Input
                        placeholder="Enter your full name"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                      />
                    </div>

                    <div className="pt-2 border-t">
                      <Button 
                        onClick={handleGenerate}
                        disabled={!resumeFile || !jobDescFile || !applicantName.trim() || isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Cover Letter...
                          </>
                        ) : (
                          <>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Generate Cover Letter
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Results */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Generated Cover Letter</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {error ? (
                      <div className="p-4 border border-destructive/20 rounded-md bg-destructive/10">
                        <p className="text-destructive text-sm">{error}</p>
                      </div>
                    ) : (
                      <Textarea
                        value={coverLetter || ''}
                        readOnly
                        className="min-h-[400px] font-mono text-sm"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Centered layout when no results */
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Cover Letter Generator</CardTitle>
                <CardDescription>
                  Upload your resume and job description, then enter your name to generate a personalized cover letter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Your Resume</h4>
                    <FileUploadInput
                      onFileChange={setResumeFile}
                      label="Upload your resume"
                      accept=".pdf,.docx,.txt"
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Job Description</h4>
                    <FileUploadInput
                      onFileChange={setJobDescFile}
                      label="Upload job description"
                      accept=".pdf,.docx,.txt"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Your Full Name</h4>
                  <Input
                    placeholder="Enter your full name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </div>

                <div className="pt-2 border-t">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!resumeFile || !jobDescFile || !applicantName.trim() || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Cover Letter...
                      </>
                    ) : (
                      <>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Generate Cover Letter
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="pt-4 border-t border-destructive/20">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}