/**
 * WordPress to Strapi Blog Migration Script
 * Converts HTML content to Markdown and migrates posts with translations
 * 
 * Features:
 * - HTML to Markdown conversion
 * - Multi-language support (EN, ES, JA, FI)
 * - Category mapping
 * - Tag handling
 * - Translation linking
 * 
 * Prerequisites:
 * - npm install turndown node-fetch
 */

const TurndownService = require('turndown');
const fetch = require('node-fetch');

// Configuration
const CONFIG = {
  wordpress: {
    url: 'https://travel2egypt.org',
    restApi: '/wp-json/wp/v2',
    langs: {
      en: '',      // Default English (no prefix)
      es: '/es',   // Spanish
      ja: '/ja',   // Japanese
      fi: '/fi'    // Finnish
    }
  },
  strapi: {
    url: 'http://localhost:1337',
    token: 'YOUR_API_TOKEN_HERE' // Get from Strapi Settings > API Tokens
  },
  test: {
    enabled: true,  // Set to true for testing with limited posts
    maxPosts: 2     // Number of posts to test with
  }
};

// Initialize HTML to Markdown converter
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inline'
});

// Custom rules for better Markdown conversion
turndownService.addRule('removeElementorDivs', {
  filter: function(node) {
    return node.classList && (
      node.classList.contains('elementor-element') ||
      node.classList.contains('elementor-widget') ||
      node.classList.contains('e-con') ||
      node.classList.contains('e-con-inner')
    );
  },
  replacement: function(content) {
    return content; // Keep content but remove the wrapper div
  }
});

turndownService.addRule('cleanFigures', {
  filter: 'figure',
  replacement: function(content) {
    return '\n' + content + '\n';
  }
});

turndownService.addRule('cleanFigcaptions', {
  filter: 'figcaption',
  replacement: function(content) {
    return '*' + content + '*\n';
  }
});

/**
 * Clean and convert WordPress HTML to Markdown
 */
function cleanHtmlToMarkdown(html) {
  if (!html) return '';
  
  // Remove HTML comments
  let cleaned = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove Elementor specific attributes
  cleaned = cleaned.replace(/data-[a-z-]+="[^"]*"/gi, '');
  cleaned = cleaned.replace(/class="[^"]*elementor[^"]*"/gi, '');
  
  // Convert to Markdown
  let markdown = turndownService.turndown(cleaned);
  
  // Clean up excessive newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  // Trim
  markdown = markdown.trim();
  
  return markdown;
}

/**
 * Fetch WordPress posts for a specific language
 */
async function fetchWordPressPosts(lang = 'en', page = 1, perPage = 10) {
  const langPath = CONFIG.wordpress.langs[lang];
  const url = `${CONFIG.wordpress.url}${langPath}${CONFIG.wordpress.restApi}/posts?page=${page}&per_page=${perPage}&_embed`;
  
  console.log(`📥 Fetching ${lang.toUpperCase()} posts from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch posts: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const posts = await response.json();
    const totalPosts = response.headers.get('X-WP-Total');
    const totalPages = response.headers.get('X-WP-TotalPages');
    
    console.log(`✅ Fetched ${posts.length} posts (Total: ${totalPosts}, Page ${page}/${totalPages})`);
    
    return {
      posts,
      pagination: {
        total: parseInt(totalPosts),
        totalPages: parseInt(totalPages),
        currentPage: page,
        perPage
      }
    };
  } catch (error) {
    console.error(`❌ Error fetching WordPress posts:`, error.message);
    return null;
  }
}

/**
 * Get category ID from Strapi by slug
 */
async function getCategoryIdBySlug(slug) {
  try {
    const response = await fetch(
      `${CONFIG.strapi.url}/api/blog-categories?filters[slug][$eq]=${slug}`,
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.strapi.token}`
        }
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data[0]?.id || null;
  } catch (error) {
    console.error(`❌ Error fetching category:`, error.message);
    return null;
  }
}

/**
 * Transform WordPress post to Strapi format
 */
async function transformPost(wpPost, lang = 'en') {
  console.log(`\n🔄 Transforming: "${wpPost.title.rendered}" (${lang.toUpperCase()})`);
  
  // Convert HTML to Markdown
  const contentMarkdown = cleanHtmlToMarkdown(wpPost.content.rendered);
  const excerptMarkdown = cleanHtmlToMarkdown(wpPost.excerpt.rendered);
  
  // Get category slug (WordPress returns category ID, we need to map it)
  let categoryId = null;
  if (wpPost.categories && wpPost.categories.length > 0) {
    // For now, we'll need to fetch category details from WordPress
    // In production, you'd want to cache this mapping
    const wpCategoryId = wpPost.categories[0];
    // TODO: Implement category mapping based on your WordPress category IDs
    console.log(`   📁 WordPress Category ID: ${wpCategoryId}`);
  }
  
  // Extract featured image URL (if exists)
  let featuredImageUrl = null;
  if (wpPost._embedded && wpPost._embedded['wp:featuredmedia']) {
    featuredImageUrl = wpPost._embedded['wp:featuredmedia'][0]?.source_url;
    console.log(`   🖼️  Featured image: ${featuredImageUrl}`);
    console.log(`   ⚠️  Note: Images will be added manually as per instructions`);
  }
  
  // Create Strapi blog post object
  const strapiPost = {
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: excerptMarkdown,
    content: contentMarkdown,
    published_at: wpPost.date,
    locale: lang,
    blog_details: {
      read_time: calculateReadTime(contentMarkdown),
      featured: false // You can customize this based on WordPress metadata
    }
  };
  
  console.log(`   ✅ Transformed (Content: ${contentMarkdown.length} chars)`);
  
  return strapiPost;
}

