#!/bin/bash
# Run this script once to create your .env.local file
# Usage: bash setup.sh

echo ""
echo "═══════════════════════════════════════"
echo "  Waren Portfolio — Setup"
echo "═══════════════════════════════════════"
echo ""

read -p "Paste your NEW Airtable API key (starts with pat): " API_KEY
read -p "Paste your Airtable Base ID (starts with app): " BASE_ID

cat > .env.local << ENVEOF
# Airtable credentials — DO NOT commit this file to git
AIRTABLE_API_KEY=${API_KEY}
AIRTABLE_BASE_ID=${BASE_ID}
ENVEOF

echo ""
echo "✓ .env.local created successfully"
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm run dev"
echo "  3. Open http://localhost:3000"
echo ""
