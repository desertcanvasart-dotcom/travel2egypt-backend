/**
 * WordPress to Strapi Category Mapping
 * 
 * HOW TO USE:
 * 1. Find your WordPress category IDs from any blog post JSON
 * 2. Map each WordPress ID to the corresponding Strapi slug
 * 3. Copy this object into migrate-blog-posts.js
 * 
 * EXAMPLE FROM YOUR DATA:
 * - WordPress Category ID: 356
 * - Category Name: "pharaoh monuments"
 * - Strapi Slug: "pharaoh-monuments"
 */

const CATEGORY_MAPPING = {
  // Format: wordpress_id: 'strapi-slug'
  
  // Known mapping from your sample post:
  356: 'pharaoh-monuments',
  
  // TODO: Add the rest of your mappings below
  // You can find WordPress category IDs by:
  // 1. Looking at the "categories" array in WordPress post JSON
  // 2. Or fetching: https://travel2egypt.org/wp-json/wp/v2/categories
  
  // Template (replace XXX with actual WordPress IDs):
  // XXX: 'adventure',
  // XXX: 'company-insight',
  // XXX: 'coptic-monuments',
  // XXX: 'creative',
  // XXX: 'culture',
  // XXX: 'day-tours',
  // XXX: 'egypt-travel-guide',
  // XXX: 'food',
  // XXX: 'history',
  // XXX: 'hotels',
  // XXX: 'islamic-monuments',
  // XXX: 'lifestyle',
  // XXX: 'luxury-stay',
  // XXX: 'macedonian-monuments',
  // XXX: 'nile-cruise',
  // XXX: 'places-in-egypt',
  // XXX: 'ptolemic-monuments',
  // XXX: 'roman-monuments',
  // XXX: 'safety',
  // XXX: 'things-to-do',
  // XXX: 'tips-tricks',
  // XXX: 'tours',
  // XXX: 'travel-packages',
  // XXX: 'uncategorized',
  // XXX: 'wellness'
};

/**
 * INTEGRATION INSTRUCTIONS:
 * 
 * 1. Complete the mapping above
 * 
 * 2. Copy the entire CATEGORY_MAPPING object
 * 
 * 3. Open migrate-blog-posts.js
 * 
 * 4. Add it near the top, after the CONFIG object:
 * 
 *    const CONFIG = { ... };
 *    
 *    // ADD THIS:
 *    const CATEGORY_MAPPING = { ... };
 * 
 * 5. Then find the transformPost function and replace:
 * 
 *    OLD CODE:
 *    --------
 *    let categoryId = null;
 *    if (wpPost.categories && wpPost.categories.length > 0) {
 *      const wpCategoryId = wpPost.categories[0];
 *      console.log(`   📁 WordPress Category ID: ${wpCategoryId}`);
 *    }
 * 
 *    NEW CODE:
 *    --------
 *    let categoryIds = [];
 *    if (wpPost.categories && wpPost.categories.length > 0) {
 *      for (const wpCategoryId of wpPost.categories) {
 *        const categorySlug = CATEGORY_MAPPING[wpCategoryId];
 *        
 *        if (categorySlug) {
 *          const strapiCatId = await getCategoryIdBySlug(categorySlug);
 *          if (strapiCatId) {
 *            categoryIds.push(strapiCatId);
 *            console.log(`   📁 Mapped: WP ${wpCategoryId} → "${categorySlug}" (Strapi ID: ${strapiCatId})`);
 *          }
 *        } else {
 *          console.log(`   ⚠️  No mapping for WordPress Category ID: ${wpCategoryId}`);
 *        }
 *      }
 *    }
 * 
 * 6. Update the strapiPost object to include categories:
 * 
 *    const strapiPost = {
 *      title: wpPost.title.rendered,
 *      slug: wpPost.slug,
 *      excerpt: excerptMarkdown,
 *      content: contentMarkdown,
 *      published_at: wpPost.date,
 *      locale: lang,
 *      blog_categories: categoryIds,  // ADD THIS LINE
 *      blog_details: {
 *        read_time: calculateReadTime(contentMarkdown),
 *        featured: false
 *      }
 *    };
 */

// HELPER: Fetch all WordPress categories to find IDs
// Run this in browser console or Node.js:
/*

fetch('https://travel2egypt.org/wp-json/wp/v2/categories?per_page=100')
  .then(r => r.json())
  .then(cats => {
    console.log('WordPress Categories:');
    cats.forEach(cat => {
      console.log(`${cat.id}: '${cat.slug}',  // ${cat.name}`);
    });
  });

*/

// Or use curl in terminal:
/*

curl https://travel2egypt.org/wp-json/wp/v2/categories?per_page=100 | \
  jq '.[] | "\(.id): \"\(.slug)\",  // \(.name)"'

*/

module.exports = CATEGORY_MAPPING;
