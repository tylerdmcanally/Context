# Quick Deployment Steps

## Step 1: Login to Vercel (if not already logged in)
```bash
vercel login
```

## Step 2: Deploy to Vercel
```bash
vercel --prod --yes
```

This will:
- Link your project to Vercel
- Build and deploy your Next.js app
- Give you a production URL

## Step 3: Add Environment Variables

After deployment, you have two options:

### Option A: Use the script (easier)
```bash
./add-vercel-env.sh
```

### Option B: Manual via CLI
For each variable in `.env.local`, run:
```bash
vercel env add VARIABLE_NAME production
# Paste the value when prompted
# Repeat for preview and development if needed
```

### Option C: Via Vercel Dashboard (recommended)
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. For each variable from `.env.local`:
   - Name: Variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Value: Variable value
   - Environments: Select Production, Preview, Development
   - Click **Save**

## Step 4: Redeploy
After adding environment variables:
```bash
vercel --prod --yes
```

Or trigger redeploy from Vercel Dashboard.

## Your Environment Variables (from .env.local):

Copy these to Vercel Dashboard:

**Firebase Client:**
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

**Firebase Admin:**
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

**APIs:**
- ANTHROPIC_API_KEY
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_PREMIUM_PRICE_ID
- RESEND_API_KEY

**Config:**
- NEXT_PUBLIC_APP_URL (set this to your Vercel URL after first deploy)
- EDITOR_EMAIL

**Note:** STRIPE_WEBHOOK_SECRET will be added after setting up the Stripe webhook.

