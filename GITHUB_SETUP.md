# GitHub Setup & Vercel Auto-Deploy

## Step 1: Push to GitHub

Run these commands in your terminal:

```bash
cd /Users/tylermcanally/Desktop/Context

# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/tylerdmcanally/Context.git
# Or if remote exists:
git remote set-url origin https://github.com/tylerdmcanally/Context.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Context daily news digest app"

# Push to main branch
git branch -M main
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or use SSH: `git remote set-url origin git@github.com:tylerdmcanally/Context.git`

## Step 2: Connect Vercel to GitHub

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your **Context** project
3. Go to **Settings** → **Git**
4. Click **Connect Git Repository**
5. Select **GitHub** and authorize if needed
6. Choose repository: **tylerdmcanally/Context**
7. Select branch: **main**
8. Click **Connect**

## Step 3: Configure Auto-Deploy

After connecting:
- **Production Branch**: `main` (auto-deploys on push)
- **Preview Deployments**: Enabled (creates preview for PRs)
- **Automatic Deployments**: Enabled

## Step 4: Verify

1. Make a small change to any file
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. Check Vercel Dashboard - you should see a new deployment start automatically!

## Important Notes

- `.env.local` is in `.gitignore` - environment variables stay in Vercel Dashboard only
- `functions/` directory is included but deploys separately via Firebase
- All sensitive keys are excluded from Git

