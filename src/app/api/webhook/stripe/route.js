import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr'; // Or your preferred server client init method
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event;

  // Verify Stripe event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const data = event.data;
  const eventType = event.type;

  // Supabase admin client to update user records
  const supabase = createServerClient({ cookies });

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = await stripe.checkout.sessions.retrieve(data.object.id, {
          expand: ['line_items'],
        });

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        if (!email) {
          console.error('Missing email in Stripe customer');
          return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        // Upsert user in Supabase
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned
          throw error;
        }

        if (!existingUser) {
          await supabase.from('users').insert({
            email,
            stripe_customer_id: customerId,
            has_access: true,
            price_id: priceId,
          });
        } else {
          await supabase
            .from('users')
            .update({ has_access: true, price_id: priceId })
            .eq('email', email);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = await stripe.subscriptions.retrieve(data.object.id);
        const customerId = subscription.customer;

        // Revoke access in Supabase
        await supabase
          .from('users')
          .update({ has_access: false })
          .eq('stripe_customer_id', customerId);

        break;
      }

      default:
      // Unhandled events
    }
  } catch (e) {
    console.error(`Stripe Webhook Error [${eventType}]: ${e.message}`);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
