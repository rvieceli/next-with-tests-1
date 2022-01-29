import { NextApiRequest, NextApiResponse, NextConfig } from 'next';
import Stripe from 'stripe';

import { createSubscription } from 'app/services/stripe/createSubscription';
import { updateSubscription } from 'app/services/stripe/updateSubscription';
import { stripe } from 'app/services/stripe';
import { buffer } from 'app/utils/buffer';

type EventHandler = (
  event: Stripe.Event,
  request: NextApiRequest,
  response: NextApiResponse
) => Promise<void>;

const mappedEvents: Record<string, EventHandler> = {
  'customer.subscription.created': createSubscription,
  'customer.subscription.updated': updateSubscription,
  'customer.subscription.deleted': updateSubscription,
};

const webhooks = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
    return;
  }

  const signature = request.headers['stripe-signature'] as string;

  const body = await buffer(request);

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  const eventHandler = mappedEvents[event.type];

  if (eventHandler) {
    try {
      await eventHandler(event, request, response);
      response.status(200).json({ message: 'Event successfully processed' });
    } catch (e) {
      // TODO: manage the error properly
      console.log(`${event.type} error`, e);
      response.status(500).json({ message: `Handler error: "${e}"` });
    }
  } else {
    // TODO: manage a warning properly
    response.status(200).json({ message: 'Unhandled event' });
  }
};

const config: NextConfig = {
  api: {
    bodyParser: false,
  },
};

export default webhooks;

export { config };
export type { EventHandler };
