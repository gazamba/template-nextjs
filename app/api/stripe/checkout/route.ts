import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { env } from "@/lib/env/server";
import { stripe } from "@/lib/billing/stripe";
import { db } from "@/lib/db";
import { customer } from "@/lib/billing/stripe-schema";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await req.json();

  if (!priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 },
    );
  }

  let [existing] = await db
    .select()
    .from(customer)
    .where(eq(customer.userId, session.user.id));

  if (!existing) {
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId: session.user.id },
    });

    [existing] = await db
      .insert(customer)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        stripeCustomerId: stripeCustomer.id,
      })
      .returning();
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: existing.stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.BETTER_AUTH_URL}/dashboard?checkout=success`,
    cancel_url: `${env.BETTER_AUTH_URL}/pricing?checkout=canceled`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
