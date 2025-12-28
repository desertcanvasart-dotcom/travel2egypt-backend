const { createStrapi } = require('@strapi/strapi');

// Simple language detection based on character ranges
function detectLanguage(text) {
  if (!text) return 'en';
  
  // Japanese (Hiragana, Katakana, CJK)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
  
  // Arabic
  if (/[\u0600-\u06ff]/.test(text)) return 'ar';
  
  // Chinese (if no Japanese kana, assume Chinese for CJK)
  if (/[\u4e00-\u9fff]/.test(text) && !/[\u3040-\u30ff]/.test(text)) return 'zh';
  
  // Finnish/European - check for specific Finnish characters and words
  if (/[äöåÄÖÅ]/.test(text) && /\b(ja|on|ei|ett|kanssa|yli)\b/i.test(text)) return 'fi';
  
  // Spanish
  if (/[ñ¿¡]/.test(text) || (/[áéíóúü]/i.test(text) && /\b(el|la|los|las|del|una)\b/i.test(text))) return 'es';
  
  // Default to English
  return 'en';
}

async function fixBlogLocales() {
  const strapi = await createStrapi().load();
  
  try {
    // Get all blogs
    const blogs = await strapi.db.query('api::blog.blog').findMany({
      select: ['id', 'documentId', 'title', 'locale'],
    });
    
    console.log(`Found ${blogs.length} blog posts`);
    
    let fixed = 0;
    for (const blog of blogs) {
      const detectedLocale = detectLanguage(blog.title);
      
      if (blog.locale !== detectedLocale) {
        console.log(`Fixing: "${blog.title.substring(0, 50)}..." from ${blog.locale} to ${detectedLocale}`);
        
        await strapi.db.query('api::blog.blog').update({
          where: { id: blog.id },
          data: { locale: detectedLocale }
        });
        fixed++;
      }
    }
    
    console.log(`\nFixed ${fixed} blog posts`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await strapi.destroy();
  }
}

fixBlogLocales();
