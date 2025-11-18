import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();
    
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing userId or email' },
        { status: 400 }
      );
    }
    
    // Get or create Stripe customer
    let customerId: string;
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (userData?.stripeCustomerId) {
      customerId = userData.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          firebaseUserId: userId,
        },
      });
      customerId = customer.id;
      
      await adminDb.collection('users').doc(userId).update({
        stripeCustomerId: customerId,
      });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
      },
    });
    
    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

