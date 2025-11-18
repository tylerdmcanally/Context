#!/bin/bash

# Usage: ./git-quick-push.sh "commit message"

set -euo pipefail

PROJECT_DIR="/Users/tylermcanally/Desktop/Context"
COMMIT_MESSAGE=${1:-"chore: update"}

cd "$PROJECT_DIR"

echo "📦 Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "Nothing to commit."
  exit 0
fi

echo "💾 Committing: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Pushing to origin/main..."
git push origin main

echo "✅ Done!"

