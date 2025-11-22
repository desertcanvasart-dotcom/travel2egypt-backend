# Blog Migration from WordPress to Strapi

Complete guide for migrating 498 blog posts from travel2egypt.org WordPress to Strapi.

---

## 📋 Overview

**Source:** WordPress (travel2egypt.org)
**Target:** Strapi 4 Backend
**Total Posts:** 498 (167 EN master + translations)
**Languages:** EN, ES, JA, FI
**Categories:** 26

---

## 🎯 Migration Plan

### Phase 1: Setup ✅
1. Install dependencies
2. Configure Strapi API access
3. Enable public API permissions

### Phase 2: Categories ✅
4. Create all 26 blog categories in Strapi

### Phase 3: Test Migration ✅
5. Test with 2 posts
6. Verify data quality
7. Check Markdown conversion

### Phase 4: Full Migration ⏳
8. Migrate all 167 English posts
9. Handle translations (manual or scripted)

---

## 🚀 Step 1: Install Dependencies

Navigate to your migration directory:

```bash
cd ~/Desktop/travel2egypt-backend
# Or create a new directory for migration scripts:
mkdir ~/Desktop/blog-migration
cd ~/Desktop/blog-migration
```

Initialize npm and install required packages:

```bash
npm init -y
npm install turndown node-fetch@2
```

**Why these packages?**
- `turndown`: Converts HTML to Markdown
- `node-fetch@2`: Makes HTTP requests (v2 for CommonJS compatibility)

---

## 🔑 Step 2: Get Strapi API Token

### 2.1 Start Your Strapi Backend

```bash
cd ~/Desktop/travel2egypt-backend
npm run develop
```

Wait for Strapi to start. It should open at: http://localhost:1337/admin

### 2.2 Create API Token

1. Login to Strapi admin panel
2. Go to: **Settings** (⚙️) → **API Tokens** → **Create new API Token**
3. Fill in:
   - **Name:** `Blog Migration`
   - **Description:** `Token for migrating WordPress blog posts`
   - **Token duration:** `Unlimited` (or set custom duration)
   - **Token type:** `Full access` (for testing) or `Custom` (recommended for production)

4. If using **Custom**, enable these permissions:
   - **Blog:** `create`, `update`, `find`, `findOne`
   - **Blog-category:** `create`, `find`, `findOne`
   - **Upload:** `upload` (if handling images)

