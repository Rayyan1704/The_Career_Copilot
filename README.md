# The Career Copilot

A modern, AI-powered career toolkit built with Next.js and Tailwind CSS. This application provides job seekers with a comprehensive suite of tools to analyze resumes, match them to job descriptions, generate cover letters, and prepare for interviews.

## Live Link

🚀 [The Career Copilot - Live Demo](https://the-career-copilot.vercel.app/)

## Features

- **AI Resume Analyzer**: Get detailed feedback on your resume with ATS scoring and improvement suggestions
- **JD Matcher**: Compare your resume against job descriptions to identify gaps and matches
- **Cover Letter Generator**: Generate personalized cover letters tailored to specific job opportunities
- **Interview Prep**: Get relevant interview questions based on job descriptions
- **AI Chat Assistant**: Chat with our AI for personalized career advice and guidance
- **Resume Builder**: Build professional, ATS-friendly resumes with three template options
- **Job Scraper**: Search and discover job opportunities from LinkedIn, Indeed, and Google Careers

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with tailwindcss-animate and @tailwindcss/typography
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **AI Backend**: Genkit with Google AI (Gemini) provider
- **Form Management**: React Hook Form with Zod validation
- **File Processing**: pdfjs-dist for PDF extraction, Genkit flow for DOCX processing

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd career-copilot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.local` and add your Google AI API key:
   ```bash
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── analyze/           # Resume analyzer page
│   ├── match/             # JD matcher page
│   ├── cover-letter/      # Cover letter generator page
│   ├── interview-prep/    # Interview prep page
│   ├── chat/              # AI chat assistant page
│   ├── resume-builder/    # Resume builder page (placeholder)
│   ├── job-scraper/       # Job scraper page (placeholder)
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── app-header.tsx    # Main navigation header
│   └── file-upload-input.tsx # File upload component
└── lib/                  # Utilities and configurations
    ├── flows/            # Genkit AI flows
    ├── actions.ts        # Server actions
    ├── file-utils.ts     # File processing utilities
    └── genkit.ts         # Genkit configuration
```

## Usage

### Resume Analysis
1. Navigate to the "AI Resume Analyzer" tool
2. Upload your resume (PDF, DOCX, or TXT)
3. Click "Analyze Resume" to get detailed feedback

### Job Description Matching
1. Go to the "JD Matcher" tool
2. Upload both your resume and the job description
3. Click "Run Comparison" to see match percentage and gaps

### Cover Letter Generation
1. Use the "Cover Letter Generator" tool
2. Upload your resume and job description
3. Enter your name and click "Generate Cover Letter"

### Interview Preparation
1. Access the "Interview Prep" tool
2. Upload the job description
3. Get relevant interview questions with tips

### AI Chat Assistant
1. Visit the "AI Assistant" page
2. Ask questions about career advice, job search strategies, etc.
3. Get personalized guidance from the AI

### Resume Builder
1. Choose from three professional templates (Modern, Executive, Academic)
2. Fill in your information step-by-step
3. Preview and download your ATS-optimized resume

### Job Scraper
1. Enter job title/keywords and location
2. Select platforms (LinkedIn, Indeed, Google Careers)
3. Browse job listings with match scores and direct links

## Customization

### Theme Colors
The app uses a dark theme by default. Colors are defined in `src/app/globals.css` using HSL values:

- Background: `0 0% 3.9%` (Very dark gray)
- Foreground: `0 0% 98%` (Almost white)
- Primary: `0 0% 98%` (For primary elements)
- Secondary: `0 0% 14.9%` (For secondary UI elements)
- Muted: `0 0% 63.9%` (For descriptions and placeholder text)

### Typography
- Headlines: Space Grotesk font
- Body text: Inter font

## API Configuration

The application uses Google AI (Gemini) through Genkit for all AI-powered features. Make sure to:

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add it to your `.env.local` file
3. The API key should have access to Gemini models

## File Support

- **PDF**: Client-side extraction using pdfjs-dist
- **DOCX**: Server-side extraction using Genkit flow with Gemini
- **TXT**: Direct file reading

## Development

### CSS Linting Notes
The project uses Tailwind CSS v4 with modern directives like `@theme`, `@custom-variant`, and `@apply`. If you see CSS linting warnings about "unknown at-rules", these are expected and can be safely ignored. The VS Code settings in `.vscode/settings.json` are configured to suppress these warnings.

### Adding New Tools
1. Create a new page in `src/app/[tool-name]/page.tsx`
2. Add the tool to the navigation in `src/components/app-header.tsx`
3. Add the tool card to the main dashboard in `src/app/page.tsx`
4. Create corresponding Genkit flows in `src/lib/flows/`
5. Add server actions in `src/lib/actions.ts`

### Building for Production
```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

This project is optimized for deployment on Vercel:

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**:
   - Add `GOOGLE_GENAI_API_KEY` with your Google AI API key
   - Apply to: Production, Preview, and Development environments

4. **Deploy**:
   - Vercel will automatically build and deploy your project
   - Your app will be live at `your-project.vercel.app`

### Environment Variables for Production

Make sure to set these in your deployment platform:

```bash
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

**Important**: Never commit your `.env.local` file to Git. It's already included in `.gitignore` for security.

## AI-Assisted Development

This project was ideated and implemented with the assistance of AI development tools, including Kiro and Gemini, to accelerate coding and debugging.  
While AI helped generate parts of the code and boilerplate, all design decisions, integrations, testing, and final refinements were directed and validated by me.

This reflects my ability to leverage AI productively in modern software development workflows — a key skill for the future of AI engineering.


## License

This project is for educational and demonstration purposes.