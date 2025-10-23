"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Search, 
  MapPin, 
  Briefcase, 
  ExternalLink, 
  Filter,
  Building2,
  Clock,
  DollarSign,
  Star
} from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  posted: string;
  description: string;
  platform: 'linkedin' | 'indeed' | 'google';
  url: string;
  matchScore?: number;
}

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
  { id: 'indeed', name: 'Indeed', color: 'bg-blue-500' },
  { id: 'google', name: 'Google Careers', color: 'bg-green-600' }
];

// Expanded job data with more realistic listings from various sources
const mockJobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
    type: 'Full-time',
    posted: '2 days ago',
    description: 'We are looking for a Senior Software Engineer to join our team...',
    platform: 'linkedin',
    url: 'https://linkedin.com/jobs/123',
    matchScore: 92
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$80k - $120k',
    type: 'Full-time',
    posted: '1 day ago',
    description: 'Join our dynamic team as a Frontend Developer...',
    platform: 'indeed',
    url: 'https://indeed.com/jobs/456',
    matchScore: 87
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$140k - $200k',
    type: 'Full-time',
    posted: '3 days ago',
    description: 'Lead product strategy and development...',
    platform: 'google',
    url: 'https://careers.google.com/jobs/789',
    matchScore: 78
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'DataTech Inc',
    location: 'New York, NY',
    salary: '$100k - $150k',
    type: 'Full-time',
    posted: '1 week ago',
    description: 'Analyze complex datasets to drive business insights...',
    platform: 'linkedin',
    url: 'https://linkedin.com/jobs/321',
    matchScore: 85
  },
  {
    id: '5',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Austin, TX',
    salary: '$70k - $100k',
    type: 'Contract',
    posted: '4 days ago',
    description: 'Create intuitive user experiences for web and mobile...',
    platform: 'indeed',
    url: 'https://indeed.com/jobs/654',
    matchScore: 73
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Seattle, WA',
    salary: '$110k - $160k',
    type: 'Full-time',
    posted: '2 days ago',
    description: 'Manage cloud infrastructure and CI/CD pipelines...',
    platform: 'linkedin',
    url: 'https://linkedin.com/jobs/789',
    matchScore: 88
  },
  {
    id: '7',
    title: 'Marketing Manager',
    company: 'Growth Startup',
    location: 'Remote',
    salary: '$85k - $120k',
    type: 'Full-time',
    posted: '1 day ago',
    description: 'Lead digital marketing campaigns and growth strategies...',
    platform: 'google',
    url: 'https://careers.google.com/jobs/marketing-123',
    matchScore: 76
  },
  {
    id: '8',
    title: 'Full Stack Developer',
    company: 'FinTech Corp',
    location: 'Chicago, IL',
    salary: '$95k - $140k',
    type: 'Full-time',
    posted: '3 days ago',
    description: 'Build scalable web applications using React and Node.js...',
    platform: 'indeed',
    url: 'https://indeed.com/jobs/fullstack-456',
    matchScore: 91
  },
  {
    id: '9',
    title: 'Cybersecurity Analyst',
    company: 'SecureNet Inc',
    location: 'Washington, DC',
    salary: '$80k - $115k',
    type: 'Full-time',
    posted: '5 days ago',
    description: 'Monitor and protect against security threats...',
    platform: 'linkedin',
    url: 'https://linkedin.com/jobs/security-789',
    matchScore: 82
  },
  {
    id: '10',
    title: 'AI/ML Engineer',
    company: 'AI Innovations',
    location: 'San Francisco, CA',
    salary: '$130k - $200k',
    type: 'Full-time',
    posted: '1 week ago',
    description: 'Develop machine learning models and AI solutions...',
    platform: 'google',
    url: 'https://careers.google.com/jobs/ai-ml-456',
    matchScore: 89
  }
];

export default function JobScraperPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'indeed', 'google']);
  const [jobs, setJobs] = useState<JobListing[]>(mockJobs);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter jobs based on search criteria
      let filteredJobs = mockJobs.filter(job => {
        const matchesQuery = !searchQuery || 
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesLocation = !location || 
          job.location.toLowerCase().includes(location.toLowerCase());
        
        const matchesPlatform = selectedPlatforms.includes(job.platform);
        
        return matchesQuery && matchesLocation && matchesPlatform;
      });
      
      setJobs(filteredJobs);
      setIsSearching(false);
    }, 1500);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getPlatformBadgeColor = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Job Scraper</h1>
            <p className="text-muted-foreground">
              Search and discover job opportunities from LinkedIn, Indeed, and Google Careers.
            </p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Job Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Title or Keywords</label>
                  <Input
                    placeholder="e.g. Software Engineer, Product Manager"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="e.g. San Francisco, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <Badge
                      key={platform.id}
                      variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePlatform(platform.id)}
                    >
                      {platform.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleSearch} disabled={isSearching} className="w-full md:w-auto">
                {isSearching ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Searching Jobs...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Jobs
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} matching your criteria
            </p>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        {job.matchScore && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            <Star className="h-3 w-3 mr-1" />
                            {job.matchScore}% match
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.posted}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPlatformBadgeColor(job.platform)} text-white`}>
                        {platforms.find(p => p.id === job.platform)?.name}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Job
                        </a>
                      </Button>
                      
                      {job.matchScore && (
                        <div className="text-xs text-muted-foreground">
                          Match score based on your profile
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {jobs.length === 0 && !isSearching && (
            <Card>
              <CardContent className="py-12 text-center">
                <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check different platforms.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Platform Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Supported Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    LinkedIn Jobs
                  </h4>
                  <p className="text-muted-foreground">Professional network with quality job postings</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    Indeed
                  </h4>
                  <p className="text-muted-foreground">Large job board with diverse opportunities</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    Google Careers
                  </h4>
                  <p className="text-muted-foreground">Direct access to Google job openings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}