import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly';

