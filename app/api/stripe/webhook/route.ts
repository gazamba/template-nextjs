import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env/server";
import { stripe } from "@/lib/billing/stripe";
import { db } from "@/lib/db";
import { customer, subscription } from "@/lib/billing/stripe-schema";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const item = sub.items.data[0];
      const [existing] = await db
        .select()
        .from(customer)
        .where(eq(customer.stripeCustomerId, sub.customer as string));

      if (!existing) break;

      await db
        .insert(subscription)
        .values({
          id: sub.id,
          customerId: existing.id,
          stripeSubscriptionId: sub.id,
          stripePriceId: item.price.id,
          status: sub.status,
          currentPeriodStart: new Date(item.current_period_start * 1000),
          currentPeriodEnd: new Date(item.current_period_end * 1000),
        })
        .onConflictDoUpdate({
          target: subscription.stripeSubscriptionId,
          set: {
            stripePriceId: item.price.id,
            status: sub.status,
            currentPeriodStart: new Date(item.current_period_start * 1000),
            currentPeriodEnd: new Date(item.current_period_end * 1000),
          },
        });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db
        .update(subscription)
        .set({ status: "canceled" })
        .where(eq(subscription.stripeSubscriptionId, sub.id));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
