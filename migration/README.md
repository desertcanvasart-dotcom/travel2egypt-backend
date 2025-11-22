# 📦 WordPress to Strapi Blog Migration Package

Complete toolkit for migrating 498 blog posts from travel2egypt.org WordPress to Strapi 4.

**Created:** November 21, 2025  
**Status:** ✅ Ready for Testing  
**Migration Target:** 167 English posts (master) + translations

---

## 📁 Package Contents

| File | Purpose | When to Use |
|------|---------|-------------|
| **MIGRATION-GUIDE.md** | 📖 Complete step-by-step guide | Read first - your main documentation |
| **QUICK-REFERENCE.md** | ⚡ Command cheat sheet | Quick lookup during migration |
| **package.json** | 📦 Node.js dependencies | Auto-installs required packages |
| **create-blog-categories.js** | 🏷️ Creates 26 categories | Run first (before posts) |
| **migrate-blog-posts.js** | 🚀 Main migration script | Migrates posts with Markdown conversion |
| **category-mapping.js** | 🗺️ Category ID mapping template | Configure WordPress→Strapi categories |
| **README.md** | 📋 This file | Package overview |

---

## 🎯 Quick Start (3 Steps)

### Step 1: Setup (5 minutes)
```bash
# Create migration directory
mkdir ~/Desktop/blog-migration
cd ~/Desktop/blog-migration

# Copy all files here, then:
npm install
```

### Step 2: Configure (2 minutes)
1. Start Strapi: `cd ~/Desktop/travel2egypt-backend && npm run develop`
2. Get API token: Settings → API Tokens → Create → Copy token
3. Update token in:
   - `create-blog-categories.js` (line 9)
   - `migrate-blog-posts.js` (line 27)

### Step 3: Migrate (10 minutes for test)
```bash
npm run create-categories    # Creates 26 categories
npm run migrate-test        # Migrates 2 posts as test
```

---

## 📚 Documentation Guide

### Start Here: 📖 MIGRATION-GUIDE.md

**Full 10-step walkthrough including:**
- ✅ Dependency installation
- ✅ Strapi API token setup
- ✅ Category creation
- ✅ Test migration (2 posts)
- ✅ Content quality verification
- ✅ Full migration (167 posts)
- ✅ Translation handling
- ✅ Troubleshooting guide

**Read this first if:** This is your first time running the migration

---

### Quick Reference: ⚡ QUICK-REFERENCE.md

**Fast command reference including:**
- ✅ npm commands
- ✅ Configuration snippets
- ✅ Common issues & fixes
- ✅ Quick health checks
- ✅ Progress tracking checklist

**Use this when:** You know what to do but need command syntax

---

## 🛠️ Technical Details

### What the Scripts Do:

**1. create-blog-categories.js**
- Connects to Strapi API
- Creates all 26 blog categories
- Auto-generates slugs from names
- Reports success/failure for each
- Time: ~30 seconds

**2. migrate-blog-posts.js**
- Fetches posts from WordPress REST API
- Converts Elementor HTML → Clean Markdown
- Handles multi-language content (EN, ES, JA, FI)
- Creates posts in Strapi
- Calculates read time
- Preserves metadata (title, slug, date, excerpt)
- Test mode: 2 posts (~1 min)
- Full mode: 167 posts (~20 min)

**3. category-mapping.js**
- Template for mapping WordPress category IDs
- Includes integration instructions
- Helper commands to fetch WordPress categories
- Needs customization with your actual IDs

---

## ✨ Key Features

### HTML to Markdown Conversion
- ✅ Removes Elementor wrapper divs
- ✅ Cleans inline styles
- ✅ Preserves headings (H2, H3)
- ✅ Keeps links intact
- ✅ Converts images to Markdown syntax
- ✅ Removes HTML comments
- ✅ Strips script/style tags

### Content Preserved
- ✅ Title
- ✅ Slug (SEO-friendly URL)
- ✅ Publication date
- ✅ Excerpt (summary)
- ✅ Full content (Markdown)
- ✅ Read time (auto-calculated)
- ✅ Language/locale

