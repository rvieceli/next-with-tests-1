import Stripe from 'stripe';
import { EventHandler } from 'pages/api/webhooks';
import * as fauna from 'app/services/fauna';

const updateSubscription: EventHandler = async (event) => {
  const subscription = event.data.object as Stripe.Subscription;

  const customerId = String(subscription.customer);

  const userRef = await fauna.getUserRefByCustomerId(customerId);

  const shouldWaitBecauseWasJustCreated = event.created - subscription.created;

  if (shouldWaitBecauseWasJustCreated) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await fauna.updateSubscription(subscription.id, {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  });
};

export { updateSubscription };
