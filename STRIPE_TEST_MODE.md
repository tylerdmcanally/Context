# Stripe Test Mode Guide

Context always runs in **Stripe test mode** while we are iterating on the product. Use this guide to simulate the entire premium workflow without charging real cards.

## 1. Required Environment Variables

Make sure these values are present locally (`.env.local`) and in Vercel:

- `STRIPE_SECRET_KEY` (starts with `sk_test_`)
- `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
- `STRIPE_PREMIUM_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL` (your local or Vercel URL)

> Tip: see `.env.example` for the full list of required variables.

## 2. Test Card Numbers

Use Stripe’s built-in card numbers to simulate different outcomes:

| Scenario | Card Number | Notes |
| --- | --- | --- |
| Successful checkout | `4242 4242 4242 4242` | Any future expiry, any CVC/ZIP |
| Card declined | `4000 0000 0000 0002` | Shows decline flow |
| 3D Secure required | `4000 0025 0000 3155` | Triggers authentication modal |
| Insufficient funds | `4000 0000 0000 9995` | Shows failure screen |

See <https://stripe.com/docs/testing> for additional cases.

## 3. Testing the Premium Flow

1. Sign up or log in at `http://localhost:3000`.
2. Visit `/pricing` and click **Upgrade to Premium**.
3. Complete checkout with the **4242** test card.
4. You will return to `/settings?success=true`.
5. In Firestore, the user document should show:
   - `subscriptionTier: "premium"`
   - `stripeCustomerId: "cus_..."`
   - `subscriptionEndsAt`: future date
6. Visit `/story/{date}` or `/archive` to confirm premium access.

## 4. Managing a Test Subscription

1. Go to `/settings`.
2. If premium, click **Manage Subscription**.
3. Stripe Billing Portal (test mode) lets you:
   - Cancel the subscription
   - Update payment method
   - View invoices

## 5. Webhook Testing

### Option A: Stripe CLI (recommended)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the generated `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

### Option B: Dashboard Webhooks

1. Stripe Dashboard → Developers → Webhooks → **Add endpoint**.
2. URL: `https://<your-vercel-app>/api/stripe/webhook`.
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Copy the signing secret into your environment variables.

## 6. Troubleshooting

- **Missing checkout link**: confirm `NEXT_PUBLIC_APP_URL` and Stripe keys are set.
- **Webhook signature errors**: verify the correct `STRIPE_WEBHOOK_SECRET` for each environment.
- **Need premium access without checkout?** Enable `NEXT_PUBLIC_ENABLE_DEV_PREMIUM_ACCESS=true` and add your email to `NEXT_PUBLIC_DEV_PREMIUM_EMAILS`.

Keep this doc nearby whenever you need to verify premium flows end-to-end. All steps are safe to repeat because Stripe Test Mode never charges real cards.

