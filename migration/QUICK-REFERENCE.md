# Quick Reference: Blog Migration Commands

## 🚀 Quick Start (TL;DR)

```bash
# 1. Setup
cd ~/Desktop
mkdir blog-migration && cd blog-migration
npm install

# 2. Configure (Edit both JS files with your API token)
nano create-blog-categories.js  # Add your token
nano migrate-blog-posts.js      # Add your token

# 3. Start Strapi
cd ~/Desktop/travel2egypt-backend
npm run develop
# Keep this terminal open!

# 4. Run migration (in new terminal)
cd ~/Desktop/blog-migration
npm run create-categories        # Create 26 categories
npm run migrate-test            # Test with 2 posts

# 5. Verify in browser
open http://localhost:1337/admin
```

---

## 📋 File Structure

```
blog-migration/
├── package.json                  # Dependencies
├── create-blog-categories.js     # Creates 26 categories
├── migrate-blog-posts.js         # Main migration script
├── MIGRATION-GUIDE.md            # Full documentation
└── QUICK-REFERENCE.md            # This file
```

---

## 🔑 Before You Start

### Get Strapi API Token:
1. http://localhost:1337/admin
2. Settings → API Tokens → Create
3. Name: "Blog Migration"
4. Type: Full access
5. Copy token → Update in both .js files

### Enable Public API:
1. Settings → Users & Permissions → Roles → Public
2. Blog: ✅ find, ✅ findOne
3. Blog-category: ✅ find, ✅ findOne
4. Save

---

## 📝 npm Commands

```bash
# Install dependencies
npm install

# Create categories
npm run create-categories

# Test migration (2 posts)
npm run migrate-test

# Full migration (167 posts)
npm run migrate-full
```

---

## 🧪 Test Migration Checklist

After running test migration:

- [ ] Check Strapi admin: http://localhost:1337/admin
- [ ] Go to Content Manager → Blog
- [ ] Open first migrated post
- [ ] Verify:
  - [ ] Title looks correct
  - [ ] Slug is clean
  - [ ] Content is Markdown (not HTML)
  - [ ] Excerpt is present
  - [ ] Read time calculated
  - [ ] Published date correct

---

## 🔧 Configuration Options

### Test Mode (Default)
```javascript
test: {
  enabled: true,   // Only migrates 2 posts
  maxPosts: 2
}
```

### Production Mode
```javascript
test: {
  enabled: false,  // Migrates ALL posts
  maxPosts: 2      // Ignored when enabled=false
}
```

---

## 🐛 Common Issues

### "Cannot find module 'turndown'"
```bash
npm install
```

### "401 Unauthorized"
- Check API token in scripts
- Verify token has correct permissions

### "Connection refused"
```bash
# Make sure Strapi is running
cd ~/Desktop/travel2egypt-backend
npm run develop
```

### Content looks weird
- Check Markdown conversion in Strapi
- May need to adjust HTML cleaning rules

---

## 📊 Expected Results

### Categories:
- Total: 26 categories
- Time: ~30 seconds
- Check: Content Manager → Blog Category

### Test Migration:
- Posts: 2
- Time: ~1 minute
- Check: Content Manager → Blog

### Full Migration:
- Posts: 167 English posts
- Time: 15-30 minutes
- Check: Count in Content Manager

---

## 🎯 Migration Progress Tracking

### ✅ Phase 1: Setup
- [ ] Dependencies installed
- [ ] Strapi API token created
- [ ] Public API permissions enabled
- [ ] Scripts configured with token

### ✅ Phase 2: Categories
- [ ] All 26 categories created
- [ ] Verified in Strapi admin
- [ ] Slugs look correct

### ✅ Phase 3: Test
- [ ] 2 posts migrated successfully
- [ ] Content quality verified
- [ ] Markdown conversion looks good

### ✅ Phase 4: Full Migration
- [ ] All 167 posts migrated
- [ ] No duplicates
- [ ] Statistics verified

### 📝 Phase 5: Manual Work
- [ ] Add featured images manually
- [ ] Create translations (or script them)
- [ ] Update internal links if needed
- [ ] Add SEO metadata

---

## 📞 Quick Checks

### Check Strapi is Running:
```bash
curl http://localhost:1337/_health
# Should return: {"status":"ok"}
```

### Check API Token Works:
```bash
curl http://localhost:1337/api/blogs \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should return JSON with blogs
```

### Check WordPress API:
```bash
curl https://travel2egypt.org/wp-json/wp/v2/posts?per_page=1
# Should return 1 post in JSON
```

---

## 🎨 Example: Good vs Bad Markdown

### ❌ Bad (Still has HTML):
```html
<div class="elementor-element">
  <h2>The Origins</h2>
  <p>Ancient Egyptians...</p>
</div>
```

### ✅ Good (Clean Markdown):
```markdown
## The Origins

Ancient Egyptians possessed one of history's most 
sophisticated understandings...
```

---

## 🔄 Re-running Migration

If you need to re-run:

1. **Delete existing posts in Strapi**
   - Go to Content Manager → Blog
   - Select all → Delete

2. **Or use a different approach**
   - Add "skip if exists" logic to script
   - Check for duplicate slugs before creating

---

## 📈 Performance Tips

### For Large Migrations:
```javascript
// Add delays to avoid rate limiting
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second
```

### Monitor Progress:
```bash
# Watch Strapi logs in real-time
cd ~/Desktop/travel2egypt-backend
npm run develop
# Keep this terminal visible
```

---

## 🎉 Success Indicators

Migration is successful when you see:

```
======================================================================
📊 MIGRATION SUMMARY
======================================================================
✅ Successfully migrated: 167
❌ Failed: 0

✨ Migration complete!
```

Then verify in Strapi:
- All posts visible in Content Manager
- Can open and edit posts
- Frontend API returns posts correctly

---

## 📚 Full Documentation

For detailed explanations, see: `MIGRATION-GUIDE.md`

---

**Created:** November 21, 2025  
**Version:** 1.0  
**Ready:** ✅ For testing