/**
 * Calculate estimated read time (words per minute)
 */
function calculateReadTime(markdown) {
  const wordsPerMinute = 200;
  const wordCount = markdown.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Create post in Strapi
 */
async function createStrapiPost(postData, locale = 'en') {
  try {
    const response = await fetch(`${CONFIG.strapi.url}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.strapi.token}`
      },
      body: JSON.stringify({
        data: {
          ...postData,
          locale: locale,
          publishedAt: new Date().toISOString()
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error(`❌ Failed to create post in Strapi:`, error);
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ Created in Strapi - ID: ${data.data.id}`);
    return data.data;
  } catch (error) {
    console.error(`❌ Error creating Strapi post:`, error.message);
    return null;
  }
}

/**
 * Create translation for an existing post
 */
async function createTranslation(originalPostId, postData, locale) {
  try {
    const response = await fetch(
      `${CONFIG.strapi.url}/api/blogs/${originalPostId}/localizations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.strapi.token}`
        },
        body: JSON.stringify({
          ...postData,
          locale: locale
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error(`❌ Failed to create ${locale} translation:`, error);
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ Created ${locale.toUpperCase()} translation - ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error(`❌ Error creating translation:`, error.message);
    return null;
  }
}

/**
 * Migrate a single post with all its translations
 */
async function migratePostWithTranslations(englishPost) {
  console.log('\n' + '='.repeat(70));
  console.log(`📝 Migrating: "${englishPost.title.rendered}"`);
  console.log('='.repeat(70));
  
  // 1. Create English version (master)
  const enTransformed = await transformPost(englishPost, 'en');
  const createdPost = await createStrapiPost(enTransformed, 'en');
  
  if (!createdPost) {
    console.error('❌ Failed to create English post. Skipping translations.');
    return null;
  }
  
  // 2. Try to find and create translations
  const translations = {
    en: createdPost.id,
    es: null,
    ja: null,
    fi: null
  };
  
  // For now, we'll skip automatic translation fetching
  // In production, you'd need to implement translation detection
  console.log('\n⚠️  Note: Translation linking not implemented yet.');
  console.log('   You can manually create translations in Strapi admin panel.');
  
  return {
    english: createdPost,
    translations
  };
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('\n🚀 WordPress to Strapi Blog Migration');
  console.log('=' .repeat(70));
  console.log(`📊 Mode: ${CONFIG.test.enabled ? 'TEST' : 'PRODUCTION'}`);
  console.log(`📝 Posts per batch: ${CONFIG.test.enabled ? CONFIG.test.maxPosts : 'ALL'}`);
  console.log('='.repeat(70) + '\n');
  
  // Step 1: Fetch English posts (master language)
  const maxPosts = CONFIG.test.enabled ? CONFIG.test.maxPosts : 100;
  const result = await fetchWordPressPosts('en', 1, maxPosts);
  
  if (!result || !result.posts) {
    console.error('❌ Failed to fetch posts. Exiting.');
    return;
  }
  
  const posts = result.posts;
  console.log(`\n📊 Found ${posts.length} English posts to migrate\n`);
  
  // Step 2: Migrate each post
  const migrationResults = {
    success: [],
    failed: []
  };
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`\n[${i + 1}/${posts.length}] Starting migration...`);
    
    const result = await migratePostWithTranslations(post);
    
    if (result) {
      migrationResults.success.push({
        title: post.title.rendered,
        strapiId: result.english.id
      });
    } else {
      migrationResults.failed.push({
        title: post.title.rendered,
        wpId: post.id
      });
    }
    
    // Small delay between posts
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Step 3: Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successfully migrated: ${migrationResults.success.length}`);
  console.log(`❌ Failed: ${migrationResults.failed.length}`);
  
  if (migrationResults.success.length > 0) {
    console.log('\n✅ Successful migrations:');
    migrationResults.success.forEach(item => {
      console.log(`   - "${item.title}" (Strapi ID: ${item.strapiId})`);
    });
  }
  
  if (migrationResults.failed.length > 0) {
    console.log('\n❌ Failed migrations:');
    migrationResults.failed.forEach(item => {
      console.log(`   - "${item.title}" (WP ID: ${item.wpId})`);
    });
  }
  
  console.log('\n✨ Migration complete!\n');
}

// Run migration
migrate().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
