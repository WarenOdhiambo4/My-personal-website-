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
