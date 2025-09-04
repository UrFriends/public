import { db } from "@/lib/firebase.js";
import { collection, doc, getDoc, setDoc } from "@firebase/firestore";
import * as logger from "firebase-functions/logger";
import type Stripe from "stripe";
import type { CustomerSubscription } from "../../subscriptions/functions/src/types/subscriptions.ts";

/**
 * Creates a Stripe customer and stores the customer ID in Firestore.
 * @param {Stripe} stripe - The Stripe instance.
 * @param {string} userId - The Firebase user ID.
 * @param {string} email - The user's email address.
 * @return {Promise<string>} The Stripe customer ID.
 */
export async function createStripeCustomer(
  stripe: Stripe,
  userId: string,
  email: string,
): Promise<string> {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        firebaseUID: userId,
      },
    });

    await setDoc(doc(collection(db, "subscriptions"), userId),
      {
        stripeCustomerId: customer.id,
      },
      { merge: true },
    );

    return customer.id;
  } catch (error) {
    logger.error("Error creating Stripe customer:", error);
    throw error;
  }
}

/**
 * Retrieves the Stripe customer ID for a user,
 * or creates a new Stripe customer if one does not exist.
 * @param {Stripe} stripe - The Stripe instance.
 * @param {string} userId - The Firebase user ID.
 * @param {string} email - The user's email address.
 * @return {Promise<string>} The Stripe customer ID.
 */
export async function getOrCreateStripeCustomer(
  stripe: Stripe,
  userId: string,
  email: string,
): Promise<string> {
  const userDoc = await getDoc(doc(collection(db, "subscriptions"), userId));
  const userData = userDoc.data();

  if (userData?.stripeCustomerId) {
    return userData.stripeCustomerId;
  }

  return createStripeCustomer(stripe, userId, email);
}

/**
 * Creates a Stripe Checkout Session for a subscription.
 * @param {Stripe} stripe - The Stripe instance.
 * @param {string} customerId - The Stripe customer ID.
 * @param {string} priceId - The Stripe price ID for the subscription.
 * @param {string} successUrl - The URL to redirect to after successful payment.
 * @param {string} cancelUrl - The URL to redirect to if the payment
 * is cancelled.
 * @return {Promise<string>} The URL of the Stripe Checkout Session.
 */
export async function createCheckoutSession(
  stripe: Stripe,
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url || "";
}

/**
 * Creates a Stripe Billing Portal session for a customer.
 * @param {Stripe} stripe - The Stripe instance.
 * @param {string} customerId - The Stripe customer ID.
 * @param {string} returnUrl - The URL to return to after managing billing.
 * @return {Promise<string>} The URL of the Stripe Billing Portal session.
 */
export async function createPortalSession(
  stripe: Stripe,
  customerId: string,
  returnUrl: string,
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Retrieves the active Stripe subscription for a customer.
 * @param {Stripe} stripe - The Stripe instance.
 * @param {string} customerId - The Stripe customer ID.
 * @return {Promise<CustomerSubscription | null>} The
 * subscription details or null if none.
 */
export async function getCustomerSubscription(
  stripe: Stripe,
  customerId: string,
): Promise<CustomerSubscription | null> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      expand: ["data.default_payment_method"],
    });

    if (subscriptions.data.length === 0) {
      return null;
    }

    const subscription = subscriptions.data[0];
    const price = subscription.items.data[0].price;
    const product = await stripe.products.retrieve(price.product as string);

    // Only allow "month" or "year" for interval
    const allowedIntervals = ["month", "year"] as readonly string[];
    type AllowedInterval = "month" | "year" | null;
    const interval: AllowedInterval =
      price.recurring &&
      allowedIntervals.includes(price.recurring.interval) ?
        (price.recurring.interval as AllowedInterval) :
        null;

    return {
      id: subscription.id,
      status: subscription.status,
      plan: {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: price.unit_amount ? price.unit_amount / 100 : 0,
        interval,
        features: [], // Stripe Product does not have 'features' by default
      },
      currentPeriodEnd: new Date(
        subscription.items.data[0].current_period_end ?
          subscription.items.data[0].current_period_end * 1000 :
          0,
      ).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  } catch (error) {
    logger.error("Error getting customer subscription:", error);
    throw error;
  }
}
