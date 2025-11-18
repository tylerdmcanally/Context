# Deployment Guide

This guide covers deploying the Context application to Firebase and Vercel.

## Prerequisites

1. Firebase account with a project created
2. Vercel account
3. Stripe account (for payments)
4. All API keys ready:
   - Firebase configuration
   - Anthropic API key
   - OpenAI API key
   - Stripe keys
   - Resend API key (optional)

## Step 1: Firebase Setup

### 1.1 Initialize Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select:
- Firestore
- Functions (TypeScript)
- Storage
- Do NOT select Hosting (using Vercel)

### 1.2 Configure Environment Variables

Create `functions/.env`:

```bash
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
EDITOR_EMAIL=your-email@example.com
```

### 1.3 Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 1.4 Deploy Storage Rules

```bash
firebase deploy --only storage:rules
```

### 1.5 Build and Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

## Step 2: Vercel Setup

### 2.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 2.2 Deploy to Vercel

```bash
vercel
```

Follow the prompts to:
1. Link to existing project or create new
2. Set up project settings
3. Add environment variables

### 2.3 Environment Variables in Vercel

Add all environment variables from `.env.example` in the Vercel dashboard:

**Firebase Client (Public):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Firebase Admin (Server-side):**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

**External APIs:**
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PREMIUM_PRICE_ID` (create in Stripe dashboard first)
- `RESEND_API_KEY` (optional)

**App Config:**
- `NEXT_PUBLIC_APP_URL` (your Vercel URL)
- `EDITOR_EMAIL`

## Step 3: Stripe Setup

### 3.1 Create Product and Price

1. Go to Stripe Dashboard → Products
2. Create a new product: "Context Premium"
3. Create a recurring monthly price: $4.99
4. Copy the Price ID (starts with `price_`)
5. Add to Vercel as `STRIPE_PREMIUM_PRICE_ID`

### 3.2 Configure Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Step 4: Firebase Admin Setup

### 4.1 Generate Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download JSON file
4. Extract values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep `\n` as literal)

## Step 5: Testing

### 5.1 Test RSS Aggregation

Visit: `https://your-domain.vercel.app/api/test-rss`

Should return aggregated articles.

### 5.2 Test Candidate Generation

```bash
curl -X POST https://your-domain.vercel.app/api/generate-candidates
```

### 5.3 Test Authentication

1. Sign up a new user
2. Verify user document created in Firestore
3. Test login/logout

### 5.4 Test Subscription Flow

1. Go to `/pricing`
2. Click "Upgrade to Premium"
3. Complete Stripe checkout
4. Verify webhook updates user subscription

### 5.5 Test Editor Workflow

1. Set user role to 'editor' in Firestore
2. Visit `/editor`
3. Select a candidate
4. Review and publish story

## Step 6: Scheduled Functions

Cloud Functions run automatically:
- **4:00 AM & 6:00 AM EST**: News aggregation
- **6:30 AM EST**: Candidate generation
- **8:50 AM EST**: Auto-select (if no manual selection)

Monitor in Firebase Console → Functions → Logs

## Troubleshooting

### Functions Not Running

- Check Firebase Console → Functions → Logs
- Verify environment variables are set
- Check function permissions

### Stripe Webhook Not Working

- Verify webhook URL is correct
- Check webhook secret matches
- View webhook events in Stripe dashboard

### Authentication Issues

- Verify Firebase Auth is enabled
- Check Firestore security rules
- Ensure CORS is configured

### RSS Feeds Not Loading

- Some feeds may block server requests
- Consider using a proxy service
- Check feed URLs are accessible

## Monitoring

- **Firebase Console**: Function logs, Firestore usage
- **Vercel Dashboard**: Build logs, deployment status
- **Stripe Dashboard**: Subscription metrics, webhook events

## Cost Optimization

- Firebase Spark Plan (free tier) limits:
  - 50K reads/day
  - 20K writes/day
  - 1GB storage
- Vercel Hobby Plan (free tier) limits:
  - 100GB bandwidth/month
- Monitor usage in Firebase Console

## Next Steps

1. Set up custom domain in Vercel
2. Configure email notifications with Resend
3. Set up monitoring/alerting
4. Create backup strategy for Firestore
5. Set up CI/CD pipeline

