#!/bin/bash

# Script to commit and push changes to git

set -e  # Exit on error

echo "📦 Checking git status..."
cd /Users/tylermcanally/Desktop/Context
git status

echo ""
echo "📝 Staging all changes..."
git add -A

echo ""
echo "💾 Committing changes..."
git commit -m "Improve profile UI and fix settings page loading

- Added avatar circle with user initial in header
- Improved profile section visibility
- Fixed settings page loading issues
- Updated ProtectedRoute component
- Updated Loading component for dark theme"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📊 Final status:"
git status

