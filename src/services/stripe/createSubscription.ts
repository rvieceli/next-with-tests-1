import Stripe from 'stripe';
import { EventHandler } from 'app/pages/api/webhooks';
import * as fauna from 'app/services/fauna';

const createSubscription: EventHandler = async (event) => {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = String(subscription.customer);

  const userRef = await fauna.getUserRefByCustomerId(customerId);

  await fauna.createSubscription({
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  });
};

export { createSubscription };
