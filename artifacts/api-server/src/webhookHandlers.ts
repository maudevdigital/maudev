import { getUncachableStripeClient } from "./lib/stripeClient.js";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer. " +
        "FIX: Ensure webhook route is registered BEFORE app.use(express.json())."
      );
    }

    // Verify webhook signature using Stripe SDK
    const stripe = await getUncachableStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } else {
      // In dev/sandbox without explicit secret, parse without verification
      // NOTE: In production, always set STRIPE_WEBHOOK_SECRET
      event = JSON.parse(payload.toString());
    }

    // Update our orders table based on Stripe events
    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      const orderId = session?.metadata?.orderId ? Number(session.metadata.orderId) : null;
      if (orderId && session?.payment_status === "paid") {
        await db.update(ordersTable)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(ordersTable.id, orderId));
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data?.object;
      const orderId = session?.metadata?.orderId ? Number(session.metadata.orderId) : null;
      if (orderId) {
        await db.update(ordersTable)
          .set({ status: "failed" })
          .where(eq(ordersTable.id, orderId));
      }
    }
  }
}
