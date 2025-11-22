/**
 * Create Blog Categories in Strapi
 * Run this script to populate all 26 blog categories
 * 
 * Prerequisites:
 * 1. Strapi backend running (npm run develop)
 * 2. API permissions set for blog-category (create)
 * 3. Get your Strapi API URL and token
 */

const STRAPI_URL = 'http://localhost:1337'; // Change to your Strapi URL
const STRAPI_TOKEN = 'a34350fd0a118c3deb0f44a712698af1b2e53e5cf3b750b22f846f4e231ca0a1dec35d6ab8854068820f283740003bd7f2fced0dc5ab2509edca6392311077d67f3ab5a1f7033bdc870b0a8eb77ad4d426d9b54baab7bb6bc911666b571d6140cec5ba6a52b6a363ca4e97cabdb3e69ac1a7e019553c648355de9d29a7e23de7'; // Get from Strapi: Settings > API Tokens

// All 26 blog categories from WordPress
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

/**
 * Convert category name to slug
 * "Pharaoh monuments" -> "pharaoh-monuments"
 */
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
}

/**
 * Create a single category in Strapi
 */
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
          publishedAt: new Date().toISOString() // Auto-publish
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`❌ Failed to create "${name}":`, error);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Created: "${name}" (slug: ${slug}) - ID: ${data.data.id}`);
    return data.data;
  } catch (error) {
    console.error(`❌ Error creating "${name}":`, error.message);
    return null;
  }
}

/**
 * Create all categories
 */
async function createAllCategories() {
  console.log('🚀 Starting to create blog categories in Strapi...\n');
  console.log(`📊 Total categories to create: ${categories.length}\n`);

  const results = {
    success: [],
    failed: []
  };

  for (const category of categories) {
    const result = await createCategory(category);
    
    if (result) {
      results.success.push(category);
    } else {
      results.failed.push(category);
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successfully created: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed categories:');
    results.failed.forEach(cat => console.log(`   - ${cat}`));
  }
  
  console.log('\n✨ Done! Check your Strapi admin panel.\n');
}

// Run the script
createAllCategories();
