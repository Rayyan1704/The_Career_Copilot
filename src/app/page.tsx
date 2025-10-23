import Link from "next/link";
import { 
  Search, 
  Target, 
  FileEdit, 
  MessageSquare, 
  User, 
  FileUser, 
  Globe 
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    href: "/analyze",
    icon: Search,
    title: "AI Resume Analyzer",
    description: "Get detailed feedback on your resume with ATS scoring and improvement suggestions."
  },
  {
    href: "/match",
    icon: Target,
    title: "Smart Matcher",
    description: "AI-powered matching for job seekers and recruiters. Compare resumes to jobs or rank candidates."
  },
  {
    href: "/cover-letter",
    icon: FileEdit,
    title: "Cover Letter Generator",
    description: "Generate personalized cover letters tailored to specific job opportunities."
  },
  {
    href: "/interview-prep",
    icon: MessageSquare,
    title: "Interview Prep",
    description: "Get relevant interview questions based on job descriptions to practice."
  },
  {
    href: "/chat",
    icon: User,
    title: "AI Assistant",
    description: "Chat with our AI for personalized career advice and guidance."
  },
  {
    href: "/resume-builder",
    icon: FileUser,
    title: "Resume Builder",
    description: "Build and optimize your resume with AI-powered suggestions."
  },
  {
    href: "/job-scraper",
    icon: Globe,
    title: "Job Scraper",
    description: "Find and analyze job opportunities from various platforms."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Your AI-Powered Career Toolkit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leverage artificial intelligence to analyze resumes, match job descriptions, 
            generate cover letters, and prepare for interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            
            return (
              <Card key={tool.href} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={tool.href}>
                      Open Tool
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
