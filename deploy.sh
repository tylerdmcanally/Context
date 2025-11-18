#!/bin/bash

echo "🚀 Deploying Context to Vercel..."
echo ""

# Remove any existing .vercel directory to start fresh
if [ -d ".vercel" ]; then
  echo "Cleaning up existing Vercel config..."
  rm -rf .vercel
fi

# Deploy with explicit project name
echo "Deploying with project name: context-app"
vercel --prod --yes --name context-app

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Add environment variables in Vercel Dashboard"
echo "2. See vercel-env-vars.txt for all variables"
echo "3. Update NEXT_PUBLIC_APP_URL with your Vercel URL"
echo "4. Redeploy: vercel --prod --yes"

