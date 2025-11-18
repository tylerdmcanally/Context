# Vercel Environment Variables Checklist

Based on your `.env.local`, here are ALL variables that should be in Vercel:

## Required Variables (18 total)

### Firebase Client (Public) - 6 variables
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` = `<YOUR_FIREBASE_API_KEY>`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `<your-project>.firebaseapp.com`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `<your-project-id>`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `<your-project>.appspot.com`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `<sender-id>`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` = `<firebase-app-id>`

### Firebase Admin (Server-side) - 3 variables
- [ ] `FIREBASE_PROJECT_ID` = `<your-project-id>`
- [ ] `FIREBASE_CLIENT_EMAIL` = `<service-account-email>`
- [ ] `FIREBASE_PRIVATE_KEY` = `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`

### External APIs - 3 variables
- [ ] `ANTHROPIC_API_KEY` = `<YOUR_ANTHROPIC_API_KEY>`
- [ ] `OPENAI_API_KEY` = `<YOUR_OPENAI_API_KEY>`
- [ ] `RESEND_API_KEY` = `<YOUR_RESEND_API_KEY>`

### Stripe (Test Mode) - 4 variables
- [ ] `STRIPE_SECRET_KEY` = `<YOUR_STRIPE_SECRET_KEY>`
- [ ] `STRIPE_PUBLISHABLE_KEY` = `<YOUR_STRIPE_PUBLISHABLE_KEY>`
- [ ] `STRIPE_WEBHOOK_SECRET` = `[Get from Stripe Dashboard after setting up webhook]`
- [ ] `STRIPE_PREMIUM_PRICE_ID` = `<YOUR_STRIPE_PRICE_ID>`

### App Config - 2 variables
- [ ] `NEXT_PUBLIC_APP_URL` = `<https://your-vercel-url>`
- [ ] `EDITOR_EMAIL` = `tylerdmcanally@gmail.com`

---

## How to Check in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your **Context** project
3. Go to **Settings** → **Environment Variables**
4. Check each variable above

## Quick Verification

**Critical variables that MUST be set:**
- All `NEXT_PUBLIC_*` variables (for client-side)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (for server-side)
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` (for AI features)
- `STRIPE_SECRET_KEY` (for payments)
- `NEXT_PUBLIC_APP_URL` (for redirects)

**Note:** `STRIPE_WEBHOOK_SECRET` can be empty initially, but you'll need it after setting up the webhook.

---

## If Variables Are Missing

You can add them via:
1. **Vercel Dashboard** (recommended) - Settings → Environment Variables → Add
2. **Vercel CLI:**
   ```bash
   vercel env add VARIABLE_NAME production
   # Then paste the value when prompted
   ```
