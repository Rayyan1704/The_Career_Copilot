// Script to list available Gemini models
require('dotenv/config');

async function listModels() {
  try {
    // Method 1: Try using Genkit's googleAI
    console.log('🔍 Attempting to list models using Genkit...');
    
    const { googleAI } = require('@genkit-ai/googleai');
    
    const client = googleAI({ 
      apiKey: process.env.GOOGLE_GENAI_API_KEY 
    });
    
    console.log('Client created:', !!client);
    
    // Check if listModels method exists
    if (typeof client.listModels === 'function') {
      console.log('📋 Listing models via Genkit...');
      const models = await client.listModels();
      console.log('Available models:', models);
    } else {
      console.log('❌ listModels method not available in Genkit client');
    }
    
  } catch (error) {
    console.log('❌ Genkit method failed:', error.message);
  }
  
  try {
    // Method 2: Direct Google AI API call
    console.log('\n🔍 Attempting direct Google AI API call...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENAI_API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('📋 Available models from Google AI API:');
      
      if (data.models) {
        data.models.forEach(model => {
          console.log(`  - ${model.name} (${model.displayName})`);
        });
        
        // Filter for Gemini models
        const geminiModels = data.models.filter(m => 
          m.name.includes('gemini') || m.displayName.toLowerCase().includes('gemini')
        );
        
        console.log('\n🤖 Gemini models specifically:');
        geminiModels.forEach(model => {
          console.log(`  - ${model.name}`);
          console.log(`    Display: ${model.displayName}`);
          console.log(`    Supported: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
          console.log('');
        });
      }
    } else {
      console.log('❌ API call failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Direct API call failed:', error.message);
  }
}

// Check if API key is loaded
console.log('🔑 API Key loaded:', !!process.env.GOOGLE_GENAI_API_KEY);
console.log('🔑 API Key length:', process.env.GOOGLE_GENAI_API_KEY?.length || 0);
console.log('🔑 API Key preview:', process.env.GOOGLE_GENAI_API_KEY ? 
  process.env.GOOGLE_GENAI_API_KEY.substring(0, 15) + '...' : 'Not found');

// Also check all environment variables that start with GOOGLE
console.log('\n🔍 All GOOGLE env vars:');
Object.keys(process.env).filter(key => key.includes('GOOGLE')).forEach(key => {
  console.log(`  ${key}: ${process.env[key]?.substring(0, 15)}...`);
});

listModels().catch(console.error);