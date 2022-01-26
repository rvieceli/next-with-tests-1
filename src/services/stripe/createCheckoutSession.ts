import { stripe } from ".";

const createCheckoutSession = (customerId: string) =>
  stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    billing_address_collection: "required",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });

export { createCheckoutSession };