5. Click **Save**
6. **IMPORTANT:** Copy the token immediately (it won't be shown again!)

Example token: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

### 2.3 Configure API Permissions (Public Access)

For the Next.js frontend to fetch blogs, enable public permissions:

1. Go to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Enable these permissions for **Blog**:
   - ✅ `find`
   - ✅ `findOne`
3. Enable these permissions for **Blog-category**:
   - ✅ `find`
   - ✅ `findOne`
4. Click **Save**

---

## 📁 Step 3: Copy Migration Scripts

Copy the two scripts I created into your migration directory:

```bash
# If you're in the blog-migration directory
# Copy from wherever Claude created them
```

You should have:
- `create-blog-categories.js`
- `migrate-blog-posts.js`

---

## 🏷️ Step 4: Create Blog Categories

### 4.1 Update Configuration

Open `create-blog-categories.js` and update:

```javascript
const STRAPI_URL = 'http://localhost:1337'; // ✅ Keep as-is for local
const STRAPI_TOKEN = 'YOUR_API_TOKEN_HERE'; // ⚠️ Replace with your token
```

### 4.2 Run the Script

```bash
node create-blog-categories.js
```

**Expected Output:**
```
🚀 Starting to create blog categories in Strapi...

📊 Total categories to create: 26

✅ Created: "Adventure" (slug: adventure) - ID: 1
✅ Created: "Company Insight" (slug: company-insight) - ID: 2
✅ Created: "Coptic monuments" (slug: coptic-monuments) - ID: 3
...
✅ Created: "Wellness" (slug: wellness) - ID: 26

==================================================
📊 SUMMARY
==================================================
✅ Successfully created: 26
❌ Failed: 0

✨ Done! Check your Strapi admin panel.
```

### 4.3 Verify in Strapi

1. Go to: http://localhost:1337/admin
2. Navigate to: **Content Manager** → **Blog Category**
3. You should see all 26 categories

---

## 🧪 Step 5: Test Migration (2 Posts)

### 5.1 Update Configuration

Open `migrate-blog-posts.js` and update:

```javascript
const CONFIG = {
  wordpress: {
    url: 'https://travel2egypt.org',  // ✅ Keep as-is
    // ... rest stays the same
  },
  strapi: {
    url: 'http://localhost:1337',     // ✅ Keep as-is for local
    token: 'YOUR_API_TOKEN_HERE'      // ⚠️ Replace with your token
  },
  test: {
    enabled: true,   // ✅ Keep true for testing
    maxPosts: 2      // ✅ Start with 2 posts
  }
};
```

### 5.2 Run Test Migration

```bash
node migrate-blog-posts.js
```

**Expected Output:**
```
🚀 WordPress to Strapi Blog Migration
======================================================================
📊 Mode: TEST
📝 Posts per batch: 2
======================================================================

📥 Fetching EN posts from: https://travel2egypt.org/wp-json/wp/v2/posts...
✅ Fetched 2 posts (Total: 167, Page 1/17)

📊 Found 2 English posts to migrate

======================================================================
[1/2] Starting migration...

🔄 Transforming: "The Curse of King Tut's Tomb" (EN)
   📁 WordPress Category ID: 356
   🖼️  Featured image: https://...jpg
   ⚠️  Note: Images will be added manually as per instructions
   ✅ Transformed (Content: 15234 chars)

✅ Created in Strapi - ID: 1

⚠️  Note: Translation linking not implemented yet.
   You can manually create translations in Strapi admin panel.
======================================================================

... (second post) ...

======================================================================
📊 MIGRATION SUMMARY
======================================================================
✅ Successfully migrated: 2
❌ Failed: 0

✅ Successful migrations:
   - "The Curse of King Tut's Tomb" (Strapi ID: 1)
   - "..." (Strapi ID: 2)

✨ Migration complete!
```

### 5.3 Verify in Strapi

1. Go to: **Content Manager** → **Blog**
2. You should see 2 new blog posts
3. Click on one to check:
   - ✅ Title is correct
   - ✅ Slug is correct
   - ✅ Content is in Markdown format (clean, no HTML)
   - ✅ Excerpt is present
   - ✅ Read time is calculated

---

## 🎨 Step 6: Review Content Quality

### What to Check:

**1. Markdown Conversion Quality**
- Open a migrated post in Strapi
- Check the "content" field
- Should look like clean Markdown, not HTML

Example of good conversion:
```markdown
## The Origins of Egyptian Tomb Curses

The ancient Egyptians possessed one of history's most sophisticated 
understandings of death and the afterlife...

### Ancient Egyptian Death Culture

Pharaohs, viewed as living gods, required even more elaborate protection...
```

**2. Links Preservation**
- Internal links should be preserved: `[Valley of the Kings](https://travel2egypt.org/the-valley-of-the-kings/)`
- External links should work

**3. Special Characters**
- Check for proper rendering: é, ñ, ü, etc.
- Arabic text should be preserved if present

### Common Issues & Solutions:

| Issue | Solution |
|-------|----------|
| HTML tags still present | Check turndown configuration in script |
| Links broken | May need to update to new Strapi URLs later |
| Weird spacing | Normal - can be fixed with find/replace |
| Missing content | Check if WordPress API returned full content |

---

## 🔄 Step 7: Category Mapping (Important!)

The script currently doesn't map WordPress categories to Strapi categories automatically.

### Manual Category Mapping:

You need to create a category mapping object. Here's how:

1. Get WordPress category IDs from your sample post JSON
2. Map them to Strapi category slugs

**Add this to `migrate-blog-posts.js`:**

```javascript
// WordPress Category ID → Strapi Category Slug mapping
const CATEGORY_MAPPING = {
  356: 'pharaoh-monuments',  // Example from your sample post
  // Add more mappings as you discover them:
  // 123: 'adventure',
  // 456: 'culture',
  // etc.
};

// Then in transformPost function, replace this:
if (wpPost.categories && wpPost.categories.length > 0) {
  const wpCategoryId = wpPost.categories[0];
  const categorySlug = CATEGORY_MAPPING[wpCategoryId];
  
  if (categorySlug) {
    categoryId = await getCategoryIdBySlug(categorySlug);
    console.log(`   📁 Mapped to: ${categorySlug} (Strapi ID: ${categoryId})`);
  }
}

// And add categoryId to strapiPost:
const strapiPost = {
  // ... existing fields ...
  blog_categories: categoryId ? [categoryId] : []
};
```

**To get all WordPress category IDs:**

You can fetch them from WordPress API:
```bash
curl https://travel2egypt.org/wp-json/wp/v2/categories
```

---

## 🚀 Step 8: Full Migration (All Posts)

Once you're happy with the test results:

### 8.1 Update Configuration

```javascript
const CONFIG = {
  // ... wordpress config stays same ...
  test: {
    enabled: false,  // ⚠️ Change to false
    maxPosts: 2      // This will be ignored
  }
};
```

### 8.2 Run Full Migration

```bash
node migrate-blog-posts.js
```

This will migrate all 167 English posts. Expect this to take **15-30 minutes**.

### 8.3 Monitor Progress

The script will output:
- Current post being migrated
- Success/failure status
- Final summary

You can safely stop it with `Ctrl+C` and resume later (though you'll need to track which posts were already migrated).

---

## 🌍 Step 9: Handle Translations

Translations are more complex. You have two options:

### Option A: Manual in Strapi (Recommended for Quality)

1. Go to a migrated English post in Strapi
2. Click the **locale dropdown** (shows "English")
3. Select "Create new locale" → Choose language
4. Fill in translated content
5. Save

**Pros:** Full control, can verify quality
**Cons:** Time-consuming for 143 ES + 127 JA + 61 FI = 331 translations

### Option B: Script-Based (Faster but Needs Work)

You would need to:
1. Detect which posts have translations in WordPress
2. Fetch translation by matching slug patterns
3. Link them in Strapi using the localizations endpoint

This requires more development. We can work on this if needed.

---

## 📊 Step 10: Verify Migration

### Check Statistics:

```sql
-- Run this in your PostgreSQL database
SELECT locale, COUNT(*) as post_count 
FROM blogs 
GROUP BY locale;
```

Expected:
- `en`: 167 posts
- More if you added translations

### Spot Check:

1. Open 10 random posts in Strapi
2. Verify content quality
3. Check slugs are unique
4. Ensure dates are correct

---

## 🐛 Troubleshooting

### "Failed to create post: 401 Unauthorized"
**Solution:** Check your API token. Make sure it's correctly copied and has proper permissions.

### "Failed to create post: 400 Bad Request"
**Solution:** Check Strapi logs. Likely a data validation issue. Common causes:
- Slug too long (max 255 chars)
- Required fields missing
- Invalid locale code

### "Content looks weird in Strapi"
**Solution:** HTML → Markdown conversion issue. You may need to adjust turndown rules:
- Add more custom rules for specific HTML patterns
- Check for WordPress shortcodes
- Look for embedded content (videos, etc.)

### "Connection refused"
**Solution:** Make sure Strapi is running:
```bash
cd ~/Desktop/travel2egypt-backend
npm run develop
```

### Script stops/crashes
**Solution:** 
- Check your internet connection
- WordPress might be rate-limiting (add delays)
- Check Node.js memory (for large migrations)

---

## 📝 Next Steps After Migration

1. **Add Featured Images Manually**
   - You mentioned you'll do this manually
   - Go through each post and upload images

2. **Update Internal Links**
   - Links currently point to WordPress URLs
   - May need to update to new site URLs

3. **SEO Fields**
   - Add meta descriptions if needed
   - Check slug quality

4. **Test Frontend**
   - Update Next.js to fetch from Strapi
   - Test that all pages render correctly

5. **Deploy to Production**
   - Once verified locally, deploy Strapi to production
   - Re-run migration on production Strapi

---

## 📞 Need Help?

If you encounter issues:

1. Check Strapi logs: Look in the terminal where Strapi is running
2. Check browser console: When using Strapi admin panel
3. Verify API responses: Use Postman or curl to test endpoints
4. Share error messages: The full error output helps diagnose issues

---

## 🎉 Success Criteria

Your migration is successful when:

- ✅ All 26 categories created
- ✅ 167 English posts migrated
- ✅ Content is clean Markdown
- ✅ Slugs are correct
- ✅ Dates are preserved
- ✅ No duplicate posts
- ✅ Can view posts in Strapi admin
- ✅ API returns posts correctly

---

**Last Updated:** November 21, 2025
**Status:** Ready for testing
**Next Phase:** Category mapping completion
