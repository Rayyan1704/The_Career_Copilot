import { ai } from '../genkit';
import { z } from 'zod';

const ExtractDocxInputSchema = z.object({
  dataUri: z.string(),
});

const ExtractDocxOutputSchema = z.object({
  text: z.string(),
});

export const extractTextFromDocxFlow = ai.defineFlow(
  {
    name: 'extractTextFromDocx',
    inputSchema: ExtractDocxInputSchema,
    outputSchema: ExtractDocxOutputSchema,
  },
  async (input) => {
    const prompt = `
You are a document text extraction specialist. I will provide you with a Base64-encoded DOCX file as a data URI. Your task is to extract all readable text content from this document.

Data URI: ${input.dataUri}

Please extract and return all the text content from this DOCX file. Focus on:
- All paragraph text
- Headings and titles
- Bullet points and lists
- Table content
- Any other readable text

Ignore:
- Formatting information
- Metadata
- Headers and footers (unless they contain important content)
- Images and graphics

Return only the extracted text content, preserving the general structure and flow of the document.
`;

    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.1,
      },
    });

    return {
      text: response.text.trim(),
    };
  }
);