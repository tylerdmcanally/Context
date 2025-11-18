#!/bin/bash

echo "🔧 Fixing Git push - removing secrets from commit..."

# Remove vercel-env-vars.txt from git tracking
git rm --cached vercel-env-vars.txt 2>/dev/null || echo "File already removed from cache"

# Add updated .gitignore
git add .gitignore

# Amend the commit to remove the secrets file
git commit --amend --no-edit

echo ""
echo "✅ Commit amended - secrets removed"
echo ""
echo "Now pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ Push complete!"

