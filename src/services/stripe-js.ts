import { loadStripe } from "@stripe/stripe-js";

const getStripeJs = () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export { getStripeJs };
