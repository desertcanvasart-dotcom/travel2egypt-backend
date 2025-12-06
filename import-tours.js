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
  content = content.replace(/data-start="[^"]*"/g, '');
  content = content.replace(/data-end="[^"]*"/g, '');
  content = content.replace(/data-is-last-node="[^"]*"/g, '');
  content = content.replace(/data-is-only-node="[^"]*"/g, '');
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

function parsePricingTiers(groupSizes, prices) {
  if (!groupSizes || !prices) return [];
  const sizes = groupSizes.split('|').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const priceList = prices.split('|').map(p => parseFloat(p.trim())).filter(n => !isNaN(n));
  
  const tiers = [];
  for (let i = 0; i < Math.min(sizes.length, priceList.length); i++) {
    tiers.push({ group_size: sizes[i], price: priceList[i] });
  }
  return tiers;
}

// Map physical level to enum values
function mapPhysicalLevel(level) {
  if (!level) return null;
  const l = level.toLowerCase().trim();
  if (l.includes('easy') || l.includes('light')) return 'easy';
  if (l.includes('moderate') || l.includes('medium')) return 'moderate';
  if (l.includes('challenging') || l.includes('hard') || l.includes('difficult')) return 'challenging';
  return null;
}

async function findOrCreateRelation(endpoint, name, locale = 'en') {
  if (!name || !name.trim()) return null;
  const slug = generateSlug(name.trim());
  
  try {
    const searchRes = await fetch(
      `${STRAPI_URL}/api/${endpoint}?filters[slug][$eq]=${slug}&locale=${locale}`,
      { headers }
    );
    const searchData = await searchRes.json();
    
    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0].id;
    }
    
    const createRes = await fetch(`${STRAPI_URL}/api/${endpoint}?locale=${locale}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: { name: name.trim(), slug: slug }
      })
    });
    
    const createData = await createRes.json();
    if (createData.data) {
      console.log(`  ✓ Created ${endpoint}: ${name}`);
      return createData.data.id;
    }
  } catch (err) {
    console.error(`  ✗ Error with ${endpoint} ${name}:`, err.message);
  }
  return null;
}

async function importTour(post, locale = 'en') {
  const title = post['Title'] || '';
  if (!title) {
    console.log('  ⚠ Skipping tour without title');
    return null;
  }
  
  const slug = post['Slug'] || generateSlug(title);
  
  try {
    const existingRes = await fetch(
      `${STRAPI_URL}/api/tours?filters[slug][$eq]=${slug}&locale=${locale}`,
      { headers }
    );
    const existingData = await existingRes.json();
    
    if (existingData.data && existingData.data.length > 0) {
      console.log(`  ⚠ Already exists: ${title.substring(0, 50)}...`);
      return existingData.data[0];
    }
  } catch (err) {}
  
  // Process relations
  const locationIds = [];
  if (post['Locations']) {
    const locations = post['Locations'].split('|').map(l => l.trim()).filter(l => l);
    for (const loc of locations) {
      const locId = await findOrCreateRelation('locations', loc, locale);
      if (locId) locationIds.push(locId);
    }
  }
  
  const tourTypeIds = [];
  if (post['Tour Types']) {
    const types = post['Tour Types'].split('|').map(t => t.trim()).filter(t => t);
    for (const type of types) {
      const typeId = await findOrCreateRelation('tour-types', type, locale);
      if (typeId) tourTypeIds.push(typeId);
    }
  }
  
  const tourModeIds = [];
  if (post['Tour Modes']) {
    const modes = post['Tour Modes'].split('|').map(m => m.trim()).filter(m => m);
    for (const mode of modes) {
      const modeId = await findOrCreateRelation('tour-modes', mode, locale);
      if (modeId) tourModeIds.push(modeId);
    }
  }
  
  const tourThemeIds = [];
  if (post['Tour Themes']) {
    const themes = post['Tour Themes'].split('|').map(t => t.trim()).filter(t => t);
    for (const theme of themes) {
      const themeId = await findOrCreateRelation('tour-themes', theme, locale);
      if (themeId) tourThemeIds.push(themeId);
    }
  }
  
  // Build tour details component with CORRECT field names
  const tourDetails = {};
  if (post['Tour Overview']) tourDetails.overview = cleanContent(post['Tour Overview']);
  if (post['Duration']) tourDetails.duration = post['Duration'];
  if (post['Pickup Time']) tourDetails.pickup_time = post['Pickup Time'];
  if (post['Group Size']) tourDetails.group_size = String(post['Group Size']);
  if (post['Languages']) tourDetails.languages = post['Languages'];
  if (post['Tour Highlights']) tourDetails.highlights = cleanContent(post['Tour Highlights']);
  if (post['Itinerary Type']) {
    const iType = post['Itinerary Type'].toLowerCase();
    if (iType.includes('simple') || iType.includes('single')) {
      tourDetails.itinerary_type = 'simple';
    } else if (iType.includes('detail') || iType.includes('multi')) {
      tourDetails.itinerary_type = 'detailed';
    }
  }
  if (post['Itinerary (Simple)']) tourDetails.itinerary_simple = cleanContent(post['Itinerary (Simple)']);
  if (post['Whats Included']) tourDetails.inclusions = cleanContent(post['Whats Included']);
  if (post['Whats Not Included']) tourDetails.exclusions = cleanContent(post['Whats Not Included']);
  if (post['Important Information']) tourDetails.important_info = cleanContent(post['Important Information']);
  if (post['What to Bring']) tourDetails.what_to_bring = cleanContent(post['What to Bring']);
  if (post['Physical Activity Level']) {
    const level = mapPhysicalLevel(post['Physical Activity Level']);
    if (level) tourDetails.physical_level = level;
  }
  if (post['Average Rating']) {
    const rating = parseFloat(post['Average Rating']);
    if (!isNaN(rating)) tourDetails.average_rating = rating;
  }
  
  // Build package pricing
  const packagePricing = { currency: 'USD' };
  const standardTiers = parsePricingTiers(post['Ra Package Pricing_group_size'], post['Ra Package Pricing_price']);
  const deluxeTiers = parsePricingTiers(post['Horus Pricing Table_group_size'], post['Horus Pricing Table_price']);
  const luxuryTiers = parsePricingTiers(post['Pharaohs Feast Package Pricing_group_size'], post['Pharaohs Feast Package Pricing_price']);
  
  if (standardTiers.length > 0) packagePricing.standard_tiers = standardTiers;
  if (deluxeTiers.length > 0) packagePricing.deluxe_tiers = deluxeTiers;
  if (luxuryTiers.length > 0) packagePricing.luxury_tiers = luxuryTiers;
  
  // Build child pricing
  const childPricing = {};
  if (post['Child Discount Available']) childPricing.discount_available = post['Child Discount Available'].toLowerCase() === 'yes';
  if (post['Child Discount Percentage']) childPricing.discount_percentage = parseFloat(post['Child Discount Percentage']) || 0;
  if (post['Child Age Limit']) childPricing.age_limit = parseInt(post['Child Age Limit']) || 12;
  
  const tourData = {
    title: title,
    slug: slug,
    content: cleanContent(post['Content'] || post['Tour Overview'] || ''),
    locations: locationIds,
    tour_types: tourTypeIds,
    tour_modes: tourModeIds,
    tour_themes: tourThemeIds
  };
  
  if (Object.keys(tourDetails).length > 0) {
    tourData.tour_details = tourDetails;
  }
  
  if (standardTiers.length > 0 || deluxeTiers.length > 0 || luxuryTiers.length > 0) {
    tourData.private_package_pricing = packagePricing;
  }
  
  if (Object.keys(childPricing).length > 0 && childPricing.discount_available !== undefined) {
    tourData.child_pricing = childPricing;
  }
  
  try {
    const createRes = await fetch(`${STRAPI_URL}/api/tours?locale=${locale}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: tourData })
    });
    
    const createData = await createRes.json();
    
    if (createData.error) {
      console.log(`  ✗ Error: ${createData.error.message}`);
      if (createData.error.details) {
        console.log(`    Details: ${JSON.stringify(createData.error.details)}`);
      }
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
    console.log('Usage: node import-tours.js <path-to-csv>');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }
  
  console.log(`\n📖 Reading CSV: ${csvPath}\n`);
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const posts = parseCSV(content);
  
  console.log(`📊 Found ${posts.length} tours to import\n`);
  
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
    
    const result = await importTour(post, locale);
    
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
