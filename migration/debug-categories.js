/**
 * DEBUG VERSION - Create Blog Categories in Strapi
 * This version shows detailed error messages
 */
const fetch = require('node-fetch');

const STRAPI_URL = 'http://127.0.0.1:1337';
const STRAPI_TOKEN = 'a34350fd0a118c3deb0f44a712698af1b2e53e5cf3b750b22f846f4e231ca0a1dec35d6ab8854068820f283740003bd7f2fced0dc5ab2509edca6392311077d67f3ab5a1f7033bdc870b0a8eb77ad4d426d9b54baab7bb6bc911666b571d6140cec5ba6a52b6a363ca4e97cabdb3e69ac1a7e019553c648355de9d29a7e23de7'; // Replace with your token

/**
 * Test connection to Strapi
 */
async function testConnection() {
  console.log('🔍 Testing Strapi connection...\n');
  
  try {
    const response = await fetch(`${STRAPI_URL}/_health`);
    
    if (response.ok) {
      console.log('✅ Strapi is running and accessible\n');
      return true;
    } else {
      console.log('❌ Strapi returned error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to Strapi:', error.message);
    console.log('   Make sure Strapi is running: npm run develop\n');
    return false;
  }
}

/**
 * Check if blog-category content type exists
 */
async function checkContentType() {
  console.log('🔍 Checking if blog-category content type exists...\n');
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/blog-categories`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    if (response.status === 404) {
      console.log('\n❌ ERROR: blog-category content type does NOT exist!');
      console.log('   You need to create it first in Strapi.\n');
      return false;
    }
    
    if (response.status === 403) {
      console.log('\n❌ ERROR: Forbidden - Token does not have permission!');
      console.log('   Check your API token permissions.\n');
      return false;
    }
    
    if (response.status === 401) {
      console.log('\n❌ ERROR: Unauthorized - Invalid token!');
      console.log('   Check if your token is correct.\n');
      return false;
    }
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ blog-category content type exists!');
      console.log(`   Current categories: ${data.data.length}\n`);
      return true;
    }
    
    // Some other error
    const errorData = await response.json();
    console.log('❌ Unexpected response:', JSON.stringify(errorData, null, 2));
    return false;
    
  } catch (error) {
    console.log('❌ Error checking content type:', error.message);
    return false;
  }
}

/**
 * Try to create ONE test category
 */
async function createTestCategory() {
  console.log('🧪 Trying to create ONE test category...\n');
  
  const testCategory = {
    data: {
      name: 'Test Category',
      slug: 'test-category'
    }
  };
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/blog-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify(testCategory)
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! Test category created:');
      console.log(JSON.stringify(responseData, null, 2));
      return true;
    } else {
      console.log('\n❌ FAILED to create category. Error response:');
      console.log(JSON.stringify(responseData, null, 2));
      
      // Detailed error analysis
      if (responseData.error) {
        console.log('\n📋 Error Details:');
        console.log('   Message:', responseData.error.message);
        console.log('   Status:', responseData.error.status);
        if (responseData.error.details) {
          console.log('   Details:', JSON.stringify(responseData.error.details, null, 2));
        }
      }
      
      return false;
    }
    
  } catch (error) {
    console.log('❌ Exception occurred:', error.message);
    console.log('   Full error:', error);
    return false;
  }
}

/**
 * Main debug function
 */
async function runDebug() {
  console.log('\n' + '='.repeat(70));
  console.log('🐛 DEBUG MODE - Blog Category Creation');
  console.log('='.repeat(70) + '\n');
  
  // Step 1: Test connection
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Cannot proceed without Strapi connection.\n');
    return;
  }
  
  // Step 2: Check content type
  const contentTypeExists = await checkContentType();
  if (!contentTypeExists) {
    console.log('❌ Cannot proceed without blog-category content type.\n');
    console.log('📝 SOLUTION: Create the blog-category content type in Strapi first!\n');
    return;
  }
  
  // Step 3: Try creating one test category
  const testSuccess = await createTestCategory();
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 DEBUG SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Strapi connection: ${connected ? 'OK' : 'FAILED'}`);
  console.log(`✅ Content type exists: ${contentTypeExists ? 'YES' : 'NO'}`);
  console.log(`✅ Can create category: ${testSuccess ? 'YES' : 'NO'}`);
  console.log('='.repeat(70) + '\n');
  
  if (testSuccess) {
    console.log('✨ Everything works! You can now run the full migration script.\n');
  } else {
    console.log('❌ Fix the errors above before running the full migration.\n');
  }
}

// Run debug
runDebug();
