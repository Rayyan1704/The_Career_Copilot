// Test different model names to find the working one
const API_KEY = 'AIzaSyAKlsGpGvhrj2sm1kZzjvVhubwgS41DdG8';

const modelsToTest = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-exp', 
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
  'gemini-flash-latest'
];

async function testModel(modelName) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello, this is a test. Please respond with 'Working!'"
            }]
          }]
        })
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${modelName}: WORKS`);
      console.log(`   Response: ${data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text'}`);
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ ${modelName}: FAILED - ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${modelName}: ERROR - ${error.message}`);
    return false;
  }
}

async function testAllModels() {
  console.log('🔍 Testing models with your API key...\n');
  
  for (const model of modelsToTest) {
    await testModel(model);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
}

testAllModels();