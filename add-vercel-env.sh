#!/bin/bash

# Script to add environment variables to Vercel
# Run this after deploying: vercel --prod --yes

echo "Adding environment variables to Vercel..."
echo ""

# Read .env.local and add each variable
while IFS='=' read -r key value; do
  # Skip empty lines and comments
  [[ -z "$key" || "$key" =~ ^#.*$ ]] && continue
  
  # Remove quotes from value if present
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')
  
  echo "Adding $key..."
  vercel env add "$key" production <<< "$value" 2>/dev/null || \
  vercel env add "$key" preview <<< "$value" 2>/dev/null || \
  vercel env add "$key" development <<< "$value" 2>/dev/null || \
  echo "  → Already exists or error adding $key"
done < .env.local

echo ""
echo "✅ Environment variables added!"
echo ""
echo "To verify, run: vercel env ls"

