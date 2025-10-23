import { ai } from '../genkit';
import { z } from 'zod';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z.string(),
});

const AnalyzeResumeOutputSchema = z.object({
  atsScore: z.number().min(0).max(100),
  contactInfo: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
  }),
  summary: z.string(),
  skills: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResume',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async (input) => {
    const prompt = `
You are an expert ATS (Applicant Tracking System) simulator. Analyze the following resume and provide a comprehensive evaluation.

Resume Text:
${input.resumeText}

IMPORTANT: Respond with ONLY a valid JSON object, no additional text or formatting. Use this exact structure:

{
  "atsScore": 85,
  "contactInfo": {
    "name": "John Doe",
    "email": "john@email.com",
    "phone": "+1-555-0123",
    "location": "New York, NY"
  },
  "summary": "Brief summary of the candidate's profile and experience",
  "skills": ["JavaScript", "React", "Node.js"],
  "recommendations": ["Add more quantified achievements", "Include relevant keywords"]
}

Focus on:
- ATS compatibility (formatting, keywords, structure)
- Completeness of information
- Clarity and relevance of content
- Professional presentation
- Keyword optimization

Return ONLY the JSON object, no other text.
`;

    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.3,
      },
    });

    try {
      // Clean the response text to extract JSON
      let jsonText = response.text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      // Try to find JSON object in the response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      console.log('AI Response:', jsonText.substring(0, 200) + '...');
      
      const result = JSON.parse(jsonText);
      return AnalyzeResumeOutputSchema.parse(result);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', response.text);
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);