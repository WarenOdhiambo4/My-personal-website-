# Waren Odhiambo — Portfolio Deployment Guide

## Step 1 — Set up Airtable 


Follow the Setup tab inside that file
Create all 6 tables with exact field names
Add Site Config records (profile image URL, Calendly URL, etc.)
Copy your `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`

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

## How to update content 

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

