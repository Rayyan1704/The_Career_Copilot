"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { extractTextFromFile } from "@/lib/file-utils";
import { matchResumeToJobDescription } from "@/lib/actions";
import { Loader2, CheckCircle, XCircle, ExternalLink, User, Briefcase, Upload, Trash2, ChevronDown, ChevronUp, Award, AlertTriangle } from "lucide-react";

interface MatchResult {
  matchPercentage: number;
  matchingKeywords: string[];
  lackingSkills: Array<{
    skill: string;
    courseraUrl: string;
    courseName: string;
  }>;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  whyHire: string[];
  improvementAreas: string[];
}

type UserMode = 'job-seeker' | 'recruiter';

export default function MatchPage() {
  const [userMode, setUserMode] = useState<UserMode>('job-seeker');
  const [expandedDetails, setExpandedDetails] = useState<{[key: number]: boolean}>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [jobDescFiles, setJobDescFiles] = useState<File[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const [multiResults, setMultiResults] = useState<Array<{file: string, result: MatchResult}>>([]);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async () => {
    setIsMatching(true);
    setError(null);
    setMultiResults([]);

    try {
      if (userMode === 'job-seeker') {
        // Job seeker: Compare 1 resume against multiple jobs
        if (!resumeFile || jobDescFiles.length === 0) return;
        
        const resumeText = await extractTextFromFile(resumeFile);
        const results = [];
        
        for (const jobFile of jobDescFiles) {
          const jobDescText = await extractTextFromFile(jobFile);
          const response = await matchResumeToJobDescription(resumeText, jobDescText);
          
          if (response.success && response.data) {
            results.push({
              file: jobFile.name,
              result: response.data
            });
          }
        }
        
        // Sort by match percentage (highest first)
        results.sort((a, b) => b.result.matchPercentage - a.result.matchPercentage);
        setMultiResults(results);
        
      } else {
        // Recruiter: Compare multiple resumes against 1 job
        if (!jobDescFile || resumeFiles.length === 0) return;
        
        const jobDescText = await extractTextFromFile(jobDescFile);
        const results = [];
        
        for (const resumeFile of resumeFiles) {
          const resumeText = await extractTextFromFile(resumeFile);
          const response = await matchResumeToJobDescription(resumeText, jobDescText);
          
          if (response.success && response.data) {
            results.push({
              file: resumeFile.name,
              result: response.data
            });
          }
        }
        
        // Sort by match percentage (highest first)
        results.sort((a, b) => b.result.matchPercentage - a.result.matchPercentage);
        setMultiResults(results);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="px-4 py-8">
        {/* Page Header */}
        <div className={`mb-8 ${multiResults.length > 0 ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          <h1 className="text-3xl font-heading font-bold mb-2 text-center">Smart Matcher</h1>
          <p className="text-muted-foreground text-center">
            AI-powered matching for job seekers and recruiters.
          </p>
            
          {/* Mode Selectors */}
          <div className="flex gap-2 mt-4 justify-center">
            <Button
              variant={userMode === 'job-seeker' ? 'default' : 'outline'}
              onClick={() => setUserMode('job-seeker')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Job Seeker Mode
            </Button>
            <Button
              variant={userMode === 'recruiter' ? 'default' : 'outline'}
              onClick={() => setUserMode('recruiter')}
              className="flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Recruiter Mode
            </Button>
          </div>
        </div>

        {/* Dynamic Layout Container */}
        <div className={`${multiResults.length > 0 ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          {multiResults.length > 0 ? (
            /* Two-column layout when results are shown */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left column - Upload section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-32">
                  <CardHeader>
                    <CardTitle>Smart Matcher</CardTitle>
                    <CardDescription>
                      {userMode === 'job-seeker' 
                        ? 'Upload your resume and job descriptions to find your best matches'
                        : 'Upload job description and candidate resumes to rank candidates'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userMode === 'job-seeker' ? (
                      // Job Seeker Mode: Single resume vs multiple jobs
                      <>
                        <div>
                          <h4 className="font-medium mb-2">Your Resume</h4>
                          <div className="space-y-4">
                            <input
                              type="file"
                              accept=".pdf,.docx,.txt"
                              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                              className="hidden"
                              id="resume-file"
                            />
                            <label
                              htmlFor="resume-file"
                              className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                            >
                              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                              <p className="text-sm font-medium">Upload Your Resume</p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT file</p>
                            </label>
                            
                            {resumeFile && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Resume uploaded:</p>
                                <div className="flex items-center justify-between p-2 bg-muted rounded">
                                  <span className="text-sm">{resumeFile.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setResumeFile(null)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Job Opportunities</h4>
                          <div className="space-y-4">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.docx,.txt"
                              onChange={(e) => setJobDescFiles(Array.from(e.target.files || []))}
                              className="hidden"
                              id="job-files"
                            />
                            <label
                              htmlFor="job-files"
                              className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                            >
                              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                              <p className="text-sm font-medium">Upload Multiple Job Descriptions</p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT files</p>
                            </label>
                            
                            {jobDescFiles.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">{jobDescFiles.length} job(s) uploaded:</p>
                                {jobDescFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <span className="text-sm">{file.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setJobDescFiles(files => files.filter((_, i) => i !== index))}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Recruiter Mode: Single job vs multiple resumes
                      <>
                        <div>
                          <h4 className="font-medium mb-2">Job Description</h4>
                          <div className="space-y-4">
                            <input
                              type="file"
                              accept=".pdf,.docx,.txt"
                              onChange={(e) => setJobDescFile(e.target.files?.[0] || null)}
                              className="hidden"
                              id="job-desc-file"
                            />
                            <label
                              htmlFor="job-desc-file"
                              className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                            >
                              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                              <p className="text-sm font-medium">Upload Job Description</p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT file</p>
                            </label>
                            
                            {jobDescFile && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Job description uploaded:</p>
                                <div className="flex items-center justify-between p-2 bg-muted rounded">
                                  <span className="text-sm">{jobDescFile.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setJobDescFile(null)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Candidate Resumes</h4>
                          <div className="space-y-4">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.docx,.txt"
                              onChange={(e) => setResumeFiles(Array.from(e.target.files || []))}
                              className="hidden"
                              id="resume-files"
                            />
                            <label
                              htmlFor="resume-files"
                              className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                            >
                              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                              <p className="text-sm font-medium">Upload Multiple Resumes</p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT files</p>
                            </label>
                            
                            {resumeFiles.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">{resumeFiles.length} resume(s) uploaded:</p>
                                {resumeFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <span className="text-sm">{file.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setResumeFiles(files => files.filter((_, i) => i !== index))}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-2 border-t">
                      <Button 
                        onClick={handleMatch}
                        disabled={
                          isMatching || 
                          (userMode === 'job-seeker' ? (!resumeFile || jobDescFiles.length === 0) : (!jobDescFile || resumeFiles.length === 0))
                        }
                        className="w-full"
                      >
                        {isMatching ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {userMode === 'job-seeker' ? 'Finding Best Job Matches...' : 'Ranking Candidates...'}
                          </>
                        ) : (
                          userMode === 'job-seeker' ? 'Find My Best Job Matches' : 'Rank Candidates'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Results */}
              <div className="lg:col-span-3">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-heading font-semibold mb-2">
                      {userMode === 'job-seeker' ? 'Your Best Job Matches' : 'Top Candidates Ranked'}
                    </h2>
                    <p className="text-muted-foreground">
                      {userMode === 'job-seeker' 
                        ? 'Jobs ranked by compatibility with your resume' 
                        : 'Candidates ranked by fit for your job description'}
                    </p>
                  </div>



                  {multiResults.map((item, index) => (
                <Card key={index} className={`${index === 0 ? 'border-green-500/50 bg-green-500/5' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-green-500 text-white' : 
                          index === 1 ? 'bg-blue-500 text-white' : 
                          index === 2 ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.file}</h3>
                          {index === 0 && (
                            <Badge className="bg-green-500 text-white mt-1">
                              {userMode === 'job-seeker' ? 'Best Match!' : 'Top Candidate!'}
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{item.result.matchPercentage}%</div>
                          <Progress value={item.result.matchPercentage} className="w-24 h-2 mt-1" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedDetails(prev => ({
                            ...prev,
                            [index]: !prev[index]
                          }))}
                        >
                          {expandedDetails[index] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Quick Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Matching Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {item.result.matchingKeywords.slice(0, 3).map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                              {keyword}
                            </Badge>
                          ))}
                          {item.result.matchingKeywords.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.result.matchingKeywords.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          Missing Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {item.result.lackingSkills.slice(0, 2).map((skillItem, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-red-500/20 text-red-600">
                              {skillItem.skill}
                            </Badge>
                          ))}
                          {item.result.lackingSkills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.result.lackingSkills.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-500" />
                          Key Strengths
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.result.strengths?.[0] || 'Strong candidate profile'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Improvement Areas
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.result.improvementAreas?.[0] || 'Areas for development'}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedDetails[index] && (
                      <div className="border-t pt-4 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* All Matching Keywords */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              All Matching Keywords ({item.result.matchingKeywords.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.result.matchingKeywords.map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-600">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* All Lacking Skills with Courses */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              Skills to Develop ({item.result.lackingSkills.length})
                            </h4>
                            <div className="space-y-2">
                              {item.result.lackingSkills.map((skillItem, i) => (
                                <div key={i} className="flex items-center justify-between p-2 border border-red-500/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-red-500/20 text-red-600 text-xs">
                                      {skillItem.skill}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {skillItem.courseName}
                                    </span>
                                  </div>
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={skillItem.courseraUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="mr-1 h-3 w-3" />
                                      Learn
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Detailed Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {userMode === 'recruiter' ? (
                            <>
                              {/* Why Hire */}
                              <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  <Award className="h-4 w-4 text-blue-500" />
                                  Why You Should Hire This Candidate
                                </h4>
                                <ul className="space-y-2">
                                  {(item.result.whyHire || []).map((reason, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span className="text-sm">{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Weaknesses */}
                              <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  Areas of Concern
                                </h4>
                                <ul className="space-y-2">
                                  {(item.result.weaknesses || []).map((weakness, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-orange-500 mt-1">•</span>
                                      <span className="text-sm">{weakness}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Strengths */}
                              <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  <Award className="h-4 w-4 text-blue-500" />
                                  Your Competitive Advantages
                                </h4>
                                <ul className="space-y-2">
                                  {(item.result.strengths || []).map((strength, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span className="text-sm">{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Improvement Areas */}
                              <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  Areas to Strengthen
                                </h4>
                                <ul className="space-y-2">
                                  {(item.result.improvementAreas || []).map((area, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-orange-500 mt-1">•</span>
                                      <span className="text-sm">{area}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Centered layout when no results */
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Smart Matcher</CardTitle>
                <CardDescription>
                  {userMode === 'job-seeker' 
                    ? 'Upload your resume and job descriptions to find your best matches'
                    : 'Upload job description and candidate resumes to rank candidates'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {userMode === 'job-seeker' ? (
                  // Job Seeker Mode: Single resume vs multiple jobs
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Your Resume</h4>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="resume-file-centered"
                        />
                        <label
                          htmlFor="resume-file-centered"
                          className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                        >
                          <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                          <p className="text-sm font-medium">Upload Your Resume</p>
                          <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT file</p>
                        </label>
                        
                        {resumeFile && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Resume uploaded:</p>
                            <div className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{resumeFile.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setResumeFile(null)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Job Opportunities</h4>
                      <div className="space-y-4">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => setJobDescFiles(Array.from(e.target.files || []))}
                          className="hidden"
                          id="job-files-centered"
                        />
                        <label
                          htmlFor="job-files-centered"
                          className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                        >
                          <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                          <p className="text-sm font-medium">Upload Multiple Job Descriptions</p>
                          <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT files</p>
                        </label>
                        
                        {jobDescFiles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{jobDescFiles.length} job(s) uploaded:</p>
                            {jobDescFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setJobDescFiles(files => files.filter((_, i) => i !== index))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // Recruiter Mode: Single job vs multiple resumes
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Job Description</h4>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => setJobDescFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="job-desc-file-centered"
                        />
                        <label
                          htmlFor="job-desc-file-centered"
                          className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                        >
                          <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                          <p className="text-sm font-medium">Upload Job Description</p>
                          <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT file</p>
                        </label>
                        
                        {jobDescFile && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Job description uploaded:</p>
                            <div className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{jobDescFile.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setJobDescFile(null)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Candidate Resumes</h4>
                      <div className="space-y-4">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => setResumeFiles(Array.from(e.target.files || []))}
                          className="hidden"
                          id="resume-files-centered"
                        />
                        <label
                          htmlFor="resume-files-centered"
                          className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50"
                        >
                          <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                          <p className="text-sm font-medium">Upload Multiple Resumes</p>
                          <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT files</p>
                        </label>
                        
                        {resumeFiles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{resumeFiles.length} resume(s) uploaded:</p>
                            {resumeFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setResumeFiles(files => files.filter((_, i) => i !== index))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-2 border-t">
                  <Button 
                    onClick={handleMatch}
                    disabled={
                      isMatching || 
                      (userMode === 'job-seeker' ? (!resumeFile || jobDescFiles.length === 0) : (!jobDescFile || resumeFiles.length === 0))
                    }
                    className="w-full"
                  >
                    {isMatching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {userMode === 'job-seeker' ? 'Finding Best Job Matches...' : 'Ranking Candidates...'}
                      </>
                    ) : (
                      userMode === 'job-seeker' ? 'Find My Best Job Matches' : 'Rank Candidates'
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