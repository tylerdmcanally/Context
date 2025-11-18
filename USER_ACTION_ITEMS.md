# User Action Items - Quick Reference

## 🔴 Critical (Do First)

### 1. Set Stripe Webhook Secret
**Why:** Webhook signature verification will fail without this
**Steps:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://context-i4rmyfqny-tyler-mcanallys-projects.vercel.app/api/stripe/webhook`
4. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy the "Signing secret" (starts with `whsec_`)
6. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`
7. Add to Vercel Dashboard → Settings → Environment Variables

### 2. Configure Cloud Functions Environment
**Why:** Functions need API keys to run
**Steps:**
```bash
cd functions
firebase functions:config:set anthropic.api_key="<YOUR_ANTHROPIC_API_KEY>"
firebase functions:config:set openai.api_key="<YOUR_OPENAI_API_KEY>"
firebase functions:config:set editor.email="tylerdmcanally@gmail.com"
```

### 3. Deploy Cloud Functions
**Why:** Scheduled tasks won't run if not deployed
**Steps:**
```bash
cd functions
npm run build
firebase deploy --only functions
```
**Verify:** Check Firebase Console → Functions to see all 3 scheduled functions

### 4. Set Editor Role in Firestore
**Why:** Editor dashboard requires `role: 'editor'`
**Steps:**
1. Go to Firebase Console → Firestore Database
2. Open `users` collection
3. Find your user document (by email)
4. Add field: `role` = `"editor"`
5. Save

### 5. Verify Vercel Environment Variables
**Why:** Production needs all env vars
**Steps:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all variables from `.env.local` are present:
   - All `NEXT_PUBLIC_FIREBASE_*` vars
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `EDITOR_EMAIL`

### 6. Upgrade Firebase Plan (if needed)
**Why:** Scheduled functions require Blaze plan
**Steps:**
1. Go to Firebase Console → Project Settings → Plan
2. If on Spark (free), upgrade to Blaze (pay-as-you-go)
3. Note: You'll only pay for what you use

---

## 🟡 Important (Do Soon)

### 7. Implement Story Save in Editor
**Location:** `src/app/editor/review/page.tsx` line 47
**Current:** Empty function
**Action:** Add API route or Firestore update to save story edits

### 8. Add Server-Side API Auth
**Why:** Currently only client-side checks
**Action:** Add Firebase Admin Auth verification to API routes (see `api-helpers.ts`)

### 9. Implement Email Notifications
**Location:** `functions/src/utils/notifications.ts`
**Current:** Stub implementation
**Action:** Integrate Resend API using `RESEND_API_KEY`

---

## 🟢 Optional (Nice to Have)

### 10. Add Rate Limiting
**Why:** Prevent API abuse
**Action:** Use Vercel Edge Config + Upstash or similar

### 11. Add Error Monitoring
**Why:** Catch production errors
**Action:** Integrate Sentry or similar service

### 12. Add Unit Tests
**Why:** Ensure code quality
**Action:** Add Jest/Vitest tests for critical functions

---

## Quick Test Checklist

After completing critical items, test:

- [ ] Login works and profile shows in header
- [ ] Can access `/editor` dashboard
- [ ] Can generate candidates (manual API call or wait for scheduled)
- [ ] Can select candidate and generate story
- [ ] Can publish story and see on home page
- [ ] Can generate audio
- [ ] Stripe checkout works and redirects correctly
- [ ] Stripe webhook updates subscription (test with Stripe CLI)
- [ ] Reading progress saves
- [ ] Bookmarks work (premium feature)

---

## Need Help?

See `AUDIT_REPORT.md` for detailed explanations of each issue.
