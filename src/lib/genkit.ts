import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Load environment variables explicitly
if (typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' });
}

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey && typeof window === 'undefined') {
  console.error('GOOGLE_GENAI_API_KEY is not set in environment variables');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-2.5-flash', // Latest stable model with good free tier limits
});

export const model = 'googleai/gemini-2.5-flash';

// Debug log to check if API key is loaded
if (typeof window === 'undefined') {
  console.log("API key loaded:", !!apiKey);
  console.log("Model configured:", model);
}
