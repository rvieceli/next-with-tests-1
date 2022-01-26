import { stripe } from ".";

const getSubscriptionById = (subscriptionId: string) =>
  stripe.subscriptions.retrieve(subscriptionId);

export { getSubscriptionById };
