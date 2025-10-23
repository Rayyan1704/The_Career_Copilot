import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Load environment variables explicitly
if (typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' });
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash', // This model works with your API key!
});

export const model = 'googleai/gemini-2.5-flash';

// Debug log to check if API key is loaded
console.log("API key loaded:", !!process.env.GOOGLE_GENAI_API_KEY);
console.log("Model configured:", 'googleai/gemini-2.5-flash');
