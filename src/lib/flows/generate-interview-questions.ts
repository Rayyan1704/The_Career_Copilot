import { ai } from '../genkit';
import { z } from 'zod';

const GenerateInterviewQuestionsInputSchema = z.object({
  jobDescriptionText: z.string(),
});

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.object({
    category: z.string(),
    question: z.string(),
    tips: z.string(),
  })),
});

export const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestions',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const prompt = `
You are an experienced hiring manager and interview coach. Based on the following job description, generate relevant interview questions that a candidate should prepare for.

Job Description:
${input.jobDescriptionText}

IMPORTANT: Respond with ONLY a valid JSON object, no additional text. Use this exact structure:

{
  "questions": [
    {
      "category": "Technical",
      "question": "Can you walk me through your experience with React and how you've used it in previous projects?",
      "tips": "Provide specific examples and mention the scale of projects you've worked on."
    },
    {
      "category": "Behavioral",
      "question": "Tell me about a time when you had to work under a tight deadline.",
      "tips": "Use the STAR method: Situation, Task, Action, Result."
    }
  ]
}

Generate 6-8 interview questions covering:
- Technical/Role-specific questions
- Behavioral questions
- Company/Culture fit questions
- Situational questions

Return ONLY the JSON object, no other text.
`;

    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.6,
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
      return GenerateInterviewQuestionsOutputSchema.parse(result);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', response.text);
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);