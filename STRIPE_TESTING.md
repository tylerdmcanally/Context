# Stripe Testing Guide

## Test Mode Setup

The app is configured to use **Stripe Test Mode**, which means:
- ✅ No real charges are made
- ✅ No real credit cards needed
- ✅ Full premium functionality can be tested
- ✅ Webhooks work with test events

## Test Card Numbers

Use these test card numbers in Stripe Checkout:

### Successful Payment
- **Card:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

### Other Test Cards
- **Declined Card:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`
- **Insufficient Funds:** `4000 0000 0000 9995`

See full list: https://stripe.com/docs/testing

## Testing Premium Features

### Step 1: Test Checkout Flow

1. Log in to your app
2. Go to `/pricing` page
3. Click "Upgrade to Premium"
4. Use test card `4242 4242 4242 4242`
5. Complete checkout
6. You'll be redirected back to `/settings`

### Step 2: Verify Premium Access

After successful checkout:
- Check Firestore `users` collection
- Your user document should have:
  - `subscriptionTier: "premium"`
  - `stripeCustomerId: "cus_..."`
  - `subscriptionEndsAt: [future date]`

### Step 3: Test Premium Features

With premium access, you should be able to:
- ✅ Access stories on all days (not just M/W/F)
- ✅ Listen to audio narration
- ✅ Bookmark stories
- ✅ Access full archive

### Step 4: Test Subscription Management

1. Go to `/settings`
2. Click "Manage Subscription"
3. This opens Stripe Billing Portal (test mode)
4. You can:
   - Cancel subscription
   - Update payment method
   - View invoices

## Webhook Testing

### Option 1: Stripe CLI (Recommended)

Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

Login:
```bash
stripe login
```

Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook signing secret. Add it to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Option 2: Stripe Dashboard Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://context-i4rmyfqny-tyler-mcanallys-projects.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook signing secret to `.env.local` and Vercel

### Option 3: Manual Webhook Testing

In Stripe Dashboard → Developers → Webhooks:
1. Find your webhook endpoint
2. Click "Send test webhook"
3. Select event type (e.g., `checkout.session.completed`)
4. Send test event
5. Check Firestore to verify user was updated

## Testing Subscription Cancellation

1. Complete checkout with test card
2. Go to Settings → Manage Subscription
3. Cancel subscription in Stripe portal
4. Check Firestore - user should have `subscriptionTier: "free"`

## Important Notes

- **Test Mode Only:** All API keys start with `sk_test_` and `pk_test_`
- **No Real Charges:** Test cards never charge real money
- **Test Data:** Test customers/subscriptions are separate from live data
- **Webhook Secret:** Must match between Stripe Dashboard and your `.env.local`

## Switching to Live Mode

When ready for production:

1. Get live API keys from Stripe Dashboard
2. Update `.env.local` with `sk_live_...` and `pk_live_...` keys
3. Create live webhook endpoint
4. Update price ID if needed
5. Test with real card (small amount) before going live

## Troubleshooting

**Checkout doesn't work:**
- Verify `STRIPE_SECRET_KEY` is set in `.env.local`
- Check browser console for errors
- Verify `NEXT_PUBLIC_APP_URL` is correct

**Webhook doesn't update user:**
- Verify `STRIPE_WEBHOOK_SECRET` is set
- Check webhook endpoint URL is correct
- Verify webhook events are selected in Stripe Dashboard
- Check Vercel function logs for errors

**Premium features still locked:**
- Check Firestore user document has `subscriptionTier: "premium"`
- Verify webhook completed successfully
- Try refreshing the page

