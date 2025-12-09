import { ai, model } from '../genkit';
import { z } from 'zod';

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
    console.log('[generateCoverLetterFlow] Starting generation', {
      resumeLength: input.resumeText.length,
      jobDescLength: input.jobDescriptionText.length,
      applicantName: input.applicantName
    });
    
    const prompt = `You are a professional career counselor and expert writer. Create a personalized, compelling cover letter based on the provided resume and job description.

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

Format the cover letter as a complete, ready-to-send document with proper business letter structure.

Return only the cover letter text, no additional formatting or JSON structure.`;

    const response = await ai.generate({
      model,
      prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    console.log('[generateCoverLetterFlow] Generation complete', {
      responseLength: response.text.length
    });

    const result = {
      coverLetter: response.text.trim(),
    };
    
    return result;
  }
);