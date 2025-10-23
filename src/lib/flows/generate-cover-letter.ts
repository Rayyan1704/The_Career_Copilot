import { ai } from '../genkit';
import { z } from 'zod';
import crypto from 'crypto';

// Simple in-memory cache for consistency
const coverLetterCache = new Map<string, any>();

const GenerateCoverLetterInputSchema = z.object({
  resumeText: z.string(),
  jobDescriptionText: z.string(),
  applicantName: z.string(),
});

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string(),
});

export const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetter',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    // Create a consistent hash of the input
    const inputKey = crypto.createHash('md5').update(input.resumeText + '|||' + input.jobDescriptionText + '|||' + input.applicantName).digest('hex');
    
    // Check cache first for consistency
    if (coverLetterCache.has(inputKey)) {
      return coverLetterCache.get(inputKey);
    }
    
    const inputHash = inputKey.slice(0, 16);
    
    const prompt = `
You are a professional career counselor and expert writer. Create a personalized, compelling cover letter based on the provided resume and job description.

Generation ID: ${inputHash}

Applicant Name: ${input.applicantName}

Resume:
${input.resumeText}

Job Description:
${input.jobDescriptionText}

INSTRUCTIONS:
Write a professional cover letter that:
- Is personalized and specific to this role
- Highlights relevant experience from the resume
- Addresses key requirements from the job description
- Shows enthusiasm and cultural fit
- Is concise but impactful (3-4 paragraphs)
- Uses a professional but engaging tone
- Includes a strong opening and closing
- Maintains consistency for identical inputs

Format the cover letter as a complete, ready-to-send document with proper business letter structure.

Return only the cover letter text, no additional formatting or JSON structure.
`;

    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.3, // Lower temperature for more consistency while maintaining creativity
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const result = {
      coverLetter: response.text.trim(),
    };
    
    // Cache the result for consistency
    coverLetterCache.set(inputKey, result);
    
    return result;
  }
);