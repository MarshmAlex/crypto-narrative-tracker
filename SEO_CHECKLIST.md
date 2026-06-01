# SEO Checklist — Crypto Narrative Tracker

> Last updated: 2026-06-01

## ✅ On-Page SEO (TASK-007 — DONE)

- [x] **Title tag** optimized: "Crypto Narrative Tracker — Trending Crypto Narratives & Market Sentiment | GeniBiz"
- [x] **Meta description** includes all 3 target keywords: "crypto narrative tracker", "trending crypto narratives", "crypto market sentiment"
- [x] **Meta keywords** tag with 10 relevant keywords
- [x] **H1** contains primary keyword "Crypto Narrative Tracker" + secondary keywords
- [x] **H2s** optimized: "How Our Crypto Narrative Tracker Works", "Trending Crypto Narratives — Live Momentum Board", "Frequently Asked Questions About Crypto Narratives"
- [x] **Keyword density** — target keywords naturally distributed in body, headings, footer
- [x] **Open Graph** tags (title, description, siteName, locale, type)
- [x] **Twitter Card** (summary_large_image) with keyword-rich title/description
- [x] **Canonical URL** set to https://genibiz.com
- [x] **FAQ Schema markup** (FAQPage JSON-LD) with 5 keyword-rich Q&As
- [x] **WebSite Schema** (JSON-LD) with SearchAction in layout.tsx
- [x] **Robots meta** — index, follow, max-snippet:-1, max-image-preview:large
- [x] **lang="en"** on html tag

## ✅ Technical SEO (TASK-009 — DONE)

- [x] **sitemap.xml** — Dynamic via Next.js `src/app/sitemap.ts` (auto-generates /sitemap.xml)
- [x] **robots.txt** — Dynamic via Next.js `src/app/robots.ts` (allows /, disallows /api/ and /_next/)
- [x] **Old static robots.txt** in `src/robots.txt` — can be removed after verifying dynamic one works
- [x] **Google verification meta tag** — Placeholder in layout.tsx `verification.google` — replace with actual code

## 📋 Google Search Console Submission Steps

### Prerequisites
1. Deploy the site to https://genibiz.com (Vercel or other)
2. Ensure DNS is correctly configured

### Step-by-Step
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add property"** → choose **URL prefix** → enter `https://genibiz.com`
3. **Verification method** (choose one):
   - **HTML meta tag** (recommended): Copy the verification code, replace `GOOGLE_SITE_VERIFICATION_CODE` in `frontend/src/app/layout.tsx` → redeploy
   - **DNS TXT record**: Add the provided TXT record to your domain's DNS
   - **HTML file upload**: Download the verification file → place in `frontend/public/` → redeploy
4. Click **Verify**
5. Once verified, go to **Sitemaps** in the left sidebar
6. Enter `sitemap.xml` → click **Submit**
7. Wait 24-48h for initial indexing

### Post-Submission Checks
- [ ] Verify sitemap.xml is accessible at https://genibiz.com/sitemap.xml
- [ ] Verify robots.txt is accessible at https://genibiz.com/robots.txt
- [ ] Check "Coverage" tab for any crawl errors
- [ ] Check "Mobile Usability" — should be 100% (Next.js + Tailwind responsive)
- [ ] Submit URL for inspection: https://genibiz.com
- [ ] Monitor "Performance" tab after 1 week for impressions on target keywords

## 🎯 Target Keywords
| Keyword | Monthly Volume (est.) | Difficulty | Status |
|---|---|---|---|
| crypto narrative tracker | Low-Med | Low | ✅ In title, H1, H2, body |
| trending crypto narratives | Med | Med | ✅ In title, H1, H2, body |
| crypto market sentiment | High | High | ✅ In title, H1, H2, body |

## 🔜 Next Steps
- [ ] Generate and add OG image (1200x630) to layout metadata
- [ ] Add `/blog/` section for long-tail SEO (TASK-008)
- [ ] Build backlinks from crypto directories
- [ ] Set up Google Analytics / Plausible
- [ ] Monitor rankings weekly after indexing
