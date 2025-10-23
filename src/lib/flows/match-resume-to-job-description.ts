import { ai } from '../genkit';
import { z } from 'zod';
import crypto from 'crypto';

// Simple in-memory cache for consistency
const matchCache = new Map<string, any>();

const MatchResumeInputSchema = z.object({
  resumeText: z.string(),
  jobDescriptionText: z.string(),
});

const MatchResumeOutputSchema = z.object({
  matchPercentage: z.number().min(0).max(100),
  matchingKeywords: z.array(z.string()),
  lackingSkills: z.array(z.object({
    skill: z.string(),
    courseraUrl: z.string(),
    courseName: z.string(),
  })),
  suggestions: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  whyHire: z.array(z.string()),
  improvementAreas: z.array(z.string()),
});

export const matchResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'matchResumeToJobDescription',
    inputSchema: MatchResumeInputSchema,
    outputSchema: MatchResumeOutputSchema,
  },
  async (input) => {
    // Create a consistent hash of the input
    const inputKey = crypto.createHash('md5').update(input.resumeText + '|||' + input.jobDescriptionText).digest('hex');
    
    // Check cache first for consistency
    if (matchCache.has(inputKey)) {
      return matchCache.get(inputKey);
    }
    
    const inputHash = inputKey.slice(0, 16);
    
    const prompt = `
You are a deterministic ATS system that provides consistent and accurate resume-to-job-description matching analysis.

Analysis ID: ${inputHash}

Resume:
${input.resumeText}

Job Description:
${input.jobDescriptionText}

CRITICAL INSTRUCTIONS:
1. You MUST provide identical scores for identical resume-job pairs
2. Use a systematic scoring methodology based on keyword matching, experience alignment, and skill requirements
3. Calculate match percentage using this formula: (matching_requirements / total_requirements) * 100
4. Be consistent in your evaluation criteria across all analyses
5. Respond with ONLY a valid JSON object, no additional text

Use this exact structure:

{
  "matchPercentage": 75,
  "matchingKeywords": ["JavaScript", "React", "Team Leadership", "Agile", "Problem Solving"],
  "lackingSkills": [
    {
      "skill": "Python",
      "courseraUrl": "https://www.coursera.org/learn/python",
      "courseName": "Python for Everybody Specialization"
    },
    {
      "skill": "Machine Learning",
      "courseraUrl": "https://www.coursera.org/learn/machine-learning",
      "courseName": "Machine Learning by Stanford University"
    }
  ],
  "suggestions": ["Add Python experience", "Highlight leadership skills", "Include cloud certifications"],
  "strengths": ["Strong technical foundation in JavaScript", "Proven leadership experience", "Excellent problem-solving abilities"],
  "weaknesses": ["Limited Python experience", "No machine learning background", "Missing cloud certifications"],
  "whyHire": ["Brings solid frontend expertise", "Has team management experience", "Shows strong analytical thinking"],
  "improvementAreas": ["Develop backend Python skills", "Gain ML/AI knowledge", "Obtain cloud platform certifications"]
}

Consider:
- Required vs preferred qualifications
- Technical skills alignment
- Experience level match
- Industry-specific keywords
- Soft skills and competencies
- Education and certifications

Return ONLY the JSON object, no other text.
`;

    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.0, // Set to 0 for maximum consistency
        topP: 0.9,
        topK: 1, // Use only the most likely token for consistency
        maxOutputTokens: 2048,
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
      
      const result = JSON.parse(jsonText);
      const validatedResult = MatchResumeOutputSchema.parse(result);
      
      // Cache the result for consistency
      matchCache.set(inputKey, validatedResult);
      
      return validatedResult;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', response.text);
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);