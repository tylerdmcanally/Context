#!/bin/bash

echo "🚀 Setting up Git and pushing to GitHub..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
fi

# Add remote if not exists
if ! git remote get-url origin &>/dev/null; then
  echo "Adding GitHub remote..."
  git remote add origin https://github.com/tylerdmcanally/Context.git
else
  echo "Updating remote URL..."
  git remote set-url origin https://github.com/tylerdmcanally/Context.git
fi

# Add all files
echo "Adding files..."
git add .

# Commit
echo "Committing changes..."
git commit -m "Initial commit: Context daily news digest app

- Complete Next.js 14 application with TypeScript
- Firebase integration (Firestore, Storage, Auth, Functions)
- RSS news aggregation from 15 sources
- AI-powered story generation with Claude
- OpenAI text-to-speech audio generation
- Stripe subscription management
- Clean black & white design
- Editor workflow for story selection
- Scheduled Cloud Functions for automation"

# Push to main branch
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next: Connect Vercel to GitHub for automatic deployments"
echo "1. Go to Vercel Dashboard → Your Project → Settings → Git"
echo "2. Connect to GitHub repository: tylerdmcanally/Context"
echo "3. Enable automatic deployments on push to main"

