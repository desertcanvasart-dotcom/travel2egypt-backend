/**
 * Simple Bulk Create - 26 Blog Categories
 * No debugging, just creates them all fast
 */

const fetch = require('node-fetch');

const STRAPI_URL = 'http://127.0.0.1:1337';
const STRAPI_TOKEN = 'a34350fd0a118c3deb0f44a712698af1b2e53e5cf3b750b22f846f4e231ca0a1dec35d6ab8854068820f283740003bd7f2fced0dc5ab2509edca6392311077d67f3ab5a1f7033bdc870b0a8eb77ad4d426d9b54baab7bb6bc911666b571d6140cec5ba6a52b6a363ca4e97cabdb3e69ac1a7e019553c648355de9d29a7e23de7';

// All 26 categories
const categories = [
  'Adventure',
  'Company Insight',
  'Coptic monuments',
  'Creative',
  'Culture',
  'Day Tours',
  'Egypt Travel Guide',
  'Food',
  'History',
  'Hotels',
  'Islamic monuments',
  'Lifestyle',
  'Luxury Stay',
  'Macedonian monuments',
  'Nile Cruise',
  'Pharaoh monuments',
  'Places In Egypt',
  'Ptolemic monuments',
  'Roman monuments',
  'Safety',
  'Things to do',
  'Tips & Tricks',
  'Tours',
  'Travel Packages',
  'Uncategorized',
  'Wellness'
];

// Create slug from name
function createSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}

// Create one category
async function createCategory(name) {
  const slug = createSlug(name);
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/blog-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          name: name,
          slug: slug,
          locale: 'en',
          publishedAt: new Date().toISOString()
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${name} (${slug})`);
      return true;
    } else {
      const error = await response.json();
      console.log(`❌ ${name} - ${error.error?.message || 'Failed'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} - ${error.message}`);
    return false;
  }
}

// Main function
async function bulkCreate() {
  console.log('\n🚀 Creating 26 Blog Categories...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const category of categories) {
    const created = await createCategory(category);
    if (created) {
      success++;
    } else {
      failed++;
    }
    // Small delay to avoid overwhelming API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(50) + '\n');
  
  if (success === 26) {
    console.log('🎉 All categories created!\n');
  } else if (failed === 26) {
    console.log('⚠️  All failed. Check if blog-category API exists.\n');
    console.log('Try: curl http://127.0.0.1:1337/api/blog-categories\n');
  } else {
    console.log('✨ Partial success. Check Strapi admin.\n');
  }
}

// Run it
bulkCreate();
