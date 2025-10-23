"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  ArrowLeft, 
  Search, 
  Target, 
  FileEdit, 
  MessageSquare, 
  User, 
  FileUser, 
  Globe 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  { href: "/analyze", icon: Search, label: "Analyze" },
  { href: "/match", icon: Target, label: "Match" },
  { href: "/cover-letter", icon: FileEdit, label: "Cover Letter" },
  { href: "/interview-prep", icon: MessageSquare, label: "Interview" },
  { href: "/chat", icon: User, label: "AI Chat" },
  { href: "/resume-builder", icon: FileUser, label: "Builder" },
  { href: "/job-scraper", icon: Globe, label: "Scraper" },
];

export function AppHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      {/* App name and back button row */}
      <div className="w-full px-4 py-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          {/* Left side - Back to Home button */}
          <div className="flex items-center">
            {!isHomePage && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2 text-xs">
                  <ArrowLeft className="h-3 w-3" />
                  Back to Home
                </Link>
              </Button>
            )}
          </div>
          
          {/* Center - App name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80">
              <FileText className="h-5 w-5" />
              <span className="text-lg font-heading font-semibold">
                The Career Copilot
              </span>
            </Link>
          </div>
          
          {/* Right side - Empty for balance */}
          <div className="w-20"></div>
        </div>
      </div>

      {/* Tool navigation row */}
      {!isHomePage && (
        <div className="w-full px-4 py-2 border-b border-border">
          <nav className="flex items-center justify-center">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              const isActive = pathname === tool.href;
              
              return (
                <div key={tool.href} className="flex items-center">
                  <Link
                    href={tool.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-110 hover:bg-accent/50 rounded-md ${
                      isActive 
                        ? 'text-primary bg-secondary shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tool.label}</span>
                  </Link>
                  {index < tools.length - 1 && (
                    <div className="h-6 w-px bg-border mx-2" />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}