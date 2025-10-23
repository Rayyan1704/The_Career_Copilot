// Direct API test without dotenv
const API_KEY = 'AIzaSyAKlsGpGvhrj2sm1kZzjvVhubwgS41DdG8';

async function testAPI() {
  console.log('🔍 Testing Gemini API directly...');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API key is valid!');
      console.log('📋 Available models:');
      
      if (data.models) {
        data.models.forEach(model => {
          if (model.name.includes('gemini')) {
            console.log(`  - ${model.name}`);
          }
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API call failed:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAPI();