# Setup Checklist - Context App

## 🔴 Critical (Do First - Required for App to Work)

### 1. Vercel Environment Variables
**Why:** Production needs all API keys and config
**Steps:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add ALL variables from `.env.local`:
   - **Firebase Client:** `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
   - **Firebase Admin:** `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - **APIs:** `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`
   - **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` (get from step 3)
   - **App Config:** `NEXT_PUBLIC_APP_URL` (already set: `https://context-i4rmyfqny-tyler-mcanallys-projects.vercel.app`), `EDITOR_EMAIL`
3. Set scope: **Production** (and Preview if you want)
4. Redeploy after adding variables

### 2. Firebase Cloud Functions Environment Variables
**Why:** Scheduled functions need API keys to run
**Steps:**
```bash
cd functions
firebase functions:config:set anthropic.api_key="<YOUR_ANTHROPIC_API_KEY>"
firebase functions:config:set openai.api_key="<YOUR_OPENAI_API_KEY>"
firebase functions:config:set editor.email="tylerdmcanally@gmail.com"
```

### 3. Deploy Firebase Cloud Functions
**Why:** Scheduled tasks won't run without deployment
**Steps:**
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```
**Verify:** Check Firebase Console → Functions to see:
- `newsAggregation` (runs 4am & 6am EST)
- `candidateGeneration` (runs 6:30am EST)
- `autoSelect` (runs 8:50am EST)

### 4. Set Editor Role in Firestore
**Why:** Editor dashboard requires `role: 'editor'`
**Steps:**
1. Go to Firebase Console → Firestore Database
2. Open `users` collection
3. Find your user document (by email: `tylerdmcanally@gmail.com`)
4. Add field: `role` = `"editor"`
5. Save

### 5. Stripe Webhook Setup
**Why:** Subscription updates won't work without webhook
**Steps:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://context-i4rmyfqny-tyler-mcanallys-projects.vercel.app/api/stripe/webhook`
4. **Events to listen for:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`
8. Add to Vercel Dashboard → Environment Variables

### 6. Upgrade Firebase Plan (if needed)
**Why:** Scheduled functions require Blaze plan
**Steps:**
1. Go to Firebase Console → Project Settings → Plan
2. If on Spark (free), upgrade to Blaze (pay-as-you-go)
3. Note: You only pay for what you use (likely $0-5/month for this app)

---

## 🟡 Important (Do Soon - For Full Functionality)

### 7. Test Login Flow
**Steps:**
1. Go to your Vercel URL
2. Sign up with a test account
3. Verify you can log in
4. Check header shows your profile
5. Verify you can access `/settings`

### 8. Test Editor Dashboard
**Steps:**
1. After setting `role: 'editor'` (step 4)
2. Log in and go to `/editor`
3. Should see today's candidates (or empty if none generated yet)
4. Can manually trigger candidate generation via API if needed

### 9. Test Premium Subscription (Stripe Test Mode)
**Steps:**
1. Log in to your app
2. Go to `/pricing`
3. Click "Upgrade to Premium"
4. Use test card: `4242 4242 4242 4242`
5. Expiry: `12/34`, CVC: `123`, ZIP: `12345`
6. Complete checkout
7. Verify redirects to `/settings`
8. Check Firestore - user should have `subscriptionTier: "premium"`
9. Test premium features (audio, bookmarks, archive)

### 10. Verify Scheduled Functions Run
**Steps:**
1. Wait for scheduled time OR manually trigger:
   ```bash
   firebase functions:shell
   # Then call: newsAggregation()
   ```
2. Check Firebase Console → Functions → Logs
3. Verify no errors

---

## 🟢 Optional (Nice to Have)

### 11. Set Up Stripe CLI for Local Webhook Testing
**Why:** Test webhooks locally before deploying
**Steps:**
```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook secret it gives you
```

### 12. Add Error Monitoring
**Why:** Catch production errors
**Options:** Sentry, LogRocket, or similar
**Action:** Sign up and add to Next.js app

### 13. Set Up Custom Domain (Optional)
**Why:** Better branding
**Steps:**
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records
4. Update `NEXT_PUBLIC_APP_URL` if changed

---

## Quick Verification Checklist

After setup, verify:

- [ ] Can log in and see profile in header
- [ ] Can access `/settings` page
- [ ] Can access `/editor` dashboard (after setting role)
- [ ] Stripe checkout works with test card
- [ ] Premium features unlock after checkout
- [ ] Webhook updates subscription tier automatically
- [ ] Cloud Functions are deployed and visible in Firebase Console
- [ ] Scheduled functions run (check logs)

---

## Current Status

✅ **Already Done:**
- App URL configured
- Stripe test mode active
- Code is deployed-ready

⏳ **Waiting on You:**
- Environment variables in Vercel
- Cloud Functions deployment
- Editor role assignment
- Stripe webhook configuration

---

## Need Help?

- **Stripe Testing:** See `STRIPE_TEST_MODE.md`
- **Full Audit:** See `AUDIT_REPORT.md`

---

**Priority Order:**
1. Vercel env vars (5 min)
2. Cloud Functions env vars + deploy (10 min)
3. Editor role (2 min)
4. Stripe webhook (5 min)
5. Test everything (15 min)

**Total Time:** ~40 minutes to get fully set up
