import { ai } from '../genkit';
import { z } from 'zod';

const AiChatInputSchema = z.object({
  userQuery: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

const AiChatOutputSchema = z.object({
  response: z.string(),
});

export const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistant',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async (input) => {
    const conversationContext = input.conversationHistory
      ? input.conversationHistory
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n')
      : '';

    const prompt = `
You are "The Career Copilot," an expert AI career advisor and coach. You provide personalized, actionable career guidance to job seekers.

Your expertise includes:
- Resume writing and optimization
- Job search strategies
- Interview preparation
- Career transitions
- Salary negotiation
- Professional networking
- Industry insights
- Skill development

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}

User's current question: ${input.userQuery}

Provide helpful, specific, and actionable career advice. Be encouraging but realistic. If the question is outside your career expertise, politely redirect to career-related topics.

Keep your response conversational, professional, and focused on practical next steps the user can take.
`;

    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.7,
      },
    });

    return {
      response: response.text.trim(),
    };
  }
);