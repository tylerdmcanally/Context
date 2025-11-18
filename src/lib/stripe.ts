import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

// Stripe will automatically use test mode if secret key starts with sk_test_
// No charges are made in test mode - perfect for testing!
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly';

