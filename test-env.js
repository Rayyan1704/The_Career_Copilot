// Test environment variable loading
console.log('=== Testing Environment Variable Loading ===');

// Method 1: Check if already loaded
console.log('1. Current env var:', process.env.GOOGLE_GENAI_API_KEY || 'NOT FOUND');

// Method 2: Try loading with dotenv
try {
  require('dotenv/config');
  console.log('2. After dotenv/config:', process.env.GOOGLE_GENAI_API_KEY || 'NOT FOUND');
} catch (e) {
  console.log('2. dotenv/config failed:', e.message);
}

// Method 3: Try explicit path
try {
  require('dotenv').config({ path: '.env.local' });
  console.log('3. After explicit path:', process.env.GOOGLE_GENAI_API_KEY || 'NOT FOUND');
} catch (e) {
  console.log('3. Explicit path failed:', e.message);
}

// Method 4: Manual set for testing
process.env.GOOGLE_GENAI_API_KEY = 'AIzaSyAKlsGpGvhrj2sm1kZzjvVhubwgS41DdG8';
console.log('4. After manual set:', process.env.GOOGLE_GENAI_API_KEY || 'NOT FOUND');

// Test API call with manual key
async function testWithManualKey() {
  console.log('\n=== Testing API Call ===');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${process.env.GOOGLE_GENAI_API_KEY}`
    );
    
    console.log('API Response status:', response.status);
    if (response.ok) {
      console.log('✅ API key works!');
    } else {
      const error = await response.text();
      console.log('❌ API error:', error);
    }
  } catch (e) {
    console.log('❌ Request failed:', e.message);
  }
}

testWithManualKey();