### Not Included (Manual Work)
- ⏳ Featured images (you'll add manually)
- ⏳ Category assignments (needs mapping first)
- ⏳ Tags (can be added later)
- ⏳ SEO meta fields (if needed)
- ⏳ Translations (requires additional work)

---

## 📊 Migration Statistics

### Source: WordPress
- English: 167 posts (master)
- Spanish: 143 posts
- Japanese: 127 posts
- Finnish: 61 posts
- **Total:** 498 posts

### Target: Strapi
- Master entries: 167 (English)
- With translations: Up to 167 × 4 languages
- Categories: 26
- Format: Markdown

### Expected Time
- Setup: 10 minutes
- Category creation: 30 seconds
- Test migration (2 posts): 1-2 minutes
- Full migration (167 posts): 15-30 minutes
- Manual images: 1-2 hours (your pace)
- Translations: TBD (manual or script)

---

## 🎯 Migration Workflow

```
┌─────────────────────────────────────────────────────┐
│  Phase 1: SETUP (10 min)                            │
│  ├─ Install Node.js dependencies                    │
│  ├─ Start Strapi backend                            │
│  ├─ Get API token                                   │
│  └─ Configure scripts                               │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Phase 2: CATEGORIES (30 sec)                       │
│  ├─ Run: npm run create-categories                  │
│  ├─ Verify: 26 categories created                   │
│  └─ Check Strapi admin panel                        │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Phase 3: TEST MIGRATION (2 min)                    │
│  ├─ Run: npm run migrate-test                       │
│  ├─ Verify: 2 posts created                         │
│  ├─ Check content quality                           │
│  └─ Review Markdown conversion                      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Phase 4: FULL MIGRATION (20 min)                   │
│  ├─ Update config: test.enabled = false             │
│  ├─ Run: npm run migrate-full                       │
│  ├─ Monitor progress                                │
│  └─ Verify: 167 posts created                       │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Phase 5: MANUAL WORK (variable time)               │
│  ├─ Add featured images                             │
│  ├─ Complete category mapping                       │
│  ├─ Handle translations                             │
│  └─ Test frontend integration                       │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Prerequisites

### System Requirements
- ✅ Node.js 18+ installed
- ✅ Strapi 4 backend running
- ✅ Internet connection (to fetch from WordPress)
- ✅ ~500MB free disk space

### Strapi Setup
- ✅ Blog content type created (from handover doc)
- ✅ Blog Category content type created
- ✅ i18n plugin enabled
- ✅ API tokens available
- ✅ Public API permissions configured

### Access Needed
- ✅ WordPress REST API: https://travel2egypt.org/wp-json/wp/v2/posts
- ✅ Strapi API: http://localhost:1337/api
- ✅ Strapi Admin: http://localhost:1337/admin

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "401 Unauthorized"
- Check API token in scripts
- Verify token permissions in Strapi

### "Connection refused"
```bash
# Start Strapi
cd ~/Desktop/travel2egypt-backend
npm run develop
```

### Content looks weird
- Check Markdown conversion settings
- Review turndown rules in script
- May need to adjust HTML cleaning

### Need more help?
- See **MIGRATION-GUIDE.md** → Troubleshooting section
- Check Strapi logs for detailed errors
- Verify WordPress API is accessible

---

## 📈 Success Criteria

Your migration is complete when:

- ✅ All 26 categories exist in Strapi
- ✅ 167 English blog posts migrated
- ✅ Content is clean Markdown (no HTML tags)
- ✅ Slugs are correct and SEO-friendly
- ✅ Publication dates preserved
- ✅ No duplicate posts
- ✅ Read time calculated for each post
- ✅ Posts visible in Strapi admin
- ✅ API returns posts correctly

---

## 🚀 Next Steps After Migration

1. **Add Featured Images**
   - Go through posts in Strapi admin
   - Upload featured images manually

2. **Complete Category Mapping**
   - Fetch WordPress category IDs
   - Update category-mapping.js
   - Re-integrate into migration script

3. **Handle Translations**
   - Decide: Manual vs. scripted approach
   - Link translations to master posts

4. **Update Frontend**
   - Modify Next.js to fetch from Strapi
   - Update internal links
   - Test all pages

5. **Deploy**
   - Push Strapi to production
   - Migrate data to production Strapi
   - Update frontend API endpoints

---

## 📞 Support

If you encounter issues:

1. **Check Logs**
   - Strapi terminal output
   - Browser console (admin panel)
   - Script output in terminal

2. **Verify Basics**
   - Strapi is running
   - API token is valid
   - Internet connection works
   - WordPress API is accessible

3. **Test Manually**
   - Try creating a post in Strapi admin
   - Test API endpoint with curl
   - Check WordPress API response

4. **Review Documentation**
   - MIGRATION-GUIDE.md (comprehensive)
   - QUICK-REFERENCE.md (commands)
   - Strapi docs: https://docs.strapi.io/

---

## 🎉 You're Ready!

Everything you need is in this package:
- ✅ Complete documentation
- ✅ Working migration scripts
- ✅ Category creation tool
- ✅ Quick reference guide
- ✅ Configuration templates

**Start with:** Opening `MIGRATION-GUIDE.md` and following Step 1

**Questions?** Check `QUICK-REFERENCE.md` for command syntax

**Good luck with your migration!** 🚀

---

## 📝 Version History

**v1.0** - November 21, 2025
- Initial release
- 26 categories support
- HTML to Markdown conversion
- Test mode (2 posts)
- Full migration (167 posts)
- Multi-language structure (i18n ready)

---

**Package Created By:** Claude (AI Assistant)  
**For:** Travel2Egypt - Strapi Migration Project  
**Project Status:** Backend Setup Complete ✅ | Content Migration In Progress ⏳  
**Next Phase:** Category mapping completion → Full migration → Translations
