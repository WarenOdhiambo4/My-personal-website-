# Waren Odhiambo — Portfolio Deployment Guide

## Folder structure

```
waren-portfolio/
├── pages/
│   ├── _app.js          — Global styles wrapper
│   ├── index.js         — Home page (fetches Airtable at build time)
│   └── api/
│       └── lead.js      — API route: form submissions → Airtable Leads table
├── components/
│   ├── Nav.js           — Sticky navigation
│   ├── Hero.js          — Headline, pipeline stages, profile photo from Airtable
│   ├── Process.js       — Structure → Automate → Illuminate section
│   ├── CaseStudies.js   — Paroha proof card + Airtable-driven case studies
│   ├── About.js         — Full about copy + credential stack
│   ├── Testimonials.js  — Airtable-driven testimonials
│   ├── CTA.js           — Book call + inquiry form → Airtable Leads
│   └── Footer.js
├── lib/
│   └── airtable.js      — All Airtable API calls
├── styles/
│   └── globals.css      — Design tokens, fonts
├── .env.local.example   — Copy to .env.local and fill in your keys
├── AIRTABLE_SCHEMA.html — Complete Airtable database specification
├── next.config.js
├── vercel.json
└── netlify.toml
```

---

## Step 1 — Set up Airtable (do this first)

1. Open `AIRTABLE_SCHEMA.html` in your browser
2. Follow the Setup tab inside that file
3. Create all 6 tables with exact field names
4. Add Site Config records (profile image URL, Calendly URL, etc.)
5. Copy your `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`

---

## Step 2 — Local setup

```bash
# 1. Install Node.js (v18+) if not already installed
# 2. Run:
npm install

# 3. Create your environment file
cp .env.local.example .env.local
# Open .env.local and paste your Airtable credentials

# 4. Start local development server
npm run dev
# Open http://localhost:3000
```

---

## Step 3A — Deploy to Vercel (recommended, free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# When prompted:
# - Link to existing project? No
# - Project name: waren-odhiambo-portfolio
# - Directory: ./
# - Override settings: No

# Add environment variables:
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID

# Redeploy with env vars:
vercel --prod
```

**Or via Vercel dashboard:**
1. Go to vercel.com → New Project → Import from GitHub
2. Connect your GitHub repo (push this folder first)
3. Settings → Environment Variables → add both keys
4. Deploy

---

## Step 3B — Deploy to Netlify (alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build first
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

**Via Netlify dashboard:**
1. netlify.com → New site → Import from Git
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Environment variables: add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`
5. Deploy

---

## How to update content (no code)

| What you want to change | Where to do it |
|---|---|
| Profile photo | Airtable → Site Config → profile_image_url → paste new Cloudinary URL |
| Availability status | Airtable → Site Config → availability |
| Calendly link | Airtable → Site Config → calendly_url |
| Add a case study | Airtable → Case Studies → new record → check "published" |
| View new leads | Airtable → Leads → Action Required Today view |
| Add a testimonial | Airtable → Testimonials → new record → check permission_granted |

---

## How to update profile photo

1. Go to cloudinary.com (create free account if needed)
2. Upload your new photo
3. Copy the URL
4. Open Airtable → Site Config → find `profile_image_url` → paste new URL → save
5. Portfolio updates on next page load. No code. No deployment.

---

## Admin workflow (no code required)

**New project delivered → 3 actions:**
1. Airtable → Projects → update status to "Delivered"
2. Airtable → Case Studies → create new record with outcome metric → check "published"
3. Airtable → Testimonials → add quote when received → check "permission_granted"

**Daily lead review:**
1. Airtable → Leads → "Action Required Today" view
2. Message or call each person on that list
3. Update their status and set next follow_up_date

**Weekly content:**
1. Airtable → Content Planner → "Ready to Post" view
2. Copy the post_body → paste to LinkedIn
3. Update status to "Published" → paste LinkedIn URL back in

---

## Domain setup (after Vercel/Netlify deployment)

1. Buy domain: warenodhiambo.com (or .co.ke for KES ~800/yr)
2. Vercel: Settings → Domains → add your domain → follow DNS instructions
3. Netlify: Site settings → Domain management → add custom domain

---

## Troubleshooting

**Portfolio shows empty / no data:**
- Check `.env.local` exists and has correct keys
- Verify Airtable base has the exact table names (case-sensitive)
- Check Airtable API token has read + write scopes

**Lead form not submitting:**
- Check `pages/api/lead.js` is present
- Verify AIRTABLE_BASE_ID is correct
- Check Leads table has exact field names: name, email, business, problem_description, source, status

**Profile image not showing:**
- Verify the Cloudinary URL is publicly accessible (open it in browser)
- Check Site Config table has a record with config_key = "profile_image_url"
