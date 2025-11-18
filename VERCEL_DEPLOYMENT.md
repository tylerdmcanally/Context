# Vercel Deployment Guide

## Step 1: Login to Vercel

```bash
vercel login
```

## Step 2: Deploy to Vercel

```bash
vercel --prod --yes
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **Project name?** → `context-app` (or your choice)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

## Step 3: Add Environment Variables

After deployment, add all environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all variables from `.env.local`:

### Firebase Client (Public)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Firebase Admin (Server-side)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

### External APIs
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET` (set after getting webhook URL)
- `STRIPE_PREMIUM_PRICE_ID`
- `RESEND_API_KEY`

### App Config
- `NEXT_PUBLIC_APP_URL` (your Vercel URL, e.g., `https://context-app.vercel.app`)
- `EDITOR_EMAIL`

**Important:** Set each variable for **Production**, **Preview**, and **Development** environments.

## Step 4: Set Up Stripe Webhook

1. After deployment, get your Vercel URL
2. Go to Stripe Dashboard → Developers → Webhooks
3. Add endpoint: `https://your-vercel-url.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Step 5: Redeploy

After adding environment variables:

```bash
vercel --prod --yes
```

Or trigger a redeploy from Vercel Dashboard.

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Test RSS aggregation: `https://your-url.vercel.app/api/test-rss`
3. Test signup/login
4. Test subscription flow

## Continuous Deployment

Vercel automatically deploys when you push to your connected Git repository. To connect:

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Connect your GitHub/GitLab/Bitbucket repository
3. Push changes to trigger automatic deployments

## Quick Commands

```bash
# Deploy to production
vercel --prod --yes

# Deploy preview
vercel

# View logs
vercel logs

# List deployments
vercel ls
```

