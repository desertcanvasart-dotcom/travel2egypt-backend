const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'https://t2e-backend-production.up.railway.app';
const API_TOKEN = 'bd5df69f4cdc016505856dd0b4bc210829e445e1b632789971007e8c6cdaf5d3d872b14b43dcac0b5fc2bcf087479a0e72cb4ca3336f692b10f00a1311203119dc0a9aed02030fdc3484c845603f31c1dcf149c9c6c3c407a4879db49970f86126d93232d7a09853a275a13a650c33b0c5026bc49479dc617c3609177c7b9a5f';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`
};

function parseCSV(content) {
  const lines = content.split('\n');
  const csvHeaders = parseCSVLine(lines[0]);
  const rows = [];
  
  let currentRow = '';
  for (let i = 1; i < lines.length; i++) {
    currentRow += (currentRow ? '\n' : '') + lines[i];
    const quoteCount = (currentRow.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) {
      if (currentRow.trim()) {
        const values = parseCSVLine(currentRow);
        if (values.length === csvHeaders.length) {
          const row = {};
          csvHeaders.forEach((h, idx) => {
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
  content = content.replace(/http:\/\/islamm15\.sg-host\.com/g, 'https://travel2egypt.org');
  content = content.replace(/data-wpil-monitor-id="[^"]*"/g, '');
  // Remove Elementor div wrappers
  content = content.replace(/<div[^>]*class="[^"]*elementor[^"]*"[^>]*>/gi, '');
  content = content.replace(/<\/div>/gi, '');
  content = content.replace(/data-id="[^"]*"/g, '');
  content = content.replace(/data-element_type="[^"]*"/g, '');
  content = content.replace(/data-settings="[^"]*"/g, '');
  content = content.replace(/data-widget_type="[^"]*"/g, '');
  return content.trim();
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200);
}

async function findOrCreateTipCategory(name, locale = 'en') {
  if (!name || !name.trim()) return null;
  const slug = generateSlug(name.trim());
  
  try {
    const searchRes = await fetch(
      `${STRAPI_URL}/api/tip-categories?filters[slug][$eq]=${slug}&locale=${locale}`,
      { headers }
    );
    const searchData = await searchRes.json();
    
    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0].id;
    }
    
    const createRes = await fetch(`${STRAPI_URL}/api/tip-categories?locale=${locale}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: { name: name.trim(), slug: slug }
      })
    });
    
    const createData = await createRes.json();
    if (createData.data) {
      console.log(`  ✓ Created tip category: ${name}`);
      return createData.data.id;
    }
  } catch (err) {
    console.error(`  ✗ Error with tip category ${name}:`, err.message);
  }
  return null;
}

async function importTravelTip(post, locale = 'en') {
  const title = post['Title'] || '';
  if (!title) {
    console.log('  ⚠ Skipping tip without title');
    return null;
  }
  
  // Use slug from CSV if available, otherwise generate
  const slug = post['Slug'] || generateSlug(title);
  
  try {
    const existingRes = await fetch(
      `${STRAPI_URL}/api/travel-tips?filters[slug][$eq]=${slug}&locale=${locale}`,
      { headers }
    );
    const existingData = await existingRes.json();
    
    if (existingData.data && existingData.data.length > 0) {
      console.log(`  ⚠ Already exists: ${title.substring(0, 50)}...`);
      return existingData.data[0];
    }
  } catch (err) {}
  
  // Process tip categories (pipe-separated in CSV)
  const categoryIds = [];
  if (post['Tip Categories']) {
    const categories = post['Tip Categories'].split('|').map(c => c.trim()).filter(c => c);
    for (const cat of categories) {
      const catId = await findOrCreateTipCategory(cat, locale);
      if (catId) categoryIds.push(catId);
    }
  }
  
  const tipData = {
    title: title,
    slug: slug,
    excerpt: post['Excerpt'] || '',
    content: cleanContent(post['Content'] || ''),
    tip_categories: categoryIds
  };
  
  try {
    const createRes = await fetch(`${STRAPI_URL}/api/travel-tips?locale=${locale}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: tipData })
    });
    
    const createData = await createRes.json();
    
    if (createData.error) {
      console.log(`  ✗ Error: ${createData.error.message}`);
      return null;
    }
    
    if (createData.data) {
      console.log(`  ✓ Imported [${locale}]: ${title.substring(0, 50)}...`);
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
    console.log('Usage: node import-travel-tips.js <path-to-csv>');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }
  
  console.log(`\n📖 Reading CSV: ${csvPath}\n`);
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const posts = parseCSV(content);
  
  console.log(`📊 Found ${posts.length} travel tips to import\n`);
  
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
    
    const result = await importTravelTip(post, locale);
    
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
