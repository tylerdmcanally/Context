import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        
        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Update user subscription
          const subscriptionEndsAt = new Date(subscription.current_period_end * 1000);
          await adminDb.collection('users').doc(userId).update({
            subscriptionTier: 'premium',
            subscriptionEndsAt,
          });
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by Stripe customer ID
        const usersSnapshot = await adminDb
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();
        
        if (!usersSnapshot.empty) {
          const userId = usersSnapshot.docs[0].id;
          const subscriptionEndsAt = new Date(subscription.current_period_end * 1000);
          
          if (subscription.status === 'active') {
            await adminDb.collection('users').doc(userId).update({
              subscriptionTier: 'premium',
              subscriptionEndsAt,
            });
          } else {
            await adminDb.collection('users').doc(userId).update({
              subscriptionTier: 'free',
              subscriptionEndsAt,
            });
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by Stripe customer ID
        const usersSnapshot = await adminDb
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();
        
        if (!usersSnapshot.empty) {
          const userId = usersSnapshot.docs[0].id;
          await adminDb.collection('users').doc(userId).update({
            subscriptionTier: 'free',
            subscriptionEndsAt: new Date(),
          });
        }
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

