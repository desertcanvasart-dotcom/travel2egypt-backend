const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'http://127.0.0.1:1337';
const API_TOKEN = 'cf6c6dacc9d257248204c2d4fffa1175041af3171b55b773b5085556e845f24e6617148382c3c8e25c8ce290acdf260907bd59379d880f21d441536d77c88f649a395daefd86f5b6720f99f9b2e8e4b6041eb288ae2a0a4a1a4b17123822f5a765676e24c4d3b23415672b2181f1d0ba1749a4952d292926030734d043c9858b';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`
};

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  
  let currentRow = '';
  for (let i = 1; i < lines.length; i++) {
    currentRow += (currentRow ? '\n' : '') + lines[i];
    const quoteCount = (currentRow.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) {
      if (currentRow.trim()) {
        const values = parseCSVLine(currentRow);
        if (values.length === headers.length) {
          const row = {};
          headers.forEach((h, idx) => {
            row[h.trim()] = values[idx];
          });
          rows.push(row);
        }
      }
      currentRow = '';
    }
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function cleanContent(html) {
  if (!html) return '';
  let content = html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ');
  content = content.replace(/http:\/\/travel2egypt\.org/g, 'https://travel2egypt.org');
  content = content.replace(/data-wpil-monitor-id="[^"]*"/g, '');
  return content;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200);
}

async function findOrCreateCategory(name, locale = 'en') {
  if (!name || !name.trim()) return null;
  const slug = generateSlug(name.trim());
  
  try {
    const searchRes = await fetch(
      `${STRAPI_URL}/api/blog-categories?filters[slug][$eq]=${slug}&locale=${locale}`,
      { headers }
    );
    const searchData = await searchRes.json();
    
    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0].id;
    }
    
    const createRes = await fetch(`${STRAPI_URL}/api/blog-categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: { name: name.trim(), slug: slug, locale: locale }
      })
    });
    
    const createData = await createRes.json();
    if (createData.data) {
      console.log(`  ✓ Created category: ${name}`);
      return createData.data.id;
    }
  } catch (err) {
    console.error(`  ✗ Error with category ${name}:`, err.message);
  }
  return null;
}

async function findOrCreateTag(name, locale = 'en') {
  if (!name || !name.trim()) return null;
  const slug = generateSlug(name.trim());
  
  try {
    const searchRes = await fetch(
      `${STRAPI_URL}/api/blog-tags?filters[slug][$eq]=${slug}&locale=${locale}`,
      { headers }
    );
    const searchData = await searchRes.json();
    
    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0].id;
    }
    
    const createRes = await fetch(`${STRAPI_URL}/api/blog-tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: { name: name.trim(), slug: slug, locale: locale }
      })
    });
    
    const createData = await createRes.json();
    if (createData.data) {
      console.log(`  ✓ Created tag: ${name}`);
      return createData.data.id;
    }
  } catch (err) {
    console.error(`  ✗ Error with tag ${name}:`, err.message);
  }
  return null;
}

async function importBlogPost(post, locale = 'en') {
  const title = post['Title'] || '';
  if (!title) {
    console.log('  ⚠ Skipping post without title');
    return null;
  }
  
  const slug = generateSlug(title);
  
  try {
    const existingRes = await fetch(
      `${STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&locale=${locale}`,
      { headers }
    );
    const existingData = await existingRes.json();
    
    if (existingData.data && existingData.data.length > 0) {
      console.log(`  ⚠ Already exists: ${title.substring(0, 50)}...`);
      return existingData.data[0];
    }
  } catch (err) {}
  
  const categoryIds = [];
  if (post['Categories']) {
    const categories = post['Categories'].split(',').map(c => c.trim()).filter(c => c);
    for (const cat of categories) {
      const catId = await findOrCreateCategory(cat, locale);
      if (catId) categoryIds.push(catId);
    }
  }
  
  const tagIds = [];
  if (post['Tags']) {
    const tags = post['Tags'].split(',').map(t => t.trim()).filter(t => t);
    for (const tag of tags) {
      const tagId = await findOrCreateTag(tag, locale);
      if (tagId) tagIds.push(tagId);
    }
  }
  
  let publishDate = null;
  if (post['Date']) {
    try {
      publishDate = new Date(post['Date']).toISOString();
    } catch (e) {
      publishDate = new Date().toISOString();
    }
  }
  
  const blogData = {
    title: title,
    slug: slug,
    excerpt: post['Excerpt'] || '',
    content: cleanContent(post['Content'] || ''),
    publish_date: publishDate,
    locale: locale,
    blog_categories: categoryIds,
    blog_tags: tagIds
  };
  
  try {
    const createRes = await fetch(`${STRAPI_URL}/api/blogs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: blogData })
    });
    
    const createData = await createRes.json();
    
    if (createData.error) {
      console.log(`  ✗ Error: ${createData.error.message}`);
      return null;
    }
    
    if (createData.data) {
      console.log(`  ✓ Imported: ${title.substring(0, 50)}...`);
      return createData.data;
    }
  } catch (err) {
    console.error(`  ✗ Failed to import "${title}":`, err.message);
  }
  return null;
}

async function main() {
  const csvPath = process.argv[2];
  
  if (!csvPath) {
    console.log('Usage: node import-blogs.js <path-to-csv>');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }
  
  console.log(`\n📖 Reading CSV: ${csvPath}\n`);
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const posts = parseCSV(content);
  
  console.log(`📊 Found ${posts.length} posts to import\n`);
  
  let locale = 'en';
  const filename = path.basename(csvPath).toLowerCase();
  if (filename.includes('finnish')) locale = 'fi';
  else if (filename.includes('japanese')) locale = 'ja';
  else if (filename.includes('spanish')) locale = 'es';
  
  console.log(`🌐 Importing with locale: ${locale}\n`);
  
  let imported = 0;
  let failed = 0;
  let skipped = 0;
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`\n[${i + 1}/${posts.length}] Processing: ${(post['Title'] || 'No title').substring(0, 50)}...`);
    
    const result = await importBlogPost(post, locale);
    
    if (result) {
      if (result.id) imported++;
      else skipped++;
    } else {
      failed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Import Complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Failed:   ${failed}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